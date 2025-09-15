import express from "express";
import { createWeddingBooking } from "../controllers/weddingBookingController.js"; // fixed import

const router = express.Router();

// POST /weddings
router.post("/", createWeddingBooking);

export default router;
