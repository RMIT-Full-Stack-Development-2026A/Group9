import registerAdminModule from "./admin/index.js";
import registerAuthModule from "./auth/index.js";
import registerBillingModule from "./billing/index.js";
import registerGameModule from "./game/index.js";
import registerLeaderboardModule from "./leaderboard/index.js";
import registerMultiplayerModule from "./multiplayer/index.js";
import registerUserModule from "./user/index.js";

const registrars = [
	registerAuthModule,
	registerUserModule,
	registerAdminModule,
	registerBillingModule,
	registerGameModule,
	registerLeaderboardModule,
	registerMultiplayerModule,
];

export default function registerModules(app) {
	for (const registerModule of registrars) {
		registerModule(app);
	}
}