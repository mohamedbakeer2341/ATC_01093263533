import express from "express";
import authRoutes from "./auth.routes.js";
import eventRoutes from "./event.routes.js";

const router = express.Router();

router.use("/auth", authRoutes); // Routes will be: /api/auth/signup, /api/auth/login, etc.
router.use("/event", eventRoutes);

export default router;
