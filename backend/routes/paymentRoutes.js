import express from "express";
import {
  createChapaPayment,
  verifyChapaPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// POST: Initialize Chapa payment
router.post("/chapa", createChapaPayment);

// GET: Verify Chapa payment
router.get("/chapa/verify/:bookingId", verifyChapaPayment);

export default router;
