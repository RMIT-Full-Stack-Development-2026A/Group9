import userRoutes from "./routes/user.route.js";

export default function registerUserModule(app) {
	app.use("/api/users", userRoutes);
}