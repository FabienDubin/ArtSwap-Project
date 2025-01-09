import React from "react";

import { useEffect, useState, useRef, useMemo, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import { Blurhash } from "react-blurhash";

import TinderCard from "react-tinder-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Swap = ({
  getImageSample,
  imageSample,
  isLoading,
  setIsLoading,
  addImageToCollection,
  deleteImageFromCollection,
}) => {
  //STATES
  const { user } = useContext(AuthContext);
  //Temp storing images sent to collection in case of remove
  const [addedImages, setAddedImages] = useState([]);

  //------- Tinder Card Set up -----------------//
  const [currentIndex, setCurrentIndex] = useState(imageSample.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      //set to 10 as the imageSample should be
      Array(10)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < imageSample.length - 1;
  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    if (direction === "right") {
      addImageToCollection(imageSample[currentIndex]._id);
      // console.log({
      //   userId: user._id,
      //   imageId: imageSample[currentIndex]._id,
      // });

      addedImages.push(imageSample[currentIndex]._id);
    }
  };

  const outOfFrame = (name, idx) => {
    // console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    // console.log("swipe", { canSwipe, currentIndex, imageSample });
    if (canSwipe && currentIndex < imageSample.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
    //Adding card to the collection
    if (dir === "right") {
      // console.log(
      //   "add image to users collection",
      //   imageSample[currentIndex]._id
      // );
      addImageToCollection(imageSample[currentIndex]._id);
      // console.log({
      //   userId: user._id,
      //   imageId: imageSample[currentIndex]._id,
      // });

      addedImages.push(imageSample[currentIndex]._id);
    }
  };

  const goBack = async () => {
    // console.log("back");
    if (!canGoBack) return;
    const imageToRemove = imageSample[currentIndex + 1]._id;

    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();

    //Remove the image from the collection
    // console.log(
    //   "user",
    //   user,
    //   "image to remove",
    //   imageToRemove,
    //   "-----to remove from Array----",
    //   addedImages
    // );
    if (canGoBack && addedImages.includes(imageToRemove)) {
      // console.log({
      //   userId: user._id,
      //   imageId: imageToRemove,
      // });
      deleteImageFromCollection(imageToRemove);
      addedImages.splice(
        addedImages.findIndex((image) => image === imageToRemove),
        1
      );
      // console.log(
      //   "image has been removed from collection. Here is the new array : ",
      //   addedImages
      // );
    }
  };
  //------- END OF - Tinder Card Set up - END OF ------------------//

  //Hooks
  useEffect(() => {
    getImageSample();
  }, []);

  return (
    <div className="flex  flex-col justify-between items-center min-h-[85vh] pb-5">
      <h1 className="text-3xl p-7 font-semibold uppercase">
        Curate Your World
      </h1>

      <h3 className="text-center text-sm md:text-base w-4/5 md:w-3/5">
        Discover Your Next Favorite Artwork! 🎨 Swipe right to add stunning
        creations to your collection or left to pass. Let your taste shape your
        unique gallery!
      </h3>

      {/* SwapContainer */}
      {/* Wait for loading image is finished */}
      {!isLoading && imageSample.length === 10 && (
        <div className="flex flex-col justify-center items-center min-w-[75vw]">
          <div className=" mb-10 w-[90vw] max-w-[260px] h-[300px] flex flex-col justify-center items-center">
            {imageSample &&
              imageSample.map((image, index) => {
                return (
                  <TinderCard
                    ref={childRefs[index]}
                    className="absolute"
                    key={image._id}
                    onSwipe={(dir) => swiped(dir, image._id, index)}
                    onCardLeftScreen={() => outOfFrame(image._id, index)}
                  >
                    <Card className="relative w-[80vw] max-w-[300px] h-[300px] bg-white rounded-2xl shadow-lg overflow-hidden">
                      <Blurhash
                        hash={image.blur_hash}
                        width={400}
                        height={300}
                        resolutionX={32}
                        resolutionY={32}
                        punch={1}
                        className="absolute inset-0 w-full h-full object-cover blur-md"
                      />

                      <img
                        src={`${image.photo_image_url}?q=30&format=auto`}
                        alt="Card image"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                          isLoading ? "opacity-0" : "opacity-100"
                        }`}
                        onLoad={() => setIsLoading(false)}
                      />
                    </Card>
                  </TinderCard>
                );
              })}
            <div className="flex items-center justify-center h-[300px]">
              {!canSwipe && (
                <div className="m-6 flex flex-col justify-center items-center">
                  <p className="p-2">Already finish?</p>
                  <Button
                    className="w-full"
                    onClick={() => {
                      getImageSample();
                      updateCurrentIndex(imageSample.length - 1);
                    }}
                  >
                    Start Again
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center w-[300px] mb-10">
            <div>
              <Button
                className="w-24"
                onClick={() => swipe("left")}
                disabled={!canSwipe}
              >
                Ouuuh
              </Button>
            </div>
            <div>
              <Button onClick={() => goBack()} disabled={!canGoBack}>
                Undo
              </Button>
            </div>
            <div>
              <Button
                className="w-24"
                onClick={() => swipe("right")}
                disabled={!canSwipe}
              >
                Love it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Swap;
