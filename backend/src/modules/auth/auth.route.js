import { Router } from "express";
import { loginController, logoutController } from "./Controller/auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/logout", authMiddleware, logoutController);

export default authRouter;
