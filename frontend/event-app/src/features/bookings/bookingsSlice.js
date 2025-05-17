import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://eventbooker-024e32ba58a3.herokuapp.com/api";

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (bookingId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  cancelling: null,
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Booking (Optional)
      .addCase(cancelBooking.pending, (state, action) => {
        state.cancelling = action.meta.arg;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelling = null;
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelling = null;
        state.error = action.payload;
      });
  },
});

export default bookingsSlice.reducer;
