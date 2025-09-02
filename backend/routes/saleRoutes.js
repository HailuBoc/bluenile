import express from "express";
import { createSale } from "../controllers/saleController.js";

const router = express.Router();

// POST /sale
router.post("/", createSale);

export default router;
