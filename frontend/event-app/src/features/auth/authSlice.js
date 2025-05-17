import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

// API_URL is now managed by the api instance, so we don't need it here directly
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error(
        "Login error - Full error object:",
        JSON.parse(JSON.stringify(error)) // Full error structure
      );
      if (error.response) {
        console.error(
          "Login error - Backend response data:",
          error.response.data
        ); // Log backend error
        return rejectWithValue(error.response.data);
      } else {
        console.error(
          "Login error - No response from server or network issue:",
          error.message
        );
        return rejectWithValue(
          error.message || "Network error or server is down"
        );
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      console.log("Attempting registration with:", { name, email }); // Frontend log
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });
      console.log("Register response from backend:", response.data); // Frontend log
      return response.data;
    } catch (error) {
      console.error(
        "Register error - Full error object:",
        JSON.parse(JSON.stringify(error))
      );
      if (error.response) {
        console.error(
          "Register error - Backend response data:",
          error.response.data
        );
        return rejectWithValue(error.response.data);
      } else {
        console.error(
          "Register error - No response from server or network issue:",
          error.message
        );
        return rejectWithValue(
          error.message || "Network error or server is down for registration"
        );
      }
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const currentAuthState = getState().auth;
    const tokenFromState = currentAuthState.token;
    const tokenFromLocalStorage = localStorage.getItem("token");

    console.log(
      "[fetchUserProfile] Starting. Token from Redux state:",
      tokenFromState
    );
    console.log(
      "[fetchUserProfile] Token from localStorage at call time:",
      tokenFromLocalStorage
    );
    console.log(
      "[fetchUserProfile] Current auth loading state:",
      currentAuthState.loading
    );
    console.log(
      "[fetchUserProfile] Current isAuthenticated state:",
      currentAuthState.isAuthenticated
    );

    if (!tokenFromState) {
      console.warn(
        "[fetchUserProfile] No token found in Redux state. Aborting profile fetch."
      );
      return rejectWithValue("No token found in Redux state");
    }

    try {
      console.log(
        "[fetchUserProfile] Attempting to GET /auth/profile with token from interceptor."
      );
      const response = await api.get("/auth/profile");
      console.log(
        "[fetchUserProfile] Profile data received from backend:",
        response.data
      );

      const userProfile = response.data.data;

      if (!userProfile) {
        console.error(
          "[fetchUserProfile] User data (response.data.data) is missing in profile response."
        );
        dispatch(logout());
        return rejectWithValue("User data not found in profile response");
      }

      console.log(
        "[fetchUserProfile] Extracted user profile to load:",
        userProfile
      );

      dispatch(loadUser({ user: userProfile, token: tokenFromState }));
      return userProfile;
    } catch (error) {
      console.error(
        "[fetchUserProfile] Error during /auth/profile call. Full error:",
        JSON.parse(JSON.stringify(error))
      );
      if (error.response) {
        console.error(
          "[fetchUserProfile] Backend error data:",
          error.response.data
        );
        console.error(
          "[fetchUserProfile] Backend error status:",
          error.response.status
        );
      }
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.warn(
          "[fetchUserProfile] Authentication error (401/403) fetching profile. Logging out."
        );
        dispatch(logout());
      } else if (!error.response) {
        console.error(
          "[fetchUserProfile] Network error or no response from server. Not necessarily logging out."
        );
      } else {
        console.error(
          `[fetchUserProfile] Server error (${error.response?.status}) fetching profile. Current app logic will logout.`
        );
        dispatch(logout());
      }
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk to upload profile picture
export const updateProfilePicture = createAsyncThunk(
  "auth/updateProfilePicture",
  async (file, { rejectWithValue, getState }) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      // The API instance should automatically include the token from localStorage
      const response = await api.patch(
        "/auth/upload-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Profile picture update response:", response.data);
      return response.data.data; // Assuming backend returns { success: true, data: updatedUser }
    } catch (error) {
      console.error(
        "Update Profile Picture error - Full error object:",
        JSON.parse(JSON.stringify(error))
      );
      if (error.response) {
        console.error(
          "Update Profile Picture error - Backend response data:",
          error.response.data
        );
        return rejectWithValue(error.response.data);
      } else {
        console.error(
          "Update Profile Picture error - No response or network issue:",
          error.message
        );
        return rejectWithValue(
          error.message || "Network error during profile picture update"
        );
      }
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.patch("/auth/change-password", passwordData);
      return response.data;
    } catch (error) {
      let specificErrorMessage = "Password change failed. Please try again."; // Default error

      if (error.response && error.response.data) {
        // Case 1: Backend sends { message: "Specific error..." }
        if (typeof error.response.data.message === "string") {
          specificErrorMessage = error.response.data.message;
          // Case 2: Backend sends a plain string error directly in the data
        } else if (typeof error.response.data === "string") {
          specificErrorMessage = error.response.data;
          // Case 3: Backend sends an object, but not with a 'message' field, stringify it if possible
        } else if (typeof error.response.data === "object") {
          try {
            const jsonData = JSON.stringify(error.response.data);
            // Avoid overly generic stringified empty objects or overly long ones
            if (jsonData !== "{}" && jsonData.length < 200) {
              specificErrorMessage = jsonData;
            }
          } catch (e) {
            /* Ignore stringify error, default message will be used */
          }
        }
      } else if (error.message) {
        // Case 4: No error.response (network error, etc.), use error.message
        specificErrorMessage = error.message;
      }

      console.log(
        "[authSlice changePassword thunk] Rejecting with value:",
        specificErrorMessage
      );
      return rejectWithValue(specificErrorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
    loadUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      console.log(
        "[authSlice loadUser] User loaded into state:",
        action.payload.user
      );
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        console.log(
          "[authSlice loginUser.fulfilled] State after login success:",
          JSON.parse(JSON.stringify(state))
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        console.log(
          "[authSlice fetchUserProfile.fulfilled] State after profile fetch success:",
          JSON.parse(JSON.stringify(state))
        );
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        if (!state.isAuthenticated) {
          state.error = action.payload;
        }
        console.log(
          "[authSlice fetchUserProfile.rejected] State after profile fetch failure:",
          JSON.parse(JSON.stringify(state))
        );
      })
      // Handle profile picture upload
      .addCase(updateProfilePicture.pending, (state) => {
        state.loading = true; // Or a more specific loading flag like state.uploadingPicture = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.user = action.payload; // action.payload is the updatedUser from the backend
        state.loading = false;
        state.error = null;
        console.log(
          "[authSlice updateProfilePicture.fulfilled] User profile picture updated:",
          action.payload
        );
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Error from backend or network
        console.error(
          "[authSlice updateProfilePicture.rejected] Profile picture update failed:",
          action.payload
        );
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { logout, loadUser, clearError } = authSlice.actions;
export default authSlice.reducer;
