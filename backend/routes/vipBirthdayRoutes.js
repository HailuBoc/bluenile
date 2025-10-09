import express from "express";
import {
  createBirthdayBooking,
  getAllBirthdayBookings,
  getBirthdayBookingById,
  updateBirthdayBookingStatus,
} from "../controllers/vipBirthdayController.js";

const router = express.Router();

// Public routes
router.post("/", createBirthdayBooking);
router.get("/", getAllBirthdayBookings);
router.get("/:id", getBirthdayBookingById);

// Admin / internal route
router.patch("/:id/status", updateBirthdayBookingStatus);

export default router;
