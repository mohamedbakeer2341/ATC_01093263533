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
import validate from "../middleware/validation.middleware.js";
import {
  eventCreateValidation,
  eventUpdateValidation,
} from "../validations/event.validation.js";
const router = express.Router();

// Public routes

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get paginated list of future events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, -date, price, -price, name, -name]
 *           default: -date
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [concert, conference, workshop, exhibition, sports]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated event list with booking status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EventWithBookingStatus'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get("/", authenticate, asyncHandler(getAllEvents));

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a specific event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticate, asyncHandler(getEventById));

// Admin-only routes

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - date
 *               - venue
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Conference 2023"
 *               description:
 *                 type: string
 *                 example: "Annual technology conference"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-15T09:00:00Z"
 *               venue:
 *                 type: string
 *                 example: "Convention Center, New York"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 99.99
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 500
 *               category:
 *                 type: string
 *                 enum: [concert, conference, workshop, exhibition, sports]
 *                 example: "conference"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Forbidden (requires admin role)
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadEvent.single("image"),
  validate(eventCreateValidation),
  asyncHandler(createEvent)
);

/**
 * @swagger
 * /events/{id}:
 *   patch:
 *     summary: Update an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Event Name"
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               venue:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *               category:
 *                 type: string
 *                 enum: [concert, conference, workshop, exhibition, sports]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Forbidden (requires admin role)
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadEvent.single("image"),
  validate(eventUpdateValidation),
  asyncHandler(updateEvent)
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Forbidden (requires admin role)
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  asyncHandler(deleteEvent)
);

export default router;
