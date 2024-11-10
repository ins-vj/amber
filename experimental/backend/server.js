import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import upload from './config/multerConfig.js';
import cloudinary from './config/cloudinaryConfig.js';
import { saveVideoUrl } from './test.js';
import fs from 'fs';

dotenv.config({ path: './.env' });

const app = express();
app.use(cors()); // Enable CORS

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle video uploads
app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        console.log("Received file:", req.file); // Log received file
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path; // Path where multer saves the file

        // Upload video to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, { resource_type: 'video' });
        const videoUrlCloudinary = result.secure_url;

        // Save the Cloudinary video URL to the Neon database
        await saveVideoUrl(videoUrlCloudinary);

        // Delete the temporary file from local storage
        await fs.promises.unlink(filePath);
        console.log("File uploaded and database updated successfully.");

        res.status(200).json({ message: 'Video URL saved successfully!', videoUrl: videoUrlCloudinary });
    } catch (error) {
        console.error("Error in upload:", error);
        res.status(500).json({ error: 'Failed to save video URL' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
