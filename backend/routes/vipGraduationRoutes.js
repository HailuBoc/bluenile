import express from "express";
import {
  createGraduationBooking,
  createPayment,
  verifyPayment,
} from "../controllers/vipGraduationController.js";

const router = express.Router();

// Create Graduation Booking
router.post("/", createGraduationBooking);

// Payment initialization
router.post("/:method", createPayment);

// Payment verification
router.get("/:method/verify/:bookingId", verifyPayment);

export default router;
