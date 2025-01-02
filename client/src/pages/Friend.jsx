import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/config/api.config";
import { decode } from "blurhash";
import { Gallery } from "react-grid-gallery";

//COMPONENTS
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

//MEDIA
import { ChevronsUpDown, CirclePlus } from "lucide-react";

const Friend = () => {
  //CONTEXT
  const { user, isLoggedIn } = useContext(AuthContext);

  //STATES
  const [friend, setFriend] = useState({});
  const [friendsOfFriend, setFriendsOfFriend] = useState([]);
  const [friendCollection, setFriendCollection] = useState([]);
  const [isFriends, setIsFriends] = useState(false);
  const [hashCollection, setHashCollection] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  //PARAMS
  const { friendId } = useParams();

  //NAVIGATE
  const nav = useNavigate();

  //FUNCTIONS
  //Get friend image and name
  const getFriendInfos = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/${friendId}`);
      setFriend({
        image: response.data.oneUser.image,
        username: response.data.oneUser.username,
      });
    } catch (error) {
      console.log("Did not find the friend infos", error);
    }
  };
  //Get friend friends
  const getFriendsOfFriend = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/user/allfriends/${friendId}`
      );
      setFriendsOfFriend(response.data.friends);
    } catch (error) {
      console.log(`did not find the friends of ${friend.username}`, error);
    }
  };
  //   console.log(friendsOfFriend);

  //Get the friend collection
  const getFriendCollection = async (limit) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_URL}/collection/${friendId}?page=${page}&limit=${limit}`
      );
      if (!response.data.images) {
        return setFriendCollection(null);
      }
      setTotalPage(response.data.totalPages);
      setHashCollection(
        response.data.images.map((image) => ({
          src: decodeBlurHashImage(image.imageId.blur_hash),
          width: image.imageId.photo_width,
          height: image.imageId.photo_height,
          id: image.imageId._id,
        }))
      );
      setFriendCollection(
        response.data.images.map((image) => ({
          src: `${image.imageId.photo_image_url}?q=30`,
          width: image.imageId.photo_width,
          height: image.imageId.photo_height,
          id: image.imageId._id,
        }))
      );
      setIsLoading(false);
      //   console.log("response", response.data);
    } catch (error) {
      console.log("did not manage to get the user's collection", error);
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

  //Add Friend to friends
  const addFriend = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/user/togetheritsbetter/${user._id}/${friendId}`
      );
      console.log("add as friend", response.data);
      setIsFriends(!isFriends);
    } catch (error) {
      console.log(error);
    }
  };
  //Remove Friends to friends
  const removeFriend = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/user/togetheritsbetter/${user._id}/${friendId}`
      );
      console.log("friend removed from friends", response.data);
      setIsFriends(!isFriends);
    } catch (error) {
      console.log(error);
    }
  };

  //Check if friend is on the user's friends array
  const getIfFriends = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/user/arefriends?userId=${user._id}&friendId=${friendId}`
      );
      setIsFriends(response.data.areFriends);
    } catch (error) {
      console.log("Din't not manage to know if are friends", error);
    }
  };

  // Limit to 10 visible avatars

  const visibleFriends = friendsOfFriend.slice(0, 10);
  const hiddenFriends = friendsOfFriend.slice(10);

  //Redirect the user to the image page
  const handleImageClick = (index) => {
    const imgId = friendCollection[index].id;
    nav(`/for-frodo/${imgId}`);
  };

  //Move to the previous/next page of the collection
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  //HOOK
  useEffect(() => {
    getFriendInfos();
    getFriendsOfFriend();
    getFriendCollection(10);
    getIfFriends();
  }, [friendId, page, isFriends]);

  return (
    <div className="min-h-[85vh]">
      {/* Friend name and image profile */}
      <div className="flex flex-col justify-center items-center my-8">
        <img
          className="w-20 h-20 rounded-full border-2 object-cover border-gray-300"
          src={friend.image}
          alt={friend.username}
        />
        <div className="flex w-2/3 justify-center items-center">
          <div className="flex flex-col">
            <h2 className="text-3xl font-semibold uppercase text-center">
              {friend.username}
            </h2>
            <Button
              variant={isFriends ? "outline" : "default"}
              onClick={() => {
                isFriends ? removeFriend() : addFriend();
              }}
            >
              {isFriends ? "Following" : "Not Following Yet"}
            </Button>
          </div>
        </div>
      </div>
      {/* Friends List */}
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl  font-semibold uppercase">Friends</h2>
        <p className="text-l m-2">People that {friend.username} follows...</p>
        <div className="flex justify-center items-center p-4">
          {!friendsOfFriend.length && <p>🥺 no friends for the moment...</p>}
          {/* 10 first friends */}
          <div className="flex justify-center items-center flex-wrap">
            {friendsOfFriend.length > 0 &&
              visibleFriends.map((friend) => (
                <Link
                  key={friend.id}
                  to={
                    friend.id === user._id ? "/profile" : `/friend/${friend.id}`
                  }
                >
                  <Avatar className="m-1">
                    <AvatarImage src={friend.image} alt={friend.username} />
                    <AvatarFallback>
                      {friend.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ))}
          </div>
          <div>
            {/* rest of friends */}
            {friendsOfFriend.length > 0 && hiddenFriends.length > 0 && (
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="mt-4 space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center"
                  >
                    <ChevronsUpDown className="h-4 w-4 mr-2" />
                    {isOpen ? "Show less" : `Show ${hiddenFriends.length} more`}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-wrap gap-4">
                    {hiddenFriends.map((friend) => (
                      <Avatar key={friend.id}>
                        <AvatarImage src={friend.image} alt={friend.username} />
                        <AvatarFallback>
                          {friend.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </div>

      {/* Friend collection  */}
      <div className="mx-auto">
        <h2 className="text-2xl  font-semibold uppercase m-4 text-center">
          Collection
        </h2>
        <div>
          <div className="w-full">
            <div className="max-w-screen-md md:min-h-[75vh] mx-auto">
              {!friendCollection && <p>🥺 no images for the moment...</p>}
              {friendCollection && (
                <Gallery
                  images={isLoading ? hashCollection : friendCollection}
                  onClick={handleImageClick}
                  rowHeight={window.innerWidth >= 768 ? 220 : 120}
                />
              )}
            </div>
          </div>
        </div>

        {/* PAGINATION */}
        {friendCollection && (
          <div className="m-3 pb-14">
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  {/* Previous button */}
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    />
                  </PaginationItem>

                  {/* Case: totalPages <= 4 */}
                  {totalPages <= 4 && (
                    <>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={page === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    </>
                  )}

                  {/* Case: totalPages > 4 and page <= 3 */}
                  {totalPages > 4 && page <= 3 && (
                    <>
                      {[1, 2, 3].map((pageNumber) => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={page === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  {/* Case: totalPages > 4 and page in the middle */}
                  {totalPages > 4 && page > 3 && page < totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange(page - 1)}
                        >
                          {page - 1}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  {/* Case: totalPages > 4 and page near the end */}
                  {totalPages > 4 && page >= totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      {[totalPages - 2, totalPages - 1, totalPages].map(
                        (pageNumber) => (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={page === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                    </>
                  )}

                  {/* Next button */}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friend;
