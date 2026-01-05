import express from "express";
import { createSaleBooking } from "../controllers/SaleControllerreserve.js";

const router = express.Router();

// POST /sale (no multer now)
router.post("/", createSaleBooking);

export default router;
