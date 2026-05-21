// Admin module registration
// Mounts admin-related routes under `/api/admin` and centralizes
// the module's public entry point for the application bootstrap.
import adminRoutes from "./routes/admin.route.js";

export default function registerAdminModule(app) {
	app.use("/api/admin", adminRoutes);
}