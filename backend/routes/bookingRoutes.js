import express from "express";
import multer from "multer";
import path from "path";
import { createBooking } from "../controllers/bookingController.js";

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /propertyrentals
router.post("/", upload.single("paymentEvidence"), createBooking);

export default router;
