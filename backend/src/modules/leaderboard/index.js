import leaderboardRoutes from "./routes/leaderboard.route.js";

export default function registerLeaderboardModule(app) {
	app.use("/api/leaderboard", leaderboardRoutes);
}