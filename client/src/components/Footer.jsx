import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";

//COMPONENTS
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

//MEDIAS
import { Shuffle, Library, Newspaper } from "lucide-react";

const Footer = () => {
  //CONTEXT
  const { user, isLoggedIn, isLoading, handleLogout } = useContext(AuthContext);
  const userImage = user?.image;

  //THEME
  const { theme, setTheme } = useTheme();

  //NAVIGATION
  const nav = useNavigate();

  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile");
  const isCollectionPage = location.pathname.startsWith("/my-collection");
  const isMyFeedPage = location.pathname.startsWith("/my-feed");
  const isSwapPage = location.pathname.startsWith("/swap");
  return (
    <div>
      <div
        className={`w-full fixed h-12 bottom-0 flex justify-around items-center shadow-top md:hidden ${
          theme === "dark" ? "bg-black" : "bg-white"
        } `}
      >
        <Button
          variant={isSwapPage ? "default" : "outline"}
          size="icon"
          onClick={() => nav("/swap")}
        >
          <Shuffle />
        </Button>
        <Button
          variant={isCollectionPage ? "default" : "outline"}
          size="icon"
          onClick={() => nav("/my-collection")}
        >
          <Library />
        </Button>
        <Button
          variant={isMyFeedPage ? "default" : "outline"}
          size="icon"
          onClick={() => nav("/my-feed")}
        >
          <Newspaper />
        </Button>
        {isLoggedIn && (
          <Link to="profile">
            <Avatar>
              <AvatarImage
                className={
                  isProfilePage
                    ? "rounded-full border-2  border-gray-500 object-cover"
                    : "rounded-full border-2  border-gray-100 object-cover"
                }
                src={
                  userImage ||
                  "https://www.creativefabrica.com/wp-content/uploads/2022/09/15/Black-ink-drop-mark-Paint-stain-splatte-Graphics-38548553-1-1-580x387.png"
                }
              />
              <AvatarFallback>??</AvatarFallback>
            </Avatar>
          </Link>
        )}
        {!isLoggedIn && <Button onClick={() => nav("/login")}>Login</Button>}
      </div>

      {/* <div
        className={`hidden  md:w-full md:flex md:justify-center md:py-2 md:items-center shadow-top ${
          theme === "dark" ? "bg-black" : "bg-white"
        } `}
      >
        Follow this project on Github !
      </div> */}
    </div>
  );
};

export default Footer;
