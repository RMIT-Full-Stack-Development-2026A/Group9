import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocketServer } from "./realtime/socketServer.js";

const PORT = process.env.PORT || 3000;
connectDB();

const server = http.createServer(app);
initSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});