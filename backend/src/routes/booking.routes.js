import express from "express";
import {
  createBooking,
  getBookingById,
  getUserBookings,
  deleteBooking,
} from "../controllers/booking.controller.js";
import authenticate from "../middleware/authentication.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Event booking management
 */

/**
 * @swagger
 * /bookings/{eventId}:
 *   post:
 *     summary: Create a new booking for an event
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event to book
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid event ID or event is sold out
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       409:
 *         description: User already booked this event
 *       500:
 *         description: Internal server error
 */
router.post("/:eventId", authenticate, asyncHandler(createBooking));

/**
 * @swagger
 * /bookings/{bookingId}:
 *   get:
 *     summary: Get booking details by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Forbidden (user doesn't own this booking)
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.get("/:bookingId", authenticate, asyncHandler(getBookingById));

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get user's bookings (paginated)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated booking list
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
 *                     $ref: '#/components/schemas/Booking'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get("/", authenticate, asyncHandler(getUserBookings));

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       204:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Forbidden (user doesn't own this booking)
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticate, asyncHandler(deleteBooking));

export default router;
