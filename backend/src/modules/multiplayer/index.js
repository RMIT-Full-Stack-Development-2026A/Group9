import multiplayerRoutes from "./routes/multiplayer.route.js";

// Register multiplayer routes under `/api/multiplayer`.
export default function registerMultiplayerModule(app) {
	app.use("/api/multiplayer", multiplayerRoutes);
}