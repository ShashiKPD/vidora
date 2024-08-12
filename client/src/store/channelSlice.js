import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "./actions/authActions";

const initialState = {
  videos: [],
  channelStats: null,
  status: 'idle',
  error: null,
  lastFetched: null,
}

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload.videos
      state.lastFetched = Date.now();
    },
    resetVideos: (state) => {
      state.videos = []
      state.page = 1
      state.status = 'idle'
      state.error = null
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelVideos.pending, (state) => {
        state.status = 'loading'
        state.error = null
        // console.log("Fetching videos...");
      })
      .addCase(fetchChannelVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastFetched = Date.now();
        state.videos = action.payload.data || []
        // console.log("Videos fetched", action.payload);

      }).addCase(fetchChannelVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log("Error while fetching videos: ", action.payload);
      })
      .addCase(fetchChannelStats.pending, (state) => {
        state.status = 'loading'
        state.error = null
        // console.log("Fetching channel stats...");
      })
      .addCase(fetchChannelStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastFetched = Date.now();
        state.channelStats = action.payload.data
        // console.log("channel stats fetched", action.payload);

      }).addCase(fetchChannelStats.rejected, (state, action) => {
        state.status = 'failed';
        state.channelStats = null
        state.error = action.payload;
        console.log("Error while fetching channel stats:", action.payload);
      }).addCase(LOGOUT, (state) => {
        state.videos = []
        state.channelStats = null
        state.status = 'idle'
        state.error = null
        state.lastFetched = null
      })
  }
})


export const fetchChannelVideos = createAsyncThunk(
  'videos/fetchChannelVideos',
  async (username, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/videos/${username}`, {
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

export const fetchChannelStats = createAsyncThunk(
  'videos/fetchChannelStats',
  async (username, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/stats/${username}`, {
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

export const { setVideos, resetVideos } = channelSlice.actions
export default channelSlice.reducer