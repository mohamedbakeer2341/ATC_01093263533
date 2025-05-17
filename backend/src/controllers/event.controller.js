import Event from "../models/event.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import Booking from "../models/booking.model.js";
import paginate from "../utils/pagination.js";

export const createEvent = asyncHandler(async (req, res, next) => {
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

  const eventData = {
    ...req.body,
    date: new Date(date),
    image: req.file?.path,
  };

  const event = await Event.create(eventData);
  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: event,
  });
});

export const getAllEvents = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sort = "-date", category, search } = req.query;

  // Base query - only future events
  const query = { date: { $gte: new Date() } };

  // Add filters
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Get paginated events
  const { data: events, pagination } = await paginate(Event, query, {
    page,
    limit,
    sort,
  });

  // Get user's bookings if authenticated
  let bookedEventIds = [];
  if (req.user?.userId) {
    const userBookings = await Booking.find({
      userId: req.user.userId,
    }).lean();
    bookedEventIds = userBookings.map((b) => b.eventId.toString());
  }

  // Transform response
  const result = events.map((event) => ({
    ...event,
    userHasBooked: bookedEventIds.includes(event._id.toString()),
  }));

  res.status(200).json({
    success: true,
    data: result,
    pagination,
  });
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

  res.status(200).json({ success: true, data: result });
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
    _id: { $ne: req.params.id },
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

  return res.status(200).json({ success: true, data: { event } });
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
    data: event,
  });
});
