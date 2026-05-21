import userRoutes from "./routes/user.route.js";

// Register the user module under `/api/users`.
export default function registerUserModule(app) {
	app.use("/api/users", userRoutes);
}