import * as multiplayerService from "./multiplayer.service.js";

export const createRoom = async (req, res) => {
  try {
    const room = await multiplayerService.createRoom(req.userId, req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getWaitingRooms = async (req, res) => {
  try {
    const rooms = await multiplayerService.getWaitingRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const room = await multiplayerService.joinRoom(req.params.id, req.userId, req.body.marker);
    res.json(room);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await multiplayerService.getRoom(req.params.id);
    res.json(room);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};