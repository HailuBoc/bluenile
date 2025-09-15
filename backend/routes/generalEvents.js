import express from "express";
import multer from "multer";
import { createGeneralEvent } from "../controllers/generalEventController.js";

const router = express.Router();

// Multer storage for payment evidence
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// POST /general-events
router.post("/", upload.single("paymentEvidence"), createGeneralEvent);

export default router;
