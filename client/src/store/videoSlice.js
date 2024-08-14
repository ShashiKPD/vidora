import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "./actions/authActions";

const initialState = {
  videos: [],
  page: 1,
  query: "",
  status: 'idle',
  error: null,
  lastFetched: null,
}

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload.videos
      state.lastFetched = Date.now();
    },
    resetVideos: (state) => {
      state.videos = []
      state.page = 1
      state.query = ""
      state.status = 'idle'
      state.error = null
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = 'loading'
        // console.log("Fetching videos...");
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastFetched = Date.now();
        state.videos = action.payload.data || []
        // console.log("Videos fetched", action.payload);

      }).addCase(fetchVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log("Error while fetching videos:", action.payload);
      }).addCase(LOGOUT, (state) => {
        state.videos = []
        state.page = 1
        state.query = ""
        state.status = 'idle'
        state.error = null
        state.lastFetched = null
      })
  }
})


export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (searchParams, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const url = new URL(import.meta.env.VITE_API_BASE_URL + "/videos");
      url.search = new URLSearchParams({ ...searchParams });
      // console.log(url);

      // const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/videos" + "?sortBy=views&sortType=desc&page=1&limit=50", {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${auth.accessToken}`
        }
      })
      const data = await response.json()
      if (!data.success) return rejectWithValue(data.message)
      return data;

    } catch (error) {
      return rejectWithValue(error.message)
    }

  }
)

export const { setVideos, resetVideos } = videoSlice.actions
export default videoSlice.reducer