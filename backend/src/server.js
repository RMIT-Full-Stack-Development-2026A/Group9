import dotenv from "dotenv";
// Load environment variables from .env into process.env early
dotenv.config({ path: ".env" });
import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { initSocket } from "./socket/index.js";

const PORT = process.env.PORT || 3000;

// Establish DB connection before starting the HTTP server so the app
// fails fast if the database is not reachable.
connectDB();

// Create the Node HTTP server and attach Express `app`.
const server = createServer(app);

// Initialize Socket.IO on the same HTTP server to enable real-time
// multiplayer features. This registers authentication middleware and
// per-connection handlers.
initSocket(server);

// Start listening after DB and socket are initialized
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
