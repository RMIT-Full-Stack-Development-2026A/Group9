import gameRoutes from "./routes/game.route.js";
import * as gameInterface from "./interface/game.interface.js";

export default function registerGameModule(app) {
	app.use("/api/game", gameRoutes);
}

export { gameInterface };