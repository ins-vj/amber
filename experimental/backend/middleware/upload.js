// backend/middleware/upload.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Adjust this if necessary
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Store with original file name
    }
});

export const upload = multer({storage});
