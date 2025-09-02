import express from "express";
import { createReservation } from "../controllers/productController.js";

const router = express.Router();

// POST /reservations
router.post("/", createReservation);

export default router;
