import authRoutes from "./routes/auth.route.js";

export default function registerAuthModule(app) {
  app.use("/api/auth", authRoutes);
}
