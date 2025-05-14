import express from "express";
import { signup, login, verifyEmail } from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

// Authentication routes
router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.get("/verify-email", asyncHandler(verifyEmail));

export default router;
