import * as userService from "./user.service.js";

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.userId, req.body);
    res.json(user);
  } catch (error) {
    const messages = {
      "Email already in use": 409,
      "Current password is required": 400,
      "Current password is incorrect": 400,
      "User not found": 404,
    };
    const status = messages[error.message] || 500;
    res.status(status).json({ message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const user = await userService.updateAvatar(req.userId, req.file.cloudinaryUrl);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGameHistory = async (req, res) => {
  try {
    const sessions = await userService.getGameHistory(req.userId, req.query);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
