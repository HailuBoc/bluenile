import express from "express";
import { createChapaPayment } from "../controllers/paymentController.js";

const router = express.Router();

// POST /payments/chapa
router.post("/chapa", createChapaPayment);

export default router;
