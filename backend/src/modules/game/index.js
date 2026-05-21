import gameRoutes from "./routes/game.route.js";
import * as gameInterface from "./interface/game.interface.js";

// Register the game module under `/api/game`.
export default function registerGameModule(app) {
	app.use("/api/game", gameRoutes);
}

// Re-export the module interface for internal consumers.
export { gameInterface };