import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/users/user.route.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API test success uwu");
});

export default app;