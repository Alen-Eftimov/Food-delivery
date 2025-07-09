const Stripe = require('stripe')
const dotenv = require('dotenv').config()
const db = require('../db.js')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {

  const frontend_url = process.env.FRONTEND_URL;

  const { userId, items, amount, address } = req.body;

  try {
      const line_items = items.map((item) => ({
          price_data: {
              currency: "usd",
              product_data: {
                  name: item.name
              },
              unit_amount: Math.round(item.price) * 100,
          },
          quantity: item.quantity
      }));

      line_items.push({
          price_data: {
              currency: 'usd',
              product_data: {
                  name: "Delivery Charges"
              },
              unit_amount: 2 * 100
          },
          quantity: 1
      });

      const encodedItems = encodeURIComponent(JSON.stringify(items));
      const encodedAddress = encodeURIComponent(JSON.stringify(address));

      const session = await stripe.checkout.sessions.create({
          line_items: line_items,
          mode: 'payment',
          success_url: `${frontend_url}/verify?success=true&userId=${userId}&amount=${amount}&address=${encodedAddress}&items=${encodedItems}`,
          cancel_url: `${frontend_url}/verify?success=false&userId=${userId}`
      });

      res.json({ success: true, session_url: session.url });
  } catch (error) {
      console.error("Error in placeOrder:", error);
      res.json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { success, userId, amount, address, items } = req.body;

  try {
    if (success === "true") {
      const decodedItems = JSON.parse(decodeURIComponent(items));
      const decodedAddress = JSON.parse(decodeURIComponent(address));
      const parsedAmount = parseFloat(amount);

      const itemsJsonString = JSON.stringify(decodedItems);
      const addressJsonString = JSON.stringify(decodedAddress);

      // Check if an identical order already exists and is marked as paid
      const checkOrderQuery = `
        SELECT id FROM orders
        WHERE user_id = ?
          AND items = ?
          AND amount = ?
          AND address = ?
          AND payment = 1
      `;
      const existingOrder = await new Promise((resolve, reject) => {
        db.query(checkOrderQuery, [userId, itemsJsonString, parsedAmount, addressJsonString], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      if (existingOrder.length > 0) {
        return res.json({ success: true, message: "Order already processed and paid." });
      }
     
      const orderQuery = 'INSERT INTO orders (user_id, items, amount, address, payment) VALUES (?, ?, ?, ?, ?)';
      const orderResult = await new Promise((resolve, reject) => {
          db.query(orderQuery, [userId, itemsJsonString, parsedAmount, addressJsonString, 1], (err, result) => {
              if (err) return reject(err);
              resolve(result);
          });
      });

      const updateUserQuery = 'UPDATE users SET cart_data = ? WHERE id = ?';
      await new Promise((resolve, reject) => {
          db.query(updateUserQuery, [JSON.stringify({}), userId], (err, result) => {
              if (err) return reject(err);
              resolve(result);
          });
      });

      res.json({ success: true, message: "Order placed and payment confirmed" });
    } else {
      res.json({ success: false, message: "Payment not successful or cancelled. Order not placed." });
    }
  } catch (error) {
    console.error("Error in verifyOrder:", error);
    res.status(500).json({ success: false, message: "Internal server error during order verification" });
  }
};

// user orders for frontend(client)
const userOrders = async (req, res) => {
  const { userId } = req.body; 
  try {
    const sql = 'SELECT * FROM orders WHERE user_id = ?'; 
    db.query(sql, [userId], (error, results) => {
      if (error)  return res.status(500).json({ success: false, message: "Error fetching orders" });          
      
      const parsedResults = results.map(order => {
        return {
          ...order,
          items: order.items ? JSON.parse(order.items) : [],  
          address: order.address ? JSON.parse(order.address) : {}, 
        };
      });
      res.status(200).json({ success: true, data: parsedResults });
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const query = 'SELECT * FROM orders';     
    db.query(query, (error, results) => {
      if (error) return res.status(500).json({ success: false, message: "Error fetching orders" });
    
      res.status(201).json({ success: true, data: results });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// api for updating order status (tracking)
const updateStatus = async (req, res) => {
  const {orderId, status} = req.body
  try {
    const sql = 'UPDATE orders SET status = ? WHERE id = ?'; 
    db.query(sql, [status, orderId], (error, results) => {
      if (error) return res.status(500).json({ success: false, message: "Error updating status" });
     
      res.status(201).json({ success: true, message: "Status updated successfuly." });
    });
  } catch (error) {
    res.status(500).json({success: false, message: "Error"})
  }
}


module.exports = { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }
