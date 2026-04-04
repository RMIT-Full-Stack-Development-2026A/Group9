import * as multiplayerRepository from "./multiplayer.repository.js";
import { AppError } from "../../shared/errors/AppError.js";

export const createRoom = async (userId, { boardSize = 10, marker = "X" }) => {
  const room = await multiplayerRepository.createRoom({
    player1: userId,
    boardSize,
    player1Marker: marker,
    status: "waiting",
  });
  return multiplayerRepository.findRoomById(room._id);
};

export const getWaitingRooms = async () => {
  return multiplayerRepository.findWaitingRooms();
};

export const getActiveRooms = async () => {
  return multiplayerRepository.findActiveRooms();
};

export const joinRoom = async (roomId, userId, marker) => {
  const room = await multiplayerRepository.findRoomById(roomId);
  if (!room) throw new AppError("Room not found.", 404);
  if (room.status !== "waiting") throw new AppError("Room is not available.", 400);
  if (room.player1._id.toString() === userId) throw new AppError("Cannot join your own room.", 400);

  return multiplayerRepository.updateRoom(roomId, {
    player2: userId,
    player2Marker: marker,
    status: "playing",
  });
};

export const closeRoom = async (roomId) => {
  return multiplayerRepository.closeRoom(roomId);
};

export const getRoom = async (roomId) => {
  const room = await multiplayerRepository.findRoomById(roomId);
  if (!room) throw new AppError("Room not found.", 404);
  return room;
};