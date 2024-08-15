import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "./actions/authActions";
import { refreshAccessToken } from "./authSlice";

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
    },
    setQuery: (state, action) => {
      state.query = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = 'loading'
        state.error = null
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
  async (searchParams, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState()

    if (!auth.authStatus) {
      return rejectWithValue("User not logged in")
    }

    const fetchWithAuth = async (token) => {
      const url = new URL(import.meta.env.VITE_API_BASE_URL + "/videos");
      url.search = new URLSearchParams({ ...searchParams });

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return response.json();
    };

    try {
      let response = await fetchWithAuth(auth.accessToken);

      if (response.message === 'jwt expired') {
        // Dispatch the refreshAccessToken thunk and wait for it to complete
        const refreshResponse = await dispatch(refreshAccessToken()).unwrap();
        if (!refreshResponse.success) {
          return rejectWithValue(refreshResponse.message);
        }

        // Use the new access token
        response = await fetchWithAuth(refreshResponse.data.accessToken);
      }

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const { setVideos, resetVideos, setQuery } = videoSlice.actions
export default videoSlice.reducer