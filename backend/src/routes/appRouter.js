import express from "express";
import authRoutes from "./auth.routes.js";
import eventRoutes from "./event.routes.js";
import bookingRoutes from "./booking.routes.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Event Booker API",
    documentation: "/api-docs",
  });
});
router.use("/auth", authRoutes); // Routes will be: /api/auth/signup, /api/auth/login, etc.
router.use("/events", eventRoutes);
router.use("/bookings", bookingRoutes);

export default router;
