import React, { useContext, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api.config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

//Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Siren } from "lucide-react";

const Login = () => {
  //SETTERS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const { storeToken, authenticated } = useContext(AuthContext);

  const nav = useNavigate();

  //HANDLERS
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(false);
    if (!email || !password) {
      setErrorMessage(true);
      return;
    }
    // console.log("Logging in with email:", email, "and password:", password);
    try {
      const respose = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log("Login response:", respose.data);
      storeToken(respose.data.token);
    } catch (error) {
      console.log(error);
      setErrorMessage(true);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="container mx-auto p-8 md:max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-4 uppercase">
            Login
          </h1>
          {/* Login form*/}

          <form onSubmit={handleLogin} className="flex flex-col gap-2">
            <Input
              className="w-full mb-2"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              className="w-full mb-2"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button className="mt-4 w-full">Ok let's go</Button>
          </form>

          {/* Login error message*/}
          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <Siren className="h-4 w-4" />
              <AlertTitle>Oups!</AlertTitle>
              <AlertDescription>
                Your credentials took a wrong turn—double-check and try again!
              </AlertDescription>
            </Alert>
          )}

          {/* Redirect to sign up */}
          <div className="mt-4 text-center">
            <p>
              If you don't have an account, please{" "}
              <a href="/sign-up" className=" hover:text-gray-700 underline">
                sign up!
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
