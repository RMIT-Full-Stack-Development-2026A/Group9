import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route.js";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);

//test route
app.get("/", (req, res) => {
  res.send("API test success uwu");
});

export default app;