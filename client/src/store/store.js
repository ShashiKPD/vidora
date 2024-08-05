import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REHYDRATE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import videoReducer from "./videoSlice";
import uiReducer from "./uiSlice";

const persistConfig = {
  key: "root",
  storage
}

const rootReducer = combineReducers({
  auth: authReducer,
  videos: videoReducer,
  ui: uiReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
export default store