import express from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.route.js";
import userRouter from "./modules/users/user.route.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API test success uwu");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

export default app;