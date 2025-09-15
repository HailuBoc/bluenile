import express from "express";
import multer from "multer";
import path from "path";
import {
  createBirthdayBooking,
  getBirthdayBookings,
} from "../controllers/birthdayController.js";

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

// Routes
router.post("/", upload.single("paymentEvidence"), createBirthdayBooking);
router.get("/", getBirthdayBookings);

export default router;
