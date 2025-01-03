import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/config/api.config";
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";

//COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, CircleMinus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Image = ({
  addImageToCollection,
  deleteImageToCollection,
  decodeBlurHashImage,
  setIsLoading,
  isLoading,
}) => {
  //CONTEXT
  const { user } = useContext(AuthContext);
  //PARAMS
  const { imageId } = useParams();

  //STATES
  const [image, setImage] = useState({});
  const [isImageInCollection, setIsImageInCollection] = useState(false);
  const [open, setOpen] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState([]);

  //FUNCTIONS
  //Get Image informations
  const getImageInfo = async (id) => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${API_URL}/image/${imageId}`);
      setImage(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  //Get the comments for this post
  const getComments = async (post) => {
    try {
      const response = await axios.get(`${API_URL}/comment/${post}`);
      setComments(response.data.comments);
    } catch (error) {
      console.log("Din't mange to get the comments", error);
    }
  };

  //Send a comment
  const handleSubmitComment = async () => {
    if (newComment) {
      const newCommentData = {
        userId: user._id,
        comment: newComment,
        imageId: image._id,
      };
      try {
        const { data } = await axios.post(
          `${API_URL}/comment/create`,
          newCommentData
        );
        setNewComment("");
        getComments(imageId);
        setOpen(false);
      } catch (error) {
        console.log("failed to get comments", error);
      }
    }
  };

  //Check if the image is in collection
  const checkIfIsImageInCollection = async (imageId) => {
    try {
      const response = await axios.get(`${API_URL}/collection/isincollection`, {
        params: {
          userId: user._id,
          imageId,
        },
      });
      setIsImageInCollection(response.data.isInCollection);
    } catch (error) {
      console.log("Error checking if image is in collection:", error);
      return false;
    }
  };

  // HOOKS
  useEffect(() => {
    getImageInfo(imageId);
    getComments(imageId);
    checkIfIsImageInCollection(imageId);
  }, [imageId, user]);

  console.log(image);

  return (
    <div className="mb-20">
      <div className="md:max-w-xl mx-auto">
        <Card className="m-2 border-none shadow-none">
          {/* HEADER */}
          <CardHeader className="pb-3 pt-3 ">
            <CardTitle className="flex items-center">
              <div className="flex flex-col justify-center items-start ml-2 ">
                <h2 className="text-l uppercase">
                  {`${image.photographer_first_name} ${image.photographer_last_name}`}{" "}
                </h2>
                <p className="text-sm font-thin text-center">
                  {image.ai_description}
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Image */}

          <CardContent>
            {/* Landscape images */}
            {Number(image.photo_width) > Number(image.photo_height) && (
              <img
                className=" inset-0 w-full h-[40vh] object-cover rounded-2xl mx-auto"
                onLoad={() => setIsLoading(false)}
                src={
                  isLoading
                    ? decodeBlurHashImage(image.blur_hash)
                    : image.photo_image_url
                }
                alt={image.ai_description}
              />
            )}
            {/* Portrait images */}
            {Number(image.photo_width) <= Number(image.photo_height) && (
              <img
                className=" inset-0 w-full h-[60vh] object-cover rounded-2xl mx-auto"
                onLoad={() => setIsLoading(false)}
                src={
                  isLoading
                    ? decodeBlurHashImage(image.blur_hash)
                    : image.photo_image_url
                }
                alt={image.ai_description}
              />
            )}
          </CardContent>

          {/* FOOTER */}
          <CardFooter className="flex flex-col items-center justify-center">
            {/* Add to collection */}
            <div className="flex items-center justify-between w-full">
              <Button
                className="hidden md:flex"
                onClick={() => {
                  isImageInCollection
                    ? (deleteImageToCollection(image._id),
                      setIsImageInCollection(false))
                    : (addImageToCollection(image._id),
                      setIsImageInCollection(true));
                }}
                variant={isImageInCollection ? "secondary" : "default"}
              >
                {isImageInCollection ? <CircleMinus /> : <CirclePlus />}
                {isImageInCollection
                  ? " Remove from collection"
                  : "Add to collection"}
              </Button>
              <Button
                className="block md:hidden"
                onClick={() => {
                  isImageInCollection
                    ? (deleteImageToCollection(image._id),
                      setIsImageInCollection(false))
                    : (addImageToCollection(image._id),
                      setIsImageInCollection(true));
                }}
                variant={isImageInCollection ? "secondary" : "default"}
              >
                {isImageInCollection ? <CircleMinus /> : <CirclePlus />}
              </Button>

              {/* Comments Drawer*/}
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button className="ml-2">Send a comment</Button>
                </DrawerTrigger>
                <DrawerContent className="flex flex-col mx-2 p-4">
                  <DrawerHeader>
                    <DrawerTitle>See Comments</DrawerTitle>
                    <DrawerDescription>
                      See what others think about this image...
                    </DrawerDescription>
                  </DrawerHeader>

                  {/* Comments Drawer box*/}
                  <div className="flex flex-col">
                    {/* "Send a Comment" */}
                    <div>
                      <Textarea
                        className="h-20 flex resize-none mt-4"
                        id="comment"
                        placeholder="Sharing is giving... ❤️"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="mt-4 flex justify-between">
                        <Button
                          className="w-full"
                          onClick={() => handleSubmitComment()}
                        >
                          Send Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <div className="flex-grow overflow-y-auto w-full m-4">
              {comments.length < 1 && (
                <p className="p-2 text-center font-thin">
                  🥺 No comments yet...
                </p>
              )}
              {comments &&
                comments.map((comment) => (
                  <Card key={comment._id} className="my-2">
                    <div className="flex items-center m-4">
                      <Avatar>
                        <AvatarImage
                          src={comment.userId.image}
                          alt={comment.userId.username}
                        />
                        <AvatarFallback>??</AvatarFallback>
                      </Avatar>
                      <h2 className="text-l font-semibold ml-2">
                        {comment.userId._id === user._id
                          ? "You"
                          : comment.userId.username}{" "}
                        <span className="text-xs font-thin ml-2">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </h2>
                    </div>
                    <p className="m-4">{comment.comment}</p>
                  </Card>
                ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Image;
