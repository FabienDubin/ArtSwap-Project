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
    localStorage.setItem("authToken", token);
  };

  //Verify the token if there is a token in the local storage
  const verifyToken = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await axios(`${API_URL}/auth/verify`, {
          headers: { authorisation: `Bearer ${token}` },
        });
        if (response.data.authenticated) {
          setUser(response.data);
          setIsLoggedIn(true);
          setIsLoading(false);
          console.log("🥳 User verified", user);
        } else {
          localStorage.removeItem("authToken");
          setIsLoggedIn(false);
          setIsLoading(false);
          nav("/login");
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setIsLoading(false);
        nav("/login");
      }
    } else {
      setIsLoggedIn(false);
      nav("/login");
    }
  };

  //Remove the token from the localstorage
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(null);
    nav("/");
  };

  //HOOKS
  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        verifyToken,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextWrapper };
