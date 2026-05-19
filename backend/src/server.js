import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";

const PORT = process.env.PORT || 3000;
connectDB();

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});