import express from "express";
import multer from "multer";
import {
  getVipTours,
  createVipTour,
  updateVipTour,
  deleteVipTour,
  approveVipTour,
  rejectVipTour,
} from "../controllers/vipPostController.js";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

router.get("/", getVipTours);
router.post("/", upload.single("image"), createVipTour);
router.put("/:id", upload.single("image"), updateVipTour);
router.delete("/:id", deleteVipTour);
router.put("/:id/approve", approveVipTour);
router.put("/:id/reject", rejectVipTour);

export default router;
