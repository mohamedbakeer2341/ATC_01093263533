import express from "express";
import authRoutes from "./auth.routes.js";
// Import other route files here (e.g., eventRoutes, userRoutes)

const router = express.Router();

// Combine all routes
router.use("/auth", authRoutes); // Routes will be: /api/auth/signup, /api/auth/login, etc.
// router.use("/events", eventRoutes);  // Example for future expansion

export default router;
