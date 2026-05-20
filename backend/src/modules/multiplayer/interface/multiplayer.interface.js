import * as multiplayerService from '../services/multiplayer.service.js';
import { toRoomDTO, toRoomListDTO } from '../dto/multiplayer.dto.js';

export const createRoom = async (...args) => {
  const room = await multiplayerService.createRoom(...args);
  return toRoomDTO(room);
};

export const getWaitingRooms = async (...args) => {
  const rooms = await multiplayerService.getWaitingRooms(...args);
  return rooms.map(toRoomListDTO);
};

export const getActiveRooms = async (...args) => {
  const rooms = await multiplayerService.getActiveRooms(...args);
  return rooms.map(toRoomDTO);
};

export const joinRoom = async (...args) => {
  const room = await multiplayerService.joinRoom(...args);
  return toRoomDTO(room);
};

export const closeRoom = async (...args) => {
  const room = await multiplayerService.closeRoom(...args);
  return toRoomDTO(room);
};

export const getRoom = async (...args) => {
  const room = await multiplayerService.getRoom(...args);
  return toRoomDTO(room);
};

export const processMove = (...args) => multiplayerService.processMove(...args);

export default {
  createRoom,
  getWaitingRooms,
  getActiveRooms,
  joinRoom,
  closeRoom,
  getRoom,
  processMove,
};

// export const createRoom = (userId, options) => multiplayerService.createRoom(userId, options);

// export const getWaitingRooms = () => multiplayerService.getWaitingRooms();

// export const getActiveRooms = () => multiplayerService.getActiveRooms();

// export const joinRoom = (roomId, userId, marker) => multiplayerService.joinRoom(roomId, userId, marker);

// export const closeRoom = (roomId) => multiplayerService.closeRoom(roomId);

// export const getRoom = (roomId) => multiplayerService.getRoom(roomId);
