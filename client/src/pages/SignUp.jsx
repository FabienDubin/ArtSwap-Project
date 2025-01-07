import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/config/api.config";
import { AuthContext } from "@/contexts/AuthContext";

//COMPONENTS
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Siren } from "lucide-react";

const SignUp = () => {
  //STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  // const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");

  //CONTEXT
  const { storeToken, verifyToken } = useContext(AuthContext);

  const nav = useNavigate();
  //FUNCTIONS
  const handleSignUp = async (e) => {
    setErrorMessage(null);
    e.preventDefault();
    if (honeypot === "") {
      const newUser = {
        email,
        password,
        username,
      };

      //API call to sign up user
      try {
        const response = await axios.post(`${API_URL}/auth/sign-up`, newUser);
        storeToken(response.data.user.token);
        verifyToken();
        nav("/");
      } catch (error) {
        // console.log(error.response.data.message);
        setErrorMessage(
          "An error occurred while signing up. Check your informations"
        );
      }
      // console.log("Sign up form submitted");
    } else {
      console.log("Bot detected");
    }
  };

  //ReCatCha
  // const handleSubmitCaptcha = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://www.google.com/recaptcha/api/siteverify",
  //       {
  //         params: {
  //           secret: "YOUR_RECAPTCHA_SECRET_KEY",
  //           response: token,
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       setToken(response.data.token);
  //     } else {
  //       setErrorMessage("Failed to verify CAPTCHA");
  //     }
  //   } catch (error) {
  //     setErrorMessage("An error occurred while verifying CAPTCHA");
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="container mx-auto p-8 md:max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-4 uppercase">
          Sign Up
        </h1>
        {/* Sign up form*/}
        <form className="flex flex-col gap-2" onSubmit={handleSignUp}>
          <Input
            className="w-full mb-2"
            type="username"
            placeholder="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            className="w-full mb-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            className="w-full mb-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            className="w-full mb-2"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {/* Honeypot for limit the bots. Recaptcha to be implemented */}
          <Input
            type="text"
            name="honeypot"
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
            onChange={(e) => setHoneypot(e.target.value)}
          />

          {/* reCAPTCHA script */}
          {/* <script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            async
            defer
          ></script> */}

          {/* reCAPTCHA widget */}
          {/* <div
            className="g-recaptcha"
            data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onClick={handleSubmitCaptcha}
          ></div> */}

          <Button
            variant={password === confirmPassword ? "default" : "secondary"}
            className="mt-4 w-full"
          >
            Ok let's go
          </Button>
        </form>

        {/* SignUp Error message  */}
        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <Siren className="h-4 w-4" />
            <AlertTitle>Oups!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Redirect to login */}
        <div className="mt-4 text-center">
          <p>
            If you already have an account, please{" "}
            <a href="/login" className=" hover:text-gray-700 underline">
              log in!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
