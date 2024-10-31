import express from 'express';
import upload from '../config/multerConfig.js';
import cloudinary from '../config/cloudinaryConfig.js';
import fs from 'fs';
import { saveVideoUrl } from '../test.js';

const router = express.Router();
router.post('/upload', upload.single('video'), async (req, res) => {
   
    try {
        const filePath = req.file.path;
           
        // Upload video to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, { resource_type: 'video' });
        console.log(result)
        // Save video URL to Neon database
        const videoUrl = result.secure_url;
        await saveVideoUrl(videoUrl);

        // Delete file from local temp storage
        console.log("here");
        fs.unlinkSync(filePath);
        
        res.status(200).json({ success: true, videoUrl });
    } catch (error) {
        console.log("hello");
        console.error(error);
        res.status(500).json({ success: false, error: 'Upload failed' });
    }
});

export default router;
