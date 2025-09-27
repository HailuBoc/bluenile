import express from "express";
import multer from "multer";
import {
  createTransport,
  getTransports,
  getTransportById,
  updateTransport,
  approveTransport,
  rejectTransport,
  deleteTransport,
} from "../controllers/transportControl.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CRUD
router.post("/", upload.single("img"), createTransport);
router.get("/", getTransports);
router.get("/:id", getTransportById);
router.put("/:id", upload.single("img"), updateTransport);
router.put("/:id/approve", approveTransport);
router.put("/:id/reject", rejectTransport);
router.delete("/:id", deleteTransport);

export default router;
