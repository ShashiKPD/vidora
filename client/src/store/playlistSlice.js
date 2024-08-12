import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "./actions/authActions";

const initialState = {
  likedVideos: [],
  userPlaylists: [],
  status: 'idle',
  error: null,
}

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.likedVideos = action.payload.videos
    },
    resetVideos: (state) => {
      state.likedVideos = []
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedVideos.pending, (state) => {
        state.status = 'loading'
        // console.log("Fetching videos...");
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.likedVideos = action.payload.data.videos || []
        // console.log("Videos fetched", action.payload);

      }).addCase(fetchLikedVideos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log("Error while fetching videos", action.payload);
      })
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.status = 'loading'
        // console.log("Fetching videos...");
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userPlaylists = action.payload.data || []
        // console.log("Videos fetched", action.payload);

      }).addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log("Error while fetching videos", action.payload);
      }).addCase(LOGOUT, (state) => {
        state.likedVideos = []
        state.userPlaylists = []
        state.status = 'idle'
        state.error = null
      })
  }
})


export const fetchLikedVideos = createAsyncThunk(
  'playlist/fetchLikedVideos',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/likes/videos", {
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

export const fetchUserPlaylists = createAsyncThunk(
  'playlist/fetchUserPlaylists',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/playlist/user/" + auth.userData._id, {
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

export const { setVideos, resetVideos } = playlistSlice.actions
export default playlistSlice.reducer