// backend/server.js
import express from 'express';
import dotenv from "dotenv"
import cors from 'cors'; // Import CORS
import upload from './config/multerConfig.js'; // Your multer upload middleware
import cloudinary from './config/cloudinaryConfig.js'; // Your Cloudinary configuration
import { saveVideoUrl } from './test.js'; // Your Neon database client
import fs from "fs";
dotenv.config({
    path:"./.env"
});

const app = express();
app.use(cors()); // Enable CORS with default settings

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle video uploads
app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const filePath = req.file.path; // Path where multer saves the file

        const options = {
            // public_id: "mountain",
            resource_type: "video",
            type: "upload",
            eager: [
              { streaming_profile: "full_hd", format: "m3u8" },
              {
                format: "mp4",
                transformation: [{ quality: "auto" }],
              },
            ],
            eager_async: true,
            eager_notification_url:
              "https://webhook.site/e22fcd34-dfb7-431d-88f6-a1db871b4adc",
          };
          

        // Upload video to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, options);
        const videoUrlCloudinary = result.secure_url;
        const publicUrl = result.public_id;
        console.log(result)

        // Save the Cloudinary video URL to the Neon database
        await saveVideoUrl(videoUrlCloudinary,publicUrl);

        // Delete the temporary file from local storage
        await fs.promises.unlink(filePath);
        console.log("working till here");

        res.status(200).json({ message: 'Video URL saved successfully!', videoUrl: videoUrlCloudinary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save video URL' });
    }
});

// Start your Express server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
