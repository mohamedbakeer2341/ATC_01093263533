import Event from "../models/event.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import Booking from "../models/booking.model.js";

export const createEvent = asyncHandler(async (req, res, next) => {
  const { name, date, venue } = req.body;
  let imageUrl = req.file?.path;

  const currentDate = new Date();
  const eventDate = new Date(date);

  if (eventDate < currentDate) {
    const error = new Error("Event date cannot be in the past");
    error.status = 400;
    return next(error);
  }
  const existingEvent = await Event.findOne({
    name,
    date: new Date(date),
    venue,
  });

  if (existingEvent) {
    const error = new Error("Event already exists");
    error.status = 409;
    return next(error);
  }

  const eventData = {
    ...req.body,
    date: new Date(date),
    image: req.file?.path,
  };

  const event = await Event.create(eventData);
  res.status(201).json(event);
});

export const getAllEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find({
    date: { $gte: new Date() },
  }).lean();
  const userBookings = await Booking.find({ userId: req.user._id }).lean();
  const bookedEventIds = userBookings.map((b) => b.eventId.toString());

  const result = events.map((event) => ({
    ...event,
    userHasBooked: bookedEventIds.includes(event._id.toString()),
  }));

  if (!result.length) {
    const error = new Error("No events found");
    error.status = 404;
    return next(error);
  }
  return res.json(result);
});

export const getEventById = asyncHandler(async (req, res, next) => {
  const { userId } = req.user;
  const event = await Event.findById(req.params.id).lean();

  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    return next(error);
  }
  const userBookings = await Booking.findOne({
    userId: userId,
    eventId: event._id,
  }).lean();

  const hasBooked = userBookings ? true : false;

  const result = {
    ...event,
    userHasBooked: hasBooked,
  };

  res.status(200).json(result);
});

export const updateEvent = asyncHandler(async (req, res, next) => {
  const { name, date, venue } = req.body;

  const currentDate = new Date();
  const eventDate = new Date(date);

  if (eventDate < currentDate) {
    const error = new Error("Event date cannot be in the past");
    error.status = 400;
    return next(error);
  }

  const existingEvent = await Event.findOne({
    name,
    date: new Date(date),
    venue,
  });
  if (existingEvent) {
    const error = new Error("Event already exists");
    error.status = 409;
    return next(error);
  }

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      date: new Date(currentDate),
      ...(req.file && { image: req.file.path }),
    },
    { new: true }
  );

  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    return next(error);
  }

  return res.status(201).json(event);
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    return next(error);
  }
  res.status(200).json({ message: "Event deleted successfully" });
});
