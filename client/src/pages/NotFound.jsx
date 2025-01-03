import React, { useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
//COMPONENTS
import { Button } from "@/components/ui/button";

const NotFound = ({
  getImageSample,
  imageSample,
  isLoading,
  setIsLoading,
  addImageToCollection,
  deleteImageFromCollection,
}) => {
  //CONTEXT
  const { user } = useContext(AuthContext);

  //NAVIGATION
  const nav = useNavigate();

  //HOOK
  useEffect(() => {
    getImageSample();
    console.log("Not Found Component Rendered");
  }, []);

  console.log(imageSample);
  if (isLoading || !imageSample) {
    return <div>Loading...</div>;
  }

  if (imageSample.length > 0) {
    return (
      <div
        style={{
          backgroundImage: `url(${imageSample[0].photo_image_url}?q=30&format=auto)`,
        }}
        className="min-h-screen min-w-screen bg-fixed bg-center bg-cover flex flex-col items-center justify-center shadow-2xl"
      >
        <h1 className=" text-white text-center text-3xl font-bold pb-12">
          Oups, you found a page that doesn't exist.
        </h1>
        {user && (
          <Button
            onClick={() => {
              addImageToCollection(imageSample[0]);
              nav("/");
            }}
          >
            Add this image to my collection and go home
          </Button>
        )}
        {!user && <Button onClick={() => nav("/")}>Go home</Button>}
      </div>
    );
  }
};

export default NotFound;
