import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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

// Import the required CSS file
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
