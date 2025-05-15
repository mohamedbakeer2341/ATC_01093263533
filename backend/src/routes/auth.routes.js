import express from "express";
import {
  signup,
  login,
  verifyEmail,
  uploadProfilePicture,
  changePassword,
  getUserProfile,
  createAdmin,
} from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadProfile } from "../utils/multer.js";
import authenticate from "../middleware/authentication.middleware.js";
import authorize from "../middleware/authorization.middleware.js";

const router = express.Router();

// Authentication routes
router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.get("/verify-email", asyncHandler(verifyEmail));
router.post("/create-admin", authenticate, authorize("admin"), createAdmin);
router.patch(
  "/upload-profile-picture",
  authenticate,
  uploadProfile.single("profilePicture"),
  uploadProfilePicture
);
router.patch("/change-password", authenticate, changePassword);
router.get("/profile", authenticate, getUserProfile);

export default router;
