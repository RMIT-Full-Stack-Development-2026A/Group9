import dotenv from "dotenv";
import http from "http";
dotenv.config({ path: ".env" });
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./Realtime/socketServer.js";

const PORT = process.env.PORT || 3000;
connectDB();

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});