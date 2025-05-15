import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import authenticate from "../middleware/authentication.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import authorize from "../middleware/authorization.middleware.js";
import { uploadEvent } from "../utils/multer.js";

const router = express.Router();

// Public routes
router.get("/", authenticate, asyncHandler(getAllEvents));
router.get("/:id", authenticate, asyncHandler(getEventById));

// Admin-only routes
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadEvent.single("image"),
  asyncHandler(createEvent)
);
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadEvent.single("image"),
  asyncHandler(updateEvent)
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  asyncHandler(deleteEvent)
);

export default router;
