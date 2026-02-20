import express from "express";
import multer from "multer";
import path from "path";
import {
  createStaticCard,
  getStaticCards,
  getPublicStaticCards,
  getStaticCardById,
  updateStaticCard,
  deleteStaticCard,
  approveStaticCard,
  toggleStaticCardStatus,
  getStaticCardsByType,
  updateDisplayOrder,
} from "../controllers/staticCardController.js";
import { adminAuth } from "../middleware/authMiddleware.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "static-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const router = express.Router();

// Public routes (no authentication needed)
router.get("/public", getPublicStaticCards);
router.get("/public/type/:type", getStaticCardsByType);

// Protected admin routes with file upload
router.post("/", adminAuth, upload.array("images", 10), createStaticCard);
router.get("/", adminAuth, getStaticCards);
router.get("/:id", adminAuth, getStaticCardById);
router.put("/:id", adminAuth, upload.array("images", 10), updateStaticCard);
router.delete("/:id", adminAuth, deleteStaticCard);
router.put("/:id/approve", adminAuth, approveStaticCard);
router.put("/:id/toggle", adminAuth, toggleStaticCardStatus);
router.put("/order/bulk", adminAuth, updateDisplayOrder);

export default router;
