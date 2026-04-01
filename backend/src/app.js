import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Apply your API routes
app.use("/api", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API test success uwu");
});

export default app;