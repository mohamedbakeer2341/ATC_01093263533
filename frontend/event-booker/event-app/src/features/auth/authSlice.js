import { logout, loadUser } from "./authSlice"; // Ensure loadUser is correctly imported if it was an issue

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
      // Check token from Redux state, which should mirror localStorage initially
      console.warn(
        "[fetchUserProfile] No token found in Redux state. Aborting profile fetch."
      );
      return rejectWithValue("No token found in Redux state");
    }

    // The api.js interceptor will use localStorage.getItem('token') when constructing the request.
    // So, if tokenFromState is present, localStorage.getItem('token') should also be present unless cleared by another means.

    try {
      console.log(
        "[fetchUserProfile] Attempting to GET /auth/profile with token from interceptor."
      );
      const response = await api.get("/auth/profile");
      console.log("[fetchUserProfile] Profile data received:", response.data);
      // Assuming response.data contains the user object { id, name, email, role, ... }
      // We pass tokenFromState here because that's the one we validated at the start of the thunk.
      dispatch(loadUser({ user: response.data, token: tokenFromState }));
      return response.data;
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
      // Important: Only logout if the error is genuinely an auth error (401/403) or if the profile is essential
      // A 500 error from /auth/profile might not always mean the token is invalid, but rather the server endpoint itself is broken.
      // However, if the profile is essential for the app to function, logging out might be the safest default.
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.warn(
          "[fetchUserProfile] Authentication error (401/403) fetching profile. Logging out."
        );
        dispatch(logout());
      } else if (!error.response) {
        // Network error or other issue where no response was received from server
        console.error(
          "[fetchUserProfile] Network error or no response from server. Not necessarily logging out."
        );
        // Decide if logout is appropriate here. For a profile fetch, maybe not if it's a temporary network blip.
      } else {
        // For other errors (like 500), you might not want to immediately log out,
        // as the token *could* still be valid but the endpoint is just broken.
        // However, current app logic logs out for ANY error in fetchUserProfile.
        // Let's stick to current logic of logging out on any error for now, but log it distinctly.
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

// ... rest of authSlice.js
