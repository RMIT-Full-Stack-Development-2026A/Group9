import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const resizeAvatar = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `avatar-${req.userId}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(200, 200, { fit: "cover" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(uploadDir, filename));

    req.file.filename = filename;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error processing image" });
  }
};
