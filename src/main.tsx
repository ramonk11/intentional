import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    let refreshing = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((registration) => {
        registration.waiting?.postMessage({ type: "SKIP_WAITING" });

        registration.addEventListener("updatefound", () => {
          registration.installing?.addEventListener("statechange", () => {
            if (registration.waiting) {
              registration.waiting.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch(() => {
        // De app blijft bruikbaar als registratie niet lukt, bijvoorbeeld in privévensters.
      });
  });
}
