const express = require('express')
const { registerUser, loginUser, loginAdmin, logoutAdmin } = require('../controllers/userControllers.js')
const { verifyAdmin } = require('../middleware/auth.js');


const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin/login', loginAdmin)

userRouter.get('/admin/login', verifyAdmin, (req, res) => {
  res.status(201).json({ success: true, message: 'Welcome to the admin dashboard!', user: { id: req.body.userId, role: req.body.role } });
});

module.exports = userRouter;