import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import upload from './config/multerConfig.js';
import fs from 'fs/promises';
import cloudinary from './config/cloudinaryConfig.js'; // Your Cloudinary configuration
dotenv.config({
    path:"./.env"
});
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Allow CORS from your frontend domain (e.g., http://localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',  // Adjust this as per your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware for parsing JSON
app.use(express.json());

// Course assets upload endpoint
app.post('/upload-course-assets', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'courseVideos', maxCount: 10 },
]), async (req, res) => {
  try {
    const files = req.files;

    const uploadToCloudinary = async (filePath, folder) => {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto', // Handles images, videos, etc.
      });
      await fs.unlink(filePath); // Remove temp file after upload
      return result.secure_url;
    };

    // Upload files to Cloudinary
    const uploadedAssets = {};

    if (files.thumbnail) {
      uploadedAssets.thumbnail = await uploadToCloudinary(files.thumbnail[0].path, 'course_assets/thumbnail');
    }

    if (files.introVideo) {
      uploadedAssets.introVideo = await uploadToCloudinary(files.introVideo[0].path, 'course_assets/introVideo');
    }

    if (files.banner) {
      uploadedAssets.banner = await uploadToCloudinary(files.banner[0].path, 'course_assets/banner');
    }

    if (files.courseVideos) {
      uploadedAssets.courseVideos = await Promise.all(
        files.courseVideos.map(file =>
          uploadToCloudinary(file.path, 'course_assets/courseVideos')
        )
      );
    }

    res.status(200).json({
      success: true,
      message: 'Assets uploaded successfully',
      assets: uploadedAssets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error uploading assets',
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
