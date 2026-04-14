/**
 * ============================================================================
 * UPLOAD MIDDLEWARE (The Security Bouncer)
 * ============================================================================
 * Purpose: Intercepts file uploads from the frontend BEFORE they reach the Controller.
 * It validates the file type, restricts the file size to prevent server crashes,
 * and temporarily stores the file in RAM so we can forward it to Cloudinary.
 */
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import AppError from "../shared/errors/AppError.js";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const IMAGE_MIME_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
]);

let cloudinaryConfigured = false;
const ensureCloudinary = () => {
	if (cloudinaryConfigured) return;
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	cloudinaryConfigured = true;
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
	if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
		return callback(new AppError("Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.", 400));
	}

	return callback(null, true);
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

export const uploadAvatar = upload.single("avatar");
export const uploadImage = upload.single("image");

export const uploadToCloudinary = async (req, res, next) => {
	if (!req.file) return next();

	try {
		ensureCloudinary();
		const publicId = `avatar-${req.user?.id ?? req.userId ?? Date.now()}`;
		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder: "avatars",
					public_id: publicId,
					overwrite: true,
					transformation: [{ width: 200, height: 200, crop: "fill" }],
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
			stream.end(req.file.buffer);
		});

		req.file.cloudinaryUrl = result?.secure_url || null;
		return next();
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		return next(new AppError("Error uploading image", 500));
	}
};

export default upload;

