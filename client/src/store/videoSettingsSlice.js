import { createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "./actions/authActions";

const initialState = {
  volume: 0.4
}

const videoSettingsSlice = createSlice({
  name: "videoSettings",
  initialState,
  reducers: {
    setVolume: (state, action) => {
      state.volume = action.payload
    }
  }, extraReducers: (builder) => {
    builder.addCase(LOGOUT, (state) => {
      state.volume = 1.0
    })
  }
})

export const { setVolume } = videoSettingsSlice.actions;

export default videoSettingsSlice.reducer;