import express from "express";
import {
  createTourBooking,
  getTourBookings,
  getTourBookingById,
  initChapaPayment,
} from "../controllers/tourBookingController.js";

const router = express.Router();

// POST: create a new tour booking
router.post("/", createTourBooking);

// GET: fetch all tour bookings
router.get("/", getTourBookings);

// GET: fetch a single booking by ID
router.get("/:id", getTourBookingById);

// POST: initialize Chapa payment
router.post("/pay/chapa", initChapaPayment);

export default router;
