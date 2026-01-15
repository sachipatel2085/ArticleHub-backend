import express from "express";
import { submitAppeal } from "../controllers/appeal.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, submitAppeal);

export default router;