import gameRoutes from "./routes/game.route.js";
import * as gameFacade from "./facade/game.facade.js";

export default function registerGameModule(app) {
	app.use("/api/game", gameRoutes);
}

export { gameFacade };