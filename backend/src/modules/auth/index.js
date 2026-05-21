import authRoutes from "./routes/auth.route.js";

// Register auth routes under the `/api/auth` mount point
export default function registerAuthModule(app) {
  app.use("/api/auth", authRoutes);
}
