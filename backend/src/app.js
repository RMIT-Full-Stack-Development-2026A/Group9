/**
 * ============================================================================
 * APP BOOTSTRAP FILE PURPOSE
 * ============================================================================
 * Purpose: Creates and configures the Express application instance.
 * This is shared infrastructure, not feature business-logic code.
 *
 * Responsibilities:
 * 1) Register global middlewares.
 * 2) Mount module routes via module registry.
 * 3) Provide centralized not-found and error handling.
 */

import express from "express";
import cors from "cors";
import registerModules from "./modules/index.js";
import AppError from "./shared/errors/AppError.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TicTacToang backend is running",
  });
});

registerModules(app);

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

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

export default app;