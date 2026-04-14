import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes/auth.route.js";
import userRoutes from "./modules/user/routes/user.route.js";
import AppError from "./shared/errors/AppError.js";

const app = express();

// middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both dev ports
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TicTacToang backend is running",
  });
});

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message: err.message || "Internal server error",
    ...(err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
});

// CORS is already applied above; environment-specific CORS rules can be set in server startup if needed.

export default app;