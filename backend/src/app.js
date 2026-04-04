import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/users/user.route.js";
import gameRoutes from "./modules/game/game.route.js";
import billingRoutes from "./modules/billing/billing.route.js";
import adminRoutes from "./modules/admin/admin.route.js";
import multiplayerRoutes from "./modules/multiplayer/multiplayer.route.js";
import leaderboardRoutes from "./modules/leaderboard/leaderboard.route.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/multiplayer", multiplayerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API test success uwu");
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.isOperational ? err.message : "Internal server error",
  });
});

export default app;