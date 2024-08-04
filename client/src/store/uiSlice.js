import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark"
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark"
    }
  }
})

export const { toggleMode } = uiSlice.actions;

export default uiSlice.reducer;