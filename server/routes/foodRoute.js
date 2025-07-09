const express = require('express');
const { addFood, listFood, removeFood } = require('../controllers/foodControllers.js');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Import Cloudinary v2
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Import CloudinaryStorage

const foodRouter = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage Engine for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'food_items',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

foodRouter.post('/add', upload.single('image'), addFood);
foodRouter.get('/list', listFood);
foodRouter.delete('/remove', removeFood);

module.exports = foodRouter;