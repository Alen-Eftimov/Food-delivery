require('dotenv').config()
const express = require('express')
const cors = require('cors')
const foodRouter = require('./routes/foodRoute.js')
const userRouter = require('./routes/userRoute.js')
const cartRouter = require('./routes/cartRoute.js')
const orderRouter = require('./routes/orderRoute.js')
const db = require('./db.js')

const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/food", foodRouter)
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) => {
  res.send('API Working')
})
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}!`)
  db.connect((error) => {
      if (error) throw error;
      console.log("Database Connected!")
  })
})