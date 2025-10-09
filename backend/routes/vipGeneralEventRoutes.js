import express from "express";
import {
  createGeneralEventBooking,
  createPayment,
  verifyPayment,
} from "../controllers/vipGeneralEventController.js";

const router = express.Router();

// POST: create booking
router.post("/", createGeneralEventBooking);

// POST: payment initialization
router.post("/pay/:method", createPayment);

// GET: verify payment
router.get("/pay/:method/verify/:bookingId", verifyPayment);

export default router;
