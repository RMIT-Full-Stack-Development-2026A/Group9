import gameRoutes from "./routes/game.route.js";

export default function registerGameModule(app) {
	app.use("/api/game", gameRoutes);
}