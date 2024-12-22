import React, { useState } from "react";

//Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  //SETTERS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //HANDLERS
  const handleLogin = () => {
    console.log("Logging in with email:", email, "and password:", password);
    // Add login logic here
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="container mx-auto p-8 md:max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-4 uppercase">
            Login
          </h1>
          {/* Add login form here */}

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

          {/* Add login error message here */}

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
