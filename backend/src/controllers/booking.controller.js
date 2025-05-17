import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import paginate from "../utils/pagination.js";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const { userId } = req.user;

  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    return next(error);
  }
  if (event.date < new Date()) {
    const error = new Error("Cannot book past events");
    error.status = 400;
    return next(error);
  }

  const bookingsCount = await Booking.countDocuments({ eventId });
  if (bookingsCount >= event.capacity) {
    const error = new Error("Event is sold out");
    error.status = 400;
    return next(error);
  }

  const existingBooking = await Booking.findOne({ eventId, userId });
  if (existingBooking) {
    const error = new Error("You already booked this event");
    error.status = 409;
    return next(error);
  }

  const booking = await Booking.create({ eventId, userId });

  res.status(201).json({
    success: true,
    data: booking,
    message: "Event booked successfully!",
  });
});

export const getBookingById = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const { userId } = req.user;

  const booking = await Booking.findOne({
    _id: bookingId,
    userId: userId,
  }).populate("eventId", "name description date venue price image");

  if (!booking) {
    const error = new Error("Booking not found or unauthorized");
    error.status = 404;
    return next(error);
  }

  const flattenedResponse = {
    id: booking._id,
    status: booking.status,
    bookedAt: booking.bookedAt,
    eventId: booking.eventId._id,
    eventName: booking.eventId.name,
    eventDescription: booking.eventId.description,
    eventDate: booking.eventId.date,
    eventVenue: booking.eventId.venue,
    eventPrice: booking.eventId.price,
    eventImage: booking.eventId.image,
  };

  res.status(200).json({ success: true, data: flattenedResponse });
});

export const getUserBookings = asyncHandler(async (req, res, next) => {
  const { userId } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const { data: bookings, pagination } = await paginate(
    Booking,
    { userId },
    {
      page,
      limit,
      populate: {
        path: "eventId",
        select: "name date venue price image category",
        options: { lean: true },
      },
      sort: { bookedAt: -1 },
    }
  );

  const result = bookings
    .filter((booking) => booking.eventId)
    .map((booking) => ({
      id: booking._id,
      status: booking.status,
      bookedAt: booking.bookedAt,
      eventId: booking.eventId._id,
      eventName: booking.eventId.name,
      eventDate: booking.eventId.date,
      eventVenue: booking.eventId.venue,
      eventPrice: booking.eventId.price,
      eventImage: booking.eventId.image,
      eventCategory: booking.eventId.category,
    }));

  res
    .status(200)
    .json({ success: true, count: result.length, data: result, pagination });
});

export const deleteBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  const booking = await Booking.findOne({ _id: id, userId });

  if (!booking) {
    const error = new Error("Booking not found or unauthorized");
    error.status = 404;
    return next(error);
  }

  const result = await Booking.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    data: result,
  });
});
