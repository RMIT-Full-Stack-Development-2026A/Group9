import { Router } from "express";
import { meController } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/me", authMiddleware, meController);

export default userRouter;
