import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [],
  page: 1,
  status: 'idle',
  error: null,
}

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = [...state.videos, ...action.payload.videos] // append new videos
    },
    resetVideos: (state) => {
      state.videos = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = 'loading'
        console.log("Fetching videos...");
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videos = [...state.videos, ...action.payload.data] // append new videos
        console.log("Videos fetched", action.payload);

      }).addCase(fetchVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log("Error while fetching videos", action.payload);
      });
  }
})


export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (page, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/videos", {
        headers: {
          "Authorization": `Bearer ${auth.accessToken}`
        }
      })
      const data = await response.json()
      return data;

    } catch (error) {
      return rejectWithValue(error.message)
    }

  }
)


export default videoSlice.reducer