import multiplayerRoutes from "./routes/multiplayer.route.js";

export default function registerMultiplayerModule(app) {
	app.use("/api/multiplayer", multiplayerRoutes);
}