const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Set up multer for file storage (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload a course with multiple videos
app.post('/upload-course', upload.array('videos'), async (req, res) => {
    try {
        const { title, description, category, price, prerequisites } = req.body;

        // Create a new course
        const course = await prisma.course.create({
            data: {
                title,
                description,
                category,
                price: parseInt(price), // Assuming price is provided as a string
                prerequisites,
                // Add other course fields as necessary
            }
        });

        // Process each uploaded video
        const videoPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream((error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    // Create a new content entry for each video
                    return prisma.content.create({
                        data: {
                            title: file.originalname,
                            type: 'LECTURE',
                            sectionId: course.id, // Assuming you have a section ID
                            videoUrl: result.secure_url, // URL from Cloudinary
                            // Add other content fields as necessary
                        }
                    }).then(resolve).catch(reject);
                }).end(file.buffer);
            });
        });

        // Wait for all video uploads to complete
        await Promise.all(videoPromises);

        return res.status(200).json({ message: 'Course and videos uploaded successfully', course });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to upload course and videos' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});