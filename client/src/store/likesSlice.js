import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "./actions/authActions";

const initialState = {
  likedVideos: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedVideos.pending, (state) => {
        state.status = 'loading'
        // console.log("Fetching likedVideos...");
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.likedVideos = action.payload.data.videos || []
        // console.log("likedVideos fetched", action.payload);

      }).addCase(fetchLikedVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log("Error while fetching likedVideos", action.payload, action.error);
      })
      .addCase(LOGOUT, (state) => {
        state.likedVideos = []
        state.error = null
        state.status = 'idle'
      })

  }
})

export const fetchLikedVideos = createAsyncThunk(
  'playback/fetchLikedVideos',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/likes/videos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        },
      })
      const data = await response.json()

      if (!data.success) {
        return rejectWithValue(data.message)
      }
      return data

    } catch (error) {
      return rejectWithValue(error.message)
    }

  })


export default likesSlice.reducer;