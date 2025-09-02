import express from "express";
import { createReservation } from "../controllers/rentalController.js";

const router = express.Router();

// POST /products/reservations
router.post("/", createReservation);

export default router;
