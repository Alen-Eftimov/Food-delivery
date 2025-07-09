const db = require('../db.js')

const addToCart = (req, res) => {
  const userId = req.body.userId;
  const { cartItems, itemId } = req.body;

  const sql = 'SELECT cart_data FROM users WHERE id = ?';

  db.query(sql, [userId], (error, results) => {
    if (error) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = JSON.parse(results[0].cart_data);

    const currentQty = cartData[itemId] || 0;
    const newQty = (cartItems[itemId] !== undefined) ? cartItems[itemId] : currentQty + 1;

    cartData[itemId] = newQty;

    const sql2 = 'UPDATE users SET cart_data = ? WHERE id = ?';
    db.query(sql2, [JSON.stringify(cartData), userId], (error, results) => {
      if (error) return res.status(400).json({ success: false, message: "Failed to update cart" });
      return res.status(200).json({ success: true, message: "Added To Cart" });
    });
  });
};

const removeFromCart = (req, res) => {
  const userId = req.body.userId;
  const { cartItems, itemId } = req.body;

  const sql = 'SELECT cart_data FROM users WHERE id = ?';

  db.query(sql, [userId], (error, results) => {
    if (error) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = JSON.parse(results[0].cart_data);

    if (cartItems[itemId] !== undefined) {
      const newQty = cartItems[itemId];

      if (newQty > 0) {
        cartData[itemId] = newQty;
      } else {
        delete cartData[itemId];
      }
    } else {
      const currentQty = cartData[itemId] || 0;
      if (currentQty > 1) {
        cartData[itemId] = currentQty - 1;
      } else {
        delete cartData[itemId];
      }
    }

    // Save updated cart data
    const sql2 = 'UPDATE users SET cart_data = ? WHERE id = ?';
    db.query(sql2, [JSON.stringify(cartData), userId], (error, results) => {
      if (error) return res.status(400).json({ success: false, message: "Failed to update cart" });
      return res.status(200).json({ success: true, message: "Removed From Cart", cartData: cartData });
    });
  });
};

const getCart = (req, res) => {
  const userId = req.body.userId;

  const sql = 'SELECT cart_data FROM users WHERE id = ?';  
  db.query(sql, [userId], (error, results) => {
    if (error) 
      return res.status(500).json({ success: false, message: "Error" });
    if (results.length > 0) {
      const cartData = JSON.parse(results[0].cart_data || "{}");
      return res.status(200).json({ success: true, cartData });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  });
};


module.exports = { addToCart, removeFromCart, getCart }