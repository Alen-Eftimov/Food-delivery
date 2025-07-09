const express = require('express')
const { addToCart, removeFromCart, getCart } = require('../controllers/cartControllers.js')
const {authMiddleware} = require('../middleware/auth.js')

cartRouter = express.Router()

cartRouter.post('/add', authMiddleware, addToCart)
cartRouter.put('/remove', authMiddleware, removeFromCart)
cartRouter.post('/get', authMiddleware, getCart)

module.exports = cartRouter