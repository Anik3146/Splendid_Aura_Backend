require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const router = express.Router();


// Cloudinary configuration (use environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    // Check if the upload directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // Store file temporarily in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validate file type (only image files)
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Please upload an image file."), false);
    }
    cb(null, true); // Accept the file
  },
});

// Upload image to Cloudinary endpoint
router.post("/add", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Images", // Upload the file to a folder called 'Images'
    });

    // Delete the file from the local filesystem after upload
    fs.unlinkSync(req.file.path);

    // Respond with the uploaded image URL
    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url, // URL of the uploaded image
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image to Cloudinary",
      error: error.message,
    });
  }
});



module.exports = router;
