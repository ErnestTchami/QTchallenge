import express from "express";
import {
  createShortUrl,
  getShortUrls,
  deleteShortUrl,
  getSingleShortUrl,
} from "../controllers/urlController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateJWT, createShortUrl);
router.get("/", authenticateJWT, getShortUrls);
router.get("/:short_code", getSingleShortUrl);
router.delete("/:id", authenticateJWT, deleteShortUrl);

export default router;
