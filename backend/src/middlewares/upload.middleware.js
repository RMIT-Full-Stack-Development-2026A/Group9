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
// Lazily configure Cloudinary from env vars on first use. Doing this lazily
// keeps startup fast when image uploads are not required and allows the
// server to run even if Cloudinary credentials are not present in dev.
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

// Validate incoming file MIME type early to reject non-image payloads.
// `multer` will call this before putting the file into memory.
const fileFilter = (req, file, callback) => {
	if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
		return callback(new AppError("Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.", 400));
	}

	return callback(null, true);
};

// Use memory storage so we can stream the file directly to Cloudinary
// without writing to disk. Files are limited in size by MAX_FILE_SIZE_BYTES
// to avoid excessive memory usage.
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
		// Ensure configuration is loaded
		ensureCloudinary();

		// Build a predictable public id. Prefer the authenticated user's id
		// when available so updates overwrite the same file. Fallback to a
		// timestamp when no user context exists.
		const publicId = `avatar-${req.user?.id ?? req.userId ?? Date.now()}`;

		// Upload via Cloudinary upload_stream using the in-memory buffer
		// so we never write to disk on the server. The promise wrapper
		// converts the callback API into an async/await friendly form.
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

		// Attach the hosted URL to the request for downstream handlers
		req.file.cloudinaryUrl = result?.secure_url || null;
		return next();
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		return next(new AppError("Error uploading image", 500));
	}
};

export default upload;

