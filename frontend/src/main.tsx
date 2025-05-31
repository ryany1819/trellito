import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "@/components/theme-provider";

if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === "true") {
  console.log("Running in dev:mock mode");
  const { worker } = await import("./mocks/browser.ts");
  await worker.start();
  console.log("Mock service worker started");
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>
);
