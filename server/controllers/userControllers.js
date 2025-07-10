const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const db = require('../db.js')

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}

const loginUser = async (req, res) => {
  try {
    const sql = 'SELECT * FROM users WHERE email = ?'
    db.query(sql, [req.body.email], (error, data) => {
      if (error) return res.status(500).json({ success: false, message: "error"});
      if (data.length === 0) return res.status(404).json({ success: false, message: "User doesn't exist" });

      const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          data[0].password
      )
      if (!isPasswordCorrect) return res.status(400).json({ success: false, message: "Wrong password or username!"})
      const token = jwt.sign(
          { id: data[0].id, role: data[0].role },  
          process.env.JWT_SECRET,
      )

      res.status(200).json({ success: true, token, user: {name: data[0].name, email: data[0].email} });
    })
  } catch (error) {
    res.status(400).json({ success: false, message: "Error" });
  }
}


const loginAdmin = async (req, res) => {
  try {
    const sql = 'SELECT * FROM users WHERE email = ?'
    db.query(sql, [req.body.email], (error, data) => {
      if (error) return res.status(500).json({ success: false, message: "error"});
      if (data.length === 0 || data[0] === null) return res.status(404).json({ success: false, message: "User doesn't exist" });

      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
      )
      if (!isPasswordCorrect) return res.status(400).json({ success: false, message: "Wrong password or username!"})
      const token = jwt.sign(
          { id: data[0].id, role: 'admin' }, 
          process.env.JWT_SECRET,
      )
      res.status(200).json({ success: true, token, user: {name: data[0].name, email: data[0].email, role: data[0].role,} });
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const sql = `SELECT * FROM users WHERE email = ?`
    db.query(sql, [...email], (error, data) => {
      if (error) return res.status(500).json({success: false, message: 'Error'})
      if (data.length > 0) return res.status(409).json({success: false, message: 'User already exist!'})
      if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email' }); 
      if (password.length < 8) return res.status(400).json({ success: false, message: 'Please enter a strong password' });
      
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt)

      const sql2 = `INSERT INTO users (name, email, password, cart_data,role) VALUES (?, ?, ?, ?, ?)`
      db.query(sql2, [name, email, hashedPassword, JSON.stringify({}), 'user'], (error, data) => {
        if (error) return res.status(500).json({success: false, message: 'Error inserting user'})
        const userId = data.insertId;
        const userRole = 'user';
        const token = jwt.sign(
          { id: userId, role: userRole },
          process.env.JWT_SECRET,
        )
        res.status(201).json({ success: true, token });
      })
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });    
  }
}

module.exports = { loginUser, loginAdmin, registerUser }
