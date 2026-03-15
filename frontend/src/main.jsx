import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: "#363636",
                    color: "#fff",
                },
                success: {
                    iconTheme: {
                        primary: "#b06a4c",
                        secondary: "#fff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                    },
                },
            }}
        />
    </StrictMode>,
);
