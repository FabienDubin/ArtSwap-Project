import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { format, formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/config/api.config";
import { decode } from "blurhash";
//Components
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
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeedBlock = ({
  post,
  addImageToCollection,
  deleteImageToCollection,
  isLoading,
  setIsLoading,
}) => {
  const { user } = useContext(AuthContext);
  const [isInCollection, setIsInCollection] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState([]);

  const [open, setOpen] = React.useState(false);

  //Functions

  //Check if is in collection
  const checkIfInCollection = async () => {
    // const body = { data: { userId: user._id, imageId: imageId } };
    try {
      const { data } = await axios.get(`${API_URL}/collection/isincollection`, {
        params: { userId: user._id, imageId: post.imageId._id },
      });
      //   console.log(data);
      setIsInCollection(data.isInCollection);
    } catch (error) {
      console.log(error);
    }
  };

  //Decoding BlurHash to URL data
  const decodeBlurHashImage = (blurHash, width = 32, height = 32) => {
    const pixels = decode(blurHash, width, height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  //Get the 3 last comments for this post

  const getComments = async () => {
    console.log(post.imageId._id);
    try {
      const response = await axios.get(
        `${API_URL}/comment/${post.imageId._id}`
      );
      setComments(response.data.comments);
      console.log(response.data.comments);
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
        imageId: post.imageId._id,
      };
      try {
        const { data } = await axios.post(
          `${API_URL}/comment/create`,
          newCommentData
        );
        setNewComment("");
      } catch (error) {
        console.log("failed to get comments", error);
      }
    }
  };

  useEffect(() => {
    checkIfInCollection();
    getComments();
  }, []);

  return (
    <div className="md:max-w-xl mx-auto">
      <Card className="m-2">
        {/* HEADER */}
        <CardHeader className="pb-3 pt-3">
          <Link to={`/friend/${post.userId._id}`}>
            <CardTitle className="flex items-center">
              <Avatar>
                <AvatarImage
                  src={post.userId.image}
                  alt={post.userId.username}
                />
                <AvatarFallback>??</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center items-start ml-2">
                <h2 className="text-l ">{post.userId.username} </h2>
                <p className="text-xs font-thin">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </CardTitle>
          </Link>
        </CardHeader>

        {/* Image */}
        <Link to={`/image/${post.imageId._id}`}>
          <CardContent>
            <img
              className=" inset-0 w-full h-full object-cover rounded-2xl"
              onLoad={() => setIsLoading(false)}
              src={
                isLoading
                  ? decodeBlurHashImage(post.imageId.blur_hash)
                  : post.imageId.photo_image_url
              }
              alt={post.imageId.ai_description}
            />
          </CardContent>
        </Link>

        {/* FOOTER */}
        <CardFooter>
          {/* Add to collection */}
          <Button
            onClick={() => {
              isInCollection
                ? (deleteImageToCollection(post.imageId._id),
                  setIsInCollection(false))
                : (addImageToCollection(post.imageId._id),
                  setIsInCollection(true));
            }}
            variant={isInCollection ? "secondary" : "default"}
          >
            {isInCollection ? <CircleMinus /> : <CirclePlus />}
            {isInCollection ? " Remove from collection" : "Add to collection"}
          </Button>

          {/* Comments Drawer*/}
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button className="ml-2">See Comments</Button>
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
                <hr className="my-4" />
                <div className="flex-grow overflow-y-auto max-h-56">
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
                              {formatDistanceToNow(
                                new Date(comment.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          </h2>
                        </div>
                        <p className="m-4">{comment.comment}</p>
                      </Card>
                    ))}
                </div>

                <hr className="my-4" />
                {/* "Send a Comment" */}
                <div
                // className="h-[calc(100%)] flex flex-col flex-grow"
                >
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedBlock;
