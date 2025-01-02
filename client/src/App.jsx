import React, { useState, useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import axios from "axios";
import { API_URL } from "./config/api.config";
import { AuthContext } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";

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

// Import the required CSS file
import "./App.css";

function App() {
  //STATES
  const [isLoading, setIsLoading] = useState(true);
  const [imageSample, setImageSample] = useState([]);
  const { user } = useContext(AuthContext);

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

  //Add a card to the user's collection
  const addImageToCollection = async (imageId) => {
    try {
      const response = await axios.post(
        `${API_URL}/collection/addtocollection`,
        { userId: user._id, imageId }
      );
      console.log("Image added to collection:", response.data);
    } catch (error) {
      console.log("Error adding image to collection:", error);
    }
  };

  //Delete a card from the user's collection
  const deleteImageFromCollection = async (imageId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/collection/deletefromcollection`,
        {
          data: {
            userId: user._id,
            imageId: imageId,
          },
        }
      );
      console.log("Image deleted from collection:", response.data);
    } catch (error) {
      console.log("Error deleting image from collection:", error);
    }
  };

  //Check if the image is in collection
  const isImageInCollection = async (imageId) => {
    try {
      const response = await axios.get(`${API_URL}/collection/isincollection`, {
        userId: user._id,
        imageId,
      });
      console.log("Is image in collection:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error checking if image is in collection:", error);
      return false;
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
                <Swap
                  getImageSample={getImageSample}
                  imageSample={imageSample}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  addImageToCollection={addImageToCollection}
                  deleteImageFromCollection={deleteImageFromCollection}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
