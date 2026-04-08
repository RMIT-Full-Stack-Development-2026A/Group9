import adminRoutes from "./routes/admin.route.js";

export default function registerAdminModule(app) {
	app.use("/api/admin", adminRoutes);
}