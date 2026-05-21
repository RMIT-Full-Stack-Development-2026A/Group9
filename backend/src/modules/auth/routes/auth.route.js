import express from 'express';
import multer from 'multer';
import { register, login } from '../controllers/auth.controller.js';
import { uploadToCloudinary } from '../../../middlewares/upload.middleware.js';

const router = express.Router();
// Use memory storage for small file uploads (avatars) and stream to Cloudinary.
const upload = multer({ storage: multer.memoryStorage() });

// Route: POST /api/auth/register
// - `upload.single('avatar')` parses multipart form-data and places file in `req.file`
// - `uploadToCloudinary` streams the in-memory buffer to Cloudinary and sets `req.file.cloudinaryUrl`
router.post('/register', upload.single('avatar'), uploadToCloudinary, register);

// Route: POST /api/auth/login
// - Simple JSON body expected: { identifier, password }
router.post('/login', login);

export default router;