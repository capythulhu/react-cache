import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import { CacheProvider } from "./providers/cache";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CacheProvider>
    <App />
  </CacheProvider>
);
