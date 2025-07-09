const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
  const {token} = req.headers
  if (!token) {
    return res.status(401).json({success: false, message: 'Not Authorized Login Again'})
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    req.body = req.body || {}
    req.body.userId = token_decode.id
    req.body.role = token_decode.role
    next()

  } catch (error) {
    res.status(401).json({success: false, message: 'Error'})
  }
}

const verifyAdmin = (req, res, next) => {
  authMiddleware(req, res, () => {
      if (req.body.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
      } else {
        next()
      }
  })
}


module.exports = { authMiddleware, verifyAdmin }; 

