import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logoutAll } from "./actions/authActions";
import { enqueueSnackbar } from "notistack";

const initialState = {
  authStatus: false,
  userData: null,
  accessToken: null,
  refreshToken: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearStatus: (state) => {
      state.status = "idle"
    }
    // login: (state, action) => {
    //   state.authStatus = true;
    //   state.userData = action.payload.userData;
    //   state.token = action.payload.token;
    // },
    // logout: (state) => {
    //   state.authStatus = false;
    //   state.userData = null;
    //   state.token = null;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        console.log("Attempting to log in user")
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.authStatus = true
        state.userData = action.payload.data.user
        state.accessToken = action.payload.data.accessToken
        state.refreshToken = action.payload.data.refreshToken
        state.error = null
        console.log("User logged in: ", action.payload)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.authStatus = false
        state.userData = null
        state.accessToken = null
        state.refreshToken = null
        state.error = action.payload
        console.log("Error while loggin in: ", action.payload)
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
        console.log("Attempting to log out user")
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded"
        state.authStatus = false
        state.userData = null
        state.accessToken = null
        state.refreshToken = null
        state.error = null
        console.log("User logged out")
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
        console.log("Error while loggin out: ", action.payload)
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        console.log("Attempting to register user")
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded"
        console.log("User registered")
      }).addCase(registerUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
        console.log("Error while registering user: ", action.payload)
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = 'loading'
        console.log("Attempting to refresh access token")
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.accessToken = action.payload.data.accessToken
        state.refreshToken = action.payload.data.refreshToken
        console.log("access token refreshed")
      }).addCase(refreshAccessToken.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
        state.authStatus = false
        state.userData = null
        state.accessToken = null
        state.refreshToken = null
        state.error = null
        console.log("Error while trying to refresh access token: ", action.payload)
        enqueueSnackbar("Failed to refresh access token. Please login again", { autoHideDuration: 5000, variant: "error" })
        console.log("User logged out")
      })
  }
})

export const login = createAsyncThunk(
  'auth/login',
  async (userCredentials, { rejectWithValue }) => {

    return await fetch(import.meta.env.VITE_API_BASE_URL + "/users/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userCredentials),
      // credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)

        if (!data.success) {
          return rejectWithValue(data.message)
        }

        return data
      })
      .catch((error) => {
        return rejectWithValue(error.message)
      })
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    const { accessToken } = getState().auth
    try {
      logoutAll()
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/logout", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()

      if (!data.success) {
        return rejectWithValue(data.message)
      }
      // user successfully logged out so clear all store data using logout action
      return data

    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/register", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json"
        // },
        body: formData
      })
      const data = await response.json()
      if (!data.success) {
        return rejectWithValue(data.message)
      }
      return data

    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { getState, rejectWithValue }) => {
    const { refreshToken } = getState().auth

    enqueueSnackbar("Access Token expired. Trying to get a new one!", { autoHideDuration: 5000, variant: "warning" })

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken: refreshToken })
      })
      const data = await response.json()
      if (!data.success) {
        return rejectWithValue(data.message)
      }
      return data

    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)



export const { clearError, clearStatus } = authSlice.actions
export default authSlice.reducer
