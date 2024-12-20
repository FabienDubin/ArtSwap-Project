import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ParallaxProvider } from "react-scroll-parallax";
import { BrowserRouter } from "react-router-dom";
import { AuthContextWrapper } from "./contexts/AuthContext";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ParallaxProvider>
      <BrowserRouter>
        <AuthContextWrapper>
          <App />
        </AuthContextWrapper>
      </BrowserRouter>
    </ParallaxProvider>
  </StrictMode>
);
