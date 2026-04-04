import { Router } from "express";
import * as billingController from "./billing.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/wallet", authenticate, authorize("player", "admin"), billingController.getWallet);
router.post("/deposit", authenticate, authorize("player", "admin"), billingController.deposit);
router.post("/subscribe", authenticate, authorize("player", "admin"), billingController.subscribe);
router.get("/transactions", authenticate, authorize("player", "admin"), billingController.getTransactions);

export default router;