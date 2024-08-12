import { createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "./actions/authActions";

const initialState = {
  mode: "light",
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
  }, extraReducers: (builder) => {
    builder.addCase(LOGOUT, (state) => {
      state.mode = "light"
      state.sidebar = false
    })
  }
})

export const { toggleMode, toggleSidebar } = uiSlice.actions;

export default uiSlice.reducer;