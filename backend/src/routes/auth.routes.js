import express from "express";
import {
  signup,
  login,
  verifyEmail,
  uploadProfilePicture,
  changePassword,
  getUserProfile,
} from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import upload from "../utils/multer.js";
import authenticate from "../middleware/authentication.middleware.js";

const router = express.Router();

// Authentication routes
router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.get("/verify-email", asyncHandler(verifyEmail));
router.patch(
  "/upload-profile-picture",
  authenticate,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.patch("/change-password", authenticate, changePassword);
router.get("/profile", authenticate, getUserProfile);

export default router;
