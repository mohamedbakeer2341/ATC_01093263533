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
import validate from "../middleware/validation.middleware.js";
import {
  signupValidation,
  loginValidation,
  changePasswordValidation,
  createAdminValidation,
} from "../validations/auth.validation.js";

const router = express.Router();

// Authentication routes
router.post("/signup", validate(signupValidation), asyncHandler(signup));
router.post("/login", validate(loginValidation), asyncHandler(login));
router.get("/verify-email", asyncHandler(verifyEmail));
router.post(
  "/create-admin",
  authenticate,
  authorize("admin"),
  validate(createAdminValidation),
  asyncHandler(createAdmin)
);
router.patch(
  "/upload-profile-picture",
  authenticate,
  uploadProfile.single("profilePicture"),
  asyncHandler(uploadProfilePicture)
);
router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordValidation),
  asyncHandler(changePassword)
);
router.get("/profile", authenticate, asyncHandler(getUserProfile));

export default router;
