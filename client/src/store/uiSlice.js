import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  sidebar: true
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark"
    },
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar
    }
  }
})

export const { toggleMode, toggleSidebar } = uiSlice.actions;

export default uiSlice.reducer;