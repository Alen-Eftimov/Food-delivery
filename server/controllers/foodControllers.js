const db = require('../db.js');
const cloudinary = require('cloudinary').v2;

const addFood = (req, res) => {
  const imageUrl = req.file.path;
  const sql = `INSERT INTO food(name, description, price, image, category) VALUES (?, ?, ?, ?, ?)`;

  const values = [
    req.body.name,
    req.body.description,
    req.body.price,
    imageUrl,
    req.body.category,
  ];

  db.query(sql, values, (error, data) => {
    if (error) {
      console.error("Error adding food to DB:", error);
      if (imageUrl) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          cloudinary.uploader.destroy(`food_items/${publicId}`) // Use folder/public_id
            .then(result => console.log('Cleaned up Cloudinary image:', result))
            .catch(err => console.error('Error cleaning up Cloudinary image:', err));
      }
      return res.status(500).json({success: false,  message: 'Failed to add food item to database.'});
    }
    return res.status(200).json({success: true, message: 'Food item added successfully'});
  });
};

// All food list
const listFood = async (req, res) => {
  try {
    const sql = 'SELECT * FROM food';
    db.query(sql, (error, food) => {
      if (error) {
        console.error("Error fetching food list:", error);
        return res.status(500).json({success: false, message: "Error fetching food list."});
      }
      return res.status(200).json({success: true, data: food});
    });    
  } catch (error) {
    console.error("Error in listFood catch block:", error);
    res.status(500).json({success: false, message: "Error"});
  }
};

// Remove food
const removeFood = async (req, res) => {
  try {
    const foodId = req.body.id;
    if (!foodId) {
      return res.status(400).json({ success: false, message: 'Food ID is required.' });
    }

    const selectSql = `SELECT image FROM food WHERE id = ?`;
    db.query(selectSql, [foodId], async (error, results) => {
        if (error) {
            console.error("Error selecting image for removal:", error);
            return res.status(500).json({ success: false, message: 'Database error fetching image.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Food item not found." });
        }

        const food = results[0];
        if (food.image) {
            try {                
                const parts = food.image.split('/');
                const folderIndex = parts.indexOf('food_items');
                if (folderIndex !== -1 && parts.length > folderIndex + 1) {
                    const publicIdWithExtension = parts.slice(folderIndex).join('/').split('.')[0];
                    const deleteCloudinaryResult = await cloudinary.uploader.destroy(publicIdWithExtension);
                    if (deleteCloudinaryResult.result !== 'ok' && deleteCloudinaryResult.result !== 'not found') {
                      console.warn("Cloudinary image deletion might have failed:", deleteCloudinaryResult);
                    }
                } else {
                    console.warn("Could not extract Cloudinary public ID from URL:", food.image);
                }
            } catch (imageError) {
              console.error("Error deleting image from Cloudinary:", imageError);
            }
        }

        // Now, delete the record from the database
        const deleteSql = 'DELETE FROM food WHERE id = ?';
        db.query(deleteSql, [foodId], (deleteError, deleteResult) => {
            if (deleteError) {
                console.error("Error deleting food from database:", deleteError);
                return res.status(500).json({ success: false, message: "Error deleting food item from database." });
            }
            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Food item not found in database for deletion." });
            }
            res.status(200).json({ success: true, message: "Food item removed successfully." });
        });
    });

  } catch (error) {
    console.error("Error in removeFood catch block:", error);
    res.status(500).json({success: false, message: "Internal server error."});
  }
};

module.exports = {addFood, listFood, removeFood};