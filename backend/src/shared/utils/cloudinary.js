import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary with automatic resizing.
 * @param {Buffer} buffer - The file buffer from multer memoryStorage.
 * @param {string} folder - Cloudinary folder name.
 * @param {{ width: number, height: number }} size - Target dimensions.
 * @returns {Promise<string>} The secure URL of the uploaded image.
 */
export async function uploadToCloudinary(
	buffer,
	folder = "tictactoang/avatars",
	size = { width: 200, height: 200 }
) {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder,
				transformation: [
					{ width: size.width, height: size.height, crop: "fill", gravity: "face" },
				],
				format: "webp",
				resource_type: "image",
			},
			(error, result) => {
				if (error) return reject(error);
				resolve(result.secure_url);
			}
		);
		stream.end(buffer);
	});
}

export default cloudinary;
