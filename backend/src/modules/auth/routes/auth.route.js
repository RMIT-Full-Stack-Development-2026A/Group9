import express from 'express';
import multer from 'multer';
import { register, login } from '../controllers/auth.controller.js';
import { uploadToCloudinary } from '../../../middlewares/upload.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Route: POST /api/register
router.post('/register', upload.single('avatar'), uploadToCloudinary, register);

// Route: POST /api/login
router.post('/login', login);

export default router;