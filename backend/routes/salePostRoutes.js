import express from "express";
import multer from "multer";
import {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  approveSale,
  rejectSale,
} from "../controllers/salePostController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CRUD Routes
router.post("/", upload.single("img"), createSale);
router.get("/", getSales);
router.get("/:id", getSaleById);
router.put("/:id", upload.single("img"), updateSale);
router.delete("/:id", deleteSale);

router.put("/:id/approve", approveSale);
router.put("/:id/reject", rejectSale);

export default router;
