import express from "express";
import { createVipTourBooking } from "../controllers/vipTourController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

const upload = multer({ storage });

// POST /vip-bookings
router.post("/", upload.single("paymentProof"), createVipTourBooking);

export default router;
