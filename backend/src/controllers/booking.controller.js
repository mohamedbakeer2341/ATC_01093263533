import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const { userId } = req.user;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new Error("Event not found", { status: 404 }));
  }
  if (event.date < new Date()) {
    return next(new Error("Cannot book past events", { status: 400 }));
  }

  const bookingsCount = await Booking.countDocuments({ eventId });
  if (bookingsCount >= event.capacity) {
    return next(new Error("Event is sold out", { status: 400 }));
  }

  const existingBooking = await Booking.findOne({ eventId, userId });
  if (existingBooking) {
    return next(new Error("You already booked this event", { status: 409 }));
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
    return next(
      new Error("Booking not found or unauthorized", { status: 404 })
    );
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

  const bookings = await Booking.find({ userId })
    .populate({
      path: "eventId",
      select: "name date venue price image",
      options: { lean: true },
    })
    .sort({ bookedAt: -1 });

  const result = bookings
    .filter((booking) => booking.eventId) // Remove bookings with null eventId
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
    }));

  res.status(200).json({ success: true, count: result.length, data: result });
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
