import React from "react";
import { useNavigate } from "react-router-dom";

//COMPONENTS
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";

const Home = ({ getImageSample, imageSample, isLoading, setIsLoading }) => {
  const nav = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-around items-center min-h-[85vh]">
        <Hero
          getImageSample={getImageSample}
          imageSample={imageSample}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <p className="p-2 mt-6">
          Discover Art, Swipe Pieces, Build your collection
        </p>
        <Button className="m-4 w-52" onClick={() => nav("/swap")}>
          Start Swipe
        </Button>
      </div>
    </>
  );
};

export default Home;
