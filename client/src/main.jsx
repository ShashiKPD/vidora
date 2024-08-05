import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./AppRouter";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={AppRouter} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
