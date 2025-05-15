import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["concert", "conference", "workshop", "exhibition", "sports"],
    },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    capacity: { type: Number, default: 100 },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    image: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/dgbtuclc2/image/upload/w_300,h_200,c_fill,g_auto,f_auto,q_auto/v1747320741/event/Blog-banner-5-C-of-event-management_dx7qsb.png",
    },
  },
  { timestamps: true }
);

// Virtual to check availability
eventSchema.virtual("isSoldOut").get(function () {
  return this.bookings?.length >= this.capacity;
});

export default mongoose.model("Event", eventSchema);
