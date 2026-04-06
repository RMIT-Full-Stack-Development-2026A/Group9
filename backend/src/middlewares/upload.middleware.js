/**
 * ============================================================================
 * UPLOAD MIDDLEWARE (The Security Bouncer)
 * ============================================================================
 * Purpose: Intercepts file uploads from the frontend BEFORE they reach the Controller.
 * It validates the file type, restricts the file size to prevent server crashes,
 * and temporarily stores the file in RAM so we can forward it to Cloudinary.
 */
import multer from "multer";
import AppError from "../modules/shared/errors/AppError.js";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const IMAGE_MIME_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
]);

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
	if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
		return callback(
			new AppError("Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.", 400)
		);
	}

	return callback(null, true);
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: MAX_FILE_SIZE_BYTES,
	},
});

export const uploadAvatar = upload.single("avatar");
export const uploadImage = upload.single("image");
export default upload;

