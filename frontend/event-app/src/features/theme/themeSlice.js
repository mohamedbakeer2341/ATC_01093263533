import { createSlice } from "@reduxjs/toolkit";

const storedTheme = localStorage.getItem("theme");

const initialState = {
  mode: storedTheme || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    toggleTheme: (state) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      state.mode = newMode;
      localStorage.setItem("theme", newMode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
