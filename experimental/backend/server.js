// server-update.js
import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import upload from './config/multerConfig.js';
import cloudinary from './config/cloudinaryConfig.js';
import fs from "fs";

dotenv.config({
    path: "./.env"
});

const app = express();
app.use(cors());
app.use(express.json());

// Create course route
app.post('/create-course', async (req, res) => {
    try {
        const courseId = `course_${Date.now()}`;
        console.log(`Created new course with ID: ${courseId}`);
        res.status(200).json({ 
            message: 'Course ID generated successfully!',
            courseId 
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ error: 'Failed to generate course ID' });
    }
});

// Save course structure route
app.post('/save-course-structure', async (req, res) => {
    try {
        const { courseId, chapters } = req.body;
        console.log('Course Structure:', {
            courseId,
            chapters: chapters.map(chapter => ({
                id: chapter.id,
                name: chapter.name,
                subtopics: chapter.subtopics.map(subtopic => ({
                    id: subtopic.id,
                    name: subtopic.name,
                    videoDescription: subtopic.videoDescription,
                    videoUrl: subtopic.videoUrl,
                    publicId: subtopic.publicId,
                    duration: subtopic.duration
                }))
            }))
        });
        res.status(200).json({ 
            message: 'Course structure saved successfully!' 
        });
    } catch (error) {
        console.error('Save structure error:', error);
        res.status(500).json({ error: 'Failed to save course structure' });
    }
});

// Subtopic video upload route
app.post('/upload-subtopic-video', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { courseId, courseName, chapterId, subtopicId } = req.body;
        const filePath = req.file.path;
        const folderPath = `courses/${courseId}/${chapterId}/${subtopicId}`;

        const result = await cloudinary.uploader.upload(filePath, {
            folder: folderPath,
            resource_type: "video",
            eager: [
                { streaming_profile: "full_hd", format: "m3u8" },
                { format: "mp4", transformation: [{ quality: "auto" }] }
            ],
            eager_async: true,
        });

        console.log('Subtopic Video Upload Result:', {
            courseId,
            courseName,
            chapterId,
            subtopicId,
            videoUrl: result.secure_url,
            publicId: result.public_id,
            duration: result.duration
        });

        await fs.promises.unlink(filePath);

        res.status(200).json({
            message: 'Video uploaded successfully!',
            videoUrl: result.secure_url,
            publicId: result.public_id,
            duration: result.duration
        });
    } catch (error) {
        console.error('Subtopic video upload error:', error);
        res.status(500).json({ error: 'Failed to upload video' });
        
        // Cleanup on error
        if (req.file && req.file.path) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to clean up file:', unlinkError);
            }
        }
    }
});

// Promo video upload route
app.post('/upload-promo-video', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { courseId, courseName } = req.body;
        const filePath = req.file.path;

        const result = await cloudinary.uploader.upload(filePath, {
            folder: `courses/${courseId}/promo`,
            resource_type: "video",
            eager: [
                { streaming_profile: "full_hd", format: "m3u8" },
                { format: "mp4", transformation: [{ quality: "auto" }] }
            ],
            eager_async: true,
        });

        console.log('Promo Video Upload Result:', {
            courseId,
            courseName,
            videoUrl: result.secure_url,
            publicId: result.public_id,
            duration: result.duration
        });

        await fs.promises.unlink(filePath);

        res.status(200).json({
            message: 'Promo video uploaded successfully!',
            videoUrl: result.secure_url,
            publicId: result.public_id,
            duration: result.duration
        });
    } catch (error) {
        console.error('Promo video upload error:', error);
        res.status(500).json({ error: 'Failed to upload promo video' });
        
        // Cleanup on error
        if (req.file && req.file.path) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to clean up file:', unlinkError);
            }
        }
    }
});

// Thumbnail upload route
app.post('/upload-thumbnail', upload.single('thumbnail'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No thumbnail uploaded' });
        }

        const { courseId } = req.body;
        const filePath = req.file.path;

        const result = await cloudinary.uploader.upload(filePath, {
            folder: `courses/${courseId}/thumbnail`,
            resource_type: "image",
            transformation: [
                { width: 1280, height: 720, crop: "fill" },
                { quality: "auto" }
            ]
        });

        console.log('Thumbnail Upload Result:', {
            courseId,
            thumbnailUrl: result.secure_url,
            publicId: result.public_id
        });

        await fs.promises.unlink(filePath);

        res.status(200).json({
            message: 'Thumbnail uploaded successfully!',
            thumbnailUrl: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Thumbnail upload error:', error);
        res.status(500).json({ error: 'Failed to upload thumbnail' });
        
        // Cleanup on error
        if (req.file && req.file.path) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to clean up file:', unlinkError);
            }
        }
    }
});

// Banner upload route
app.post('/upload-banner', upload.single('banner'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No banner uploaded' });
        }

        const { courseId } = req.body;
        const filePath = req.file.path;

        const result = await cloudinary.uploader.upload(filePath, {
            folder: `courses/${courseId}/banner`,
            resource_type: "image",
            transformation: [
                { width: 1920, height: 1080, crop: "fill" },
                { quality: "auto" }
            ]
        });

        console.log('Banner Upload Result:', {
            courseId,
            bannerUrl: result.secure_url,
            publicId: result.public_id
        });

        await fs.promises.unlink(filePath);

        res.status(200).json({
            message: 'Banner uploaded successfully!',
            bannerUrl: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Banner upload error:', error);
        res.status(500).json({ error: 'Failed to upload banner' });
        
        // Cleanup on error
        if (req.file && req.file.path) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to clean up file:', unlinkError);
            }
        }
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});