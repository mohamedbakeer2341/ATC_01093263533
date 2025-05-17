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
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "Password123!"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.post("/signup", validate(signupValidation), asyncHandler(signup));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Returns a JWT token and user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b9f9b1e8b001f8e4b1e"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                       example: "user"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     profilePicture:
 *                       type: string
 *                       format: url
 *                       example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", validate(loginValidation), asyncHandler(login));
/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify user's email address
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token sent to user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.get("/verify-email", asyncHandler(verifyEmail));

/**
 * @swagger
 * /auth/create-admin:
 *   post:
 *     summary: Create a new admin user (requires admin privileges)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin User
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "AdminPassword123!"
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create-admin",
  authenticate,
  authorize("admin"),
  validate(createAdminValidation),
  asyncHandler(createAdmin)
);

/**
 * @swagger
 * /auth/upload-profile-picture:
 *   patch:
 *     summary: Upload or update user's profile picture
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePicture
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture image file to upload.
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully, returns updated user profile data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b9f9b1e8b001f8e4b1e"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                       example: "user"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     profilePicture:
 *                       type: string
 *                       format: url
 *                       example: "https://res.cloudinary.com/yourcloud/image/upload/v12345/folder/imagefile.jpg"
 *       400:
 *         description: No file uploaded or invalid file type.
 *       401:
 *         description: Unauthorized (missing/invalid token).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.patch(
  "/upload-profile-picture",
  authenticate,
  uploadProfile.single("profilePicture"),
  asyncHandler(uploadProfilePicture)
);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing/invalid token or wrong current password)
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordValidation),
  asyncHandler(changePassword)
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b9f9b1e8b001f8e4b1e"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                       example: "user"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     profilePicture:
 *                       type: string
 *                       format: url
 *                       example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       500:
 *         description: Internal server error
 */
router.get("/profile", authenticate, asyncHandler(getUserProfile));

export default router;
