import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({ page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/events", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message || "Failed to fetch events");
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message || "Failed to fetch event details");
    }
  }
);

export const bookEventTicket = createAsyncThunk(
  "events/bookEventTicket",
  async (eventId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/bookings/${eventId}`);
      dispatch(fetchEventById(eventId));
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message || "Failed to book event ticket");
    }
  }
);

export const createEventByAdmin = createAsyncThunk(
  "events/createEventByAdmin",
  async (eventFormData, { rejectWithValue }) => {
    try {
      const response = await api.post("/events", eventFormData, {
        headers: {},
      });
      return response.data.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message || "Failed to create event");
    }
  }
);

export const updateEventByAdmin = createAsyncThunk(
  "events/updateEventByAdmin",
  async ({ eventId, eventFormData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/events/${eventId}`, eventFormData, {
        headers: {},
      });
      return response.data.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message || "Failed to update event");
    }
  }
);

export const deleteEventByAdmin = createAsyncThunk(
  "events/deleteEventByAdmin",
  async (eventId, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${eventId}`);
      return eventId;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message || "Failed to delete event");
    }
  }
);

const initialState = {
  events: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalEvents: 0,
  selectedEvent: null,
  selectedEventLoading: false,
  selectedEventError: null,
  bookingLoading: false,
  bookingError: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent(state, action) {
      state.events.push(action.payload);
    },
    updateEvent(state, action) {
      const index = state.events.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
      if (
        state.selectedEvent &&
        state.selectedEvent._id === action.payload._id
      ) {
        state.selectedEvent = action.payload;
      }
    },
    deleteEvent(state, action) {
      state.events = state.events.filter((e) => e._id !== action.payload);
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null;
      state.selectedEventError = null;
      state.selectedEventLoading = false;
    },
    clearEventsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.data;
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.totalEvents = action.payload.pagination.totalEvents;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.selectedEventLoading = true;
        state.selectedEventError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEventLoading = false;
        state.selectedEvent = action.payload.data;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.selectedEventLoading = false;
        state.selectedEventError = action.payload || action.error.message;
      })
      // Book Event Ticket
      .addCase(bookEventTicket.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(bookEventTicket.fulfilled, (state, action) => {
        state.bookingLoading = false;
      })
      .addCase(bookEventTicket.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload || action.error.message;
      })
      .addCase(createEventByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEventByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEventByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateEventByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEventByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (
          state.selectedEvent &&
          state.selectedEvent._id === action.payload._id
        ) {
          state.selectedEvent = action.payload;
        }
      })
      .addCase(updateEventByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteEventByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEventByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(
          (event) => event._id !== action.payload
        );
      })
      .addCase(deleteEventByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  addEvent,
  updateEvent,
  deleteEvent,
  clearSelectedEvent,
  clearEventsError,
} = eventsSlice.actions;
export default eventsSlice.reducer;
