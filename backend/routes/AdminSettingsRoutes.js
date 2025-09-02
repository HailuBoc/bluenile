import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/adminSettingsController.js";

const router = express.Router();

router.get("/settings", getSettings);
router.post("/settings", updateSettings);

export default router;
