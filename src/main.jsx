import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store";

// Find the root HTML element and mount the React application inside it.
createRoot(document.getElementById("root")).render(
  // StrictMode helps identify potential problems during development.
  <StrictMode>
    {/* Make the Redux store available to connected React components. */}
    <Provider store={store}>
      {/* Render the main application and its configured routes. */}
      <App />
    </Provider>
  </StrictMode>
);