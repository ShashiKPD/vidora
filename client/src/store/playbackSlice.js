import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "./actions/authActions";

const initialState = {
  video: null,
  comments: [],
  subscriptions: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const playbackSlice = createSlice({
  name: 'playback',
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.comments.unshift(action.payload)
    },
    removeComment: (state, action) => {
      state.comments = state.comments.filter((comment) => {
        return comment._id !== action.payload
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideo.pending, (state) => {
        state.status = 'loading'
        // console.log("Fetching video...");
      })
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.video = action.payload.data
        // console.log("Video fetched", action.payload);

      }).addCase(fetchVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.video = null;
        state.error = action.payload;
        console.log("Error while fetching video", action.payload, action.error);
      })
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading'
        // console.log("Fetching comments...");
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload.data
        // console.log("Comments fetched", action.payload);

      }).addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log("Error while fetching comments", action.payload, action.error);
      })
      .addCase(fetchSubscriptions.pending, (state) => {
        state.status = 'loading'
        // console.log("Fetching subscriptions...");
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subscriptions = action.payload.data
        // console.log("Subscriptions fetched", action.payload);

      }).addCase(fetchSubscriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log("Error while fetching subscriptions", action.payload);
      }).addCase(LOGOUT, (state) => {
        state.video = null
        state.comments = []
        state.subscriptions = []
        state.error = null
        state.status = 'idle'
      })
  }
})

export const fetchVideo = createAsyncThunk(
  'playback/fetchVideo',
  async (videoId, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/videos/${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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



export const fetchComments = createAsyncThunk(
  'playback/fetchComments',
  async ({ videoId, page, limit, sortBy, sortType }, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${videoId}?page=${page}&limmit=${limit}&sortBy=${sortBy}&sortType=${sortType}`, {
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

export const fetchSubscriptions = createAsyncThunk(
  'playback/subscriptions',
  async (username, { getState, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscriptions/u/${username}`, {
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

export const { addComment, removeComment } = playbackSlice.actions
export default playbackSlice.reducer