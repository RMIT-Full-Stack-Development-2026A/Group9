/**
 * ============================================================================
 * SERVER RUNTIME FILE PURPOSE
 * ============================================================================
 * Purpose: Entry point that boots environment config, database connection,
 * HTTP server, and realtime socket server.
 * This is integration infrastructure and should stay stable for all modules.
 */

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