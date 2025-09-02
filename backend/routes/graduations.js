import express from "express";
import { createGraduation } from "../controllers/graduationController.js";

const router = express.Router();

// POST /graduations
router.post("/", createGraduation);

export default router;
