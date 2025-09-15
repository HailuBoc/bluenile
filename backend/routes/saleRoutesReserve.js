import express from "express";
import multer from "multer";
import { createSaleBooking } from "../controllers/SaleControllerreserve.js";

const router = express.Router();

// Multer config for payment evidence
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /sale
router.post("/", upload.single("paymentEvidence"), createSaleBooking);

export default router;
