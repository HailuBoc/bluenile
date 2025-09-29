import express from "express";
import multer from "multer";
import {
  createSpecialOffer,
  getSpecialOffers,
  getSpecialOfferById,
  updateSpecialOffer,
  deleteSpecialOffer,
} from "../controllers/specialOfferController.js";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"), // store in uploads folder
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/", getSpecialOffers);
router.get("/:id", getSpecialOfferById);
router.post("/", upload.single("image"), createSpecialOffer);
router.put("/:id", upload.single("image"), updateSpecialOffer);
router.delete("/:id", deleteSpecialOffer);

export default router;
