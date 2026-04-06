import { io } from "socket.io-client";
import { WS_URL } from "../config/api.config.js";

let socket = null;

export const connectSocket = (userId, username) => {
  if (socket?.connected) return socket;
  if (socket) socket.disconnect();
  socket = io(WS_URL, {
    transports: ["websocket", "polling"],
  });
  socket._userId = userId;
  socket._username = username;
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
