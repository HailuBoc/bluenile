import express from "express";
import multer from "multer";
import path from "path";
import { createReservation } from "../controllers/rentalController.js";

const router = express.Router();

// Multer setup for file uploads
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

// Match frontend FormData file name exactly
router.post("/", upload.single("paymentEvidence"), createReservation);

export default router;
