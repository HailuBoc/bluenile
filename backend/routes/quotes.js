import express from "express";
import {
  createQuoteRequest,
  getQuoteRequests,
  getQuoteRequestById,
} from "../controllers/quoteController.js";

const router = express.Router();

// POST /quote
router.post("/", createQuoteRequest);
router.get("/", getQuoteRequests);
router.get("/:id", getQuoteRequestById);

export default router;
