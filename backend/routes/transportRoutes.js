import express from "express";
import {
  createTransportBooking,
  getTransports,
} from "../controllers/transportController.js";

const router = express.Router();

// POST: create booking
router.post("/", createTransportBooking);

// GET: fetch all bookings
router.get("/", getTransports);

export default router;
