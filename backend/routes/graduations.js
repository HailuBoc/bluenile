import express from "express";
import multer from "multer";
import { createGraduation } from "../controllers/graduationController.js";

const router = express.Router();

// Configure multer for payment evidence
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /graduations
router.post("/", upload.single("paymentEvidence"), createGraduation);

export default router;
