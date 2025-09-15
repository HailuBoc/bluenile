import express from "express";
import {
  createReservation,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// GET /products/:id → fetch single product
router.get("/:id", getProductById);

// POST /products/reservations → create reservation
router.post("/", createReservation);

export default router;
