import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REHYDRATE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer, videoReducer, uiReducer, playbackReducer, videoSettingsReducer, likesReducer, channelReducer, playlistReducer } from "./index"

const persistConfig = {
  key: "root",
  storage
}

const rootReducer = combineReducers({
  auth: authReducer,
  videos: videoReducer,
  ui: uiReducer,
  playback: playbackReducer,
  videoSettings: videoSettingsReducer,
  likes: likesReducer,
  channel: channelReducer,
  playlist: playlistReducer
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