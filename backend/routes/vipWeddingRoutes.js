import express from "express";
import {
  createWeddingBooking,
  createWeddingPayment,
  verifyWeddingPayment,
} from "../controllers/vipWeddingController.js";

const router = express.Router();

// Create booking
router.post("/", createWeddingBooking);

// Initialize payment for method: chapa, telebirr, mpesa
router.post("/pay/:method", createWeddingPayment);

// Verify payment
router.get("/pay/:method/verify/:bookingId", verifyWeddingPayment);

export default router;
