// routes/adminRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllProperties,
  createProperty,
  updatePropertyStatus,
  deleteProperty,
  loginAdmin,
  verifyToken,
  getAllBookings,
  deleteBooking,
  getAllUsers,
  deleteUser,
  getSettings,
  updateSettings,
  getAllBookingsForAdmin,
  getApprovedProperties,
} from "../controllers/adminController.js";
import { adminAuth } from "../middleware/authMiddleware.js";
const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.get("/properties", getAllProperties); // Get all properties (optionally filter by status)
router.post("/properties", upload.single("image"), createProperty); // Add new property
router.patch("/properties/:id/status", updatePropertyStatus); // Approve/reject property
router.delete("/properties/:id", deleteProperty); // Delete property
router.get("/approved", getApprovedProperties);
// Admin

router.post("/login", loginAdmin);
router.get("/verify-token", adminAuth, verifyToken);
// bookings

router.get("/bookings", getAllBookings);
router.delete("/bookings/:id", deleteBooking);
// Users

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
// Admin settings

router.get("/settings", adminAuth, getSettings);
router.put("/settings", adminAuth, updateSettings);

router.get("/", adminAuth, getAllBookingsForAdmin);

export default router;
