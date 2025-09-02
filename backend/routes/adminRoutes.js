import express from "express";
import {
  getPendingBookings,
  verifyBooking,
} from "../controllers/adminController.js";

const router = express.Router();

// GET all pending Telebirr/CBE bookings
router.get("/pending", getPendingBookings);

// POST verify a booking
router.post("/verify/:id", verifyBooking);

export default router;
