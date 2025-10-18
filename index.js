import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import IgifuDashboard from "./IgifuDashboard";

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service Worker registered:", reg))
      .catch((err) => console.log("Service Worker registration failed:", err));
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <IgifuDashboard />
  </React.StrictMode>
);
