import dotenv from "dotenv";
dotenv.config();
import { createServer } from "node:http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./modules/Realtime/socketServer.js";

const PORT = process.env.PORT || 3000;
connectDB();

const server = createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});