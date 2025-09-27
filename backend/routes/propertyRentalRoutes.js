import express from "express";
import multer from "multer";
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  rejectProperty,
  getPropertyById,
} from "../controllers/propertyRentalController.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getProperties);
router.post("/", upload.single("img"), createProperty);
router.put("/:id", upload.single("img"), updateProperty); // ✅ Update property
router.delete("/:id", deleteProperty);

// ✅ Approve/Reject endpoints
router.put("/:id/approve", approveProperty);
router.put("/:id/reject", rejectProperty);
router.get("/:id", getPropertyById);

export default router;
