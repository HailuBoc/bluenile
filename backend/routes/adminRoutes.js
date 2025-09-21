import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updatePropertyStatus,
  updateProperty, // <-- new controller
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

// Property routes
router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById);
router.post("/properties", upload.single("image"), createProperty);
router.patch("/properties/:id/status", updatePropertyStatus);
router.patch("/properties/:id", upload.single("image"), updateProperty); // <-- edit/update
router.delete("/properties/:id", deleteProperty);
router.get("/approved", getApprovedProperties);

// Admin login & verify
router.post("/login", loginAdmin);
router.get("/verify-token", adminAuth, verifyToken);

// Bookings
router.get("/bookings", getAllBookings);
router.delete("/bookings/:id", deleteBooking);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Admin settings
router.get("/settings", adminAuth, getSettings);
router.put("/settings", adminAuth, updateSettings);

router.get("/", adminAuth, getAllBookingsForAdmin);
// routes/cars.js

export default router;
