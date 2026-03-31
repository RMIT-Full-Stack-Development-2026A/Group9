import express from "express";
import authController from "../auth/auth.controller.js";

const router = express.Router();

//login request
router.post("/login", authController.login.bind(authController));

export default router;