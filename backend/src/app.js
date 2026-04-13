import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes/auth.route.js";
import AppError from "./shared/errors/AppError.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Apply your API routes
app.use("/api", authRoutes);

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

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

export default app;