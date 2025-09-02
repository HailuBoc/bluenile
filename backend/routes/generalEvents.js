import express from "express";
import {
  createGeneralEventBooking,
  initChapaPayment,
  getGeneralEventBookings,
  getGeneralEventBookingById,
} from "../controllers/generalEventController.js";

const router = express.Router();

// Routes
router.post("/", createGeneralEventBooking); // create booking
router.post("/pay/chapa", initChapaPayment); // initialize Chapa payment
router.get("/", getGeneralEventBookings); // get all bookings
router.get("/:id", getGeneralEventBookingById); // get booking by ID

export default router;
