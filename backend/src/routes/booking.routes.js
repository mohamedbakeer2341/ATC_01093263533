import express from "express";
import {
  createBooking,
  getBookingById,
  getUserBookings,
  deleteBooking,
} from "../controllers/booking.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/:eventId", authenticate, asyncHandler(createBooking));

router.get("/:bookingId", authenticate, asyncHandler(getBookingById));

router.get("/", authenticate, asyncHandler(getUserBookings));

router.delete("/:id", authenticate, asyncHandler(deleteBooking));

export default router;
