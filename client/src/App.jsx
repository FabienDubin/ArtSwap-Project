import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import axios from "axios";
import { API_URL } from "./config/api.config";
//Components import
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Feed from "./pages/Feed";
import Friend from "./pages/Friend";
import Login from "./pages/Login";
import MyCollection from "./pages/MyCollection";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Swap from "./pages/Swap";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";

// Import the required CSS file
import "./App.css";

function App() {
  //STATES
  const [isLoading, setIsLoading] = useState(true);
  const [imageSample, setImageSample] = useState([]);

  // FUNCTIONS;
  //Get a image sample from the API
  const getImageSample = async () => {
    try {
      setIsLoading(true);

      // Calling for 10 images
      const response = await axios.get(`${API_URL}/image/random`);
      // console.log("image sample =", response.data);
      setImageSample(response.data);
      // update the loading state to display the cards
      setIsLoading(false);
    } catch (error) {
      console.log("Error getting image sample:", error);
    }
  };

  return (
    <>
      <ThemeProvider defaultTheme="system">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                getImageSample={getImageSample}
                imageSample={imageSample}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friend"
            element={
              <ProtectedRoute>
                <Friend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-collection"
            element={
              <ProtectedRoute>
                <MyCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/swap"
            element={
              <ProtectedRoute>
                <Swap />
              </ProtectedRoute>
            }
            props={{
              // getImageSample,
              isLoading,
              setIsLoading,
            }}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
