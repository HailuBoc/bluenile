import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createProperty,
  getProperties,
  verifyProperty,
  updatePropertyStatus,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST property
router.post(
  "/",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  createProperty
);

// GET properties
router.get("/", getProperties);

// Verify property
router.get("/verify", verifyProperty);

// Update status
router.patch("/:id/status", updatePropertyStatus);

// Delete property
router.delete("/:id", deleteProperty);

export default router;
