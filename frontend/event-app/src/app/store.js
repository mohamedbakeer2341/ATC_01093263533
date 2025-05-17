import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import eventsReducer from "../features/events/eventsSlice";
import bookingsReducer from "../features/bookings/bookingsSlice";
import themeReducer from "../features/theme/themeSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    bookings: bookingsReducer,
    theme: themeReducer,
  },
});
