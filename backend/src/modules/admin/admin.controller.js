import * as adminService from "./admin.service.js";

export const getAllPlayers = async (req, res) => {
  try {
    const players = await adminService.getAllPlayers();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const togglePlayerStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await adminService.togglePlayerStatus(req.params.id, isActive);
    res.json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getAllGameRooms = async (req, res) => {
  try {
    const rooms = await adminService.getAllGameRooms(req.query);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const closeGameRoom = async (req, res) => {
  try {
    const room = await adminService.closeGameRoom(req.params.id);
    res.json({ message: "Game room closed", room });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
