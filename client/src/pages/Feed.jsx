import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { API_URL } from "@/config/api.config";

//COMPONENT
import FeedBlock from "@/components/FeedBlock";

const Feed = ({
  addImageToCollection,
  deleteImageToCollection,
  isImageInCollection,
}) => {
  //CONTEXT
  const { user } = useContext(AuthContext);

  //STATES
  const [myFeed, setMyFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  //FUNCTIONS
  //Get the 10 last user images created that are not mine with the users infos
  const getMyFeed = async (limit) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_URL}/collection/getalluserimages/${user._id}?page=${page}&limit=${limit}`
      );
      if (!response.data.images) {
        return setMyFeed(null);
      }
      // console.log(response.data);
      setMyFeed(response.data.images);
    } catch (error) {
      console.log("Didn't manage to get the feed", error);
    }
  };

  //HOOK
  //Hooks
  useEffect(() => {
    getMyFeed(10);
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl p-7 font-semibold uppercase">My Feed</h1>
      {myFeed &&
        myFeed.map((post) => (
          <div key={post._id}>
            <FeedBlock
              className=""
              addImageToCollection={addImageToCollection}
              deleteImageToCollection={deleteImageToCollection}
              isImmageInCollection={isImageInCollection}
              post={post}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        ))}
    </div>
  );
};

export default Feed;
