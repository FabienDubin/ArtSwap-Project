import axios from "axios";
import { API_URL } from "@/config/api.config";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthContextWrapper = ({ children }) => {
  //SETTERS
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const nav = useNavigate();

  //FUNCTIONS
  //Store token in the local storage when the user is authenticated
  const storeToken = (token) => {
    localStorage.setItem("token", token);
  };

  //Verify the token if there is a token in the local storage
  // const verifyToken = async () => {
  //   const token = localStorage.getItem("token");
  //   console.log("token est la", token);
  //   if (token) {
  //     try {
  //       const response = await axios.get(`${API_URL}/auth/verify`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (response.data) {
  //         console.log("✅ User verified", response.data);
  //         setUser(response.data);
  //         setIsLoggedIn(true);
  //         setIsLoading(false);
  //       } else {
  //         localStorage.removeItem("token");
  //         setIsLoggedIn(false);
  //         setIsLoading(false);
  //         nav("/login");
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       localStorage.removeItem("token");
  //       setIsLoggedIn(false);
  //       setIsLoading(false);
  //       nav("/login");
  //     }
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // };

  const verifyToken = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  //Remove the token from the localstorage
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    nav("/");
  };

  //Update the user on demand
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  //HOOKS
  useEffect(() => {
    verifyToken();
    // console.log("verifyTokenhas been called");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        verifyToken,
        handleLogout,
        storeToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextWrapper };
