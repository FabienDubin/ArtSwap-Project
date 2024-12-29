import Reac, { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useTheme } from "./ThemeProvider";
import { Link, useNavigate } from "react-router-dom";

//ASSETS
import LogoLight from "../assets/LogoLight.png";
import LogoDark from "../assets/LogoDark.png";
import { Moon, Sun, Menu, SunMoon } from "lucide-react";

//COMPONENTS
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

const Navbar = () => {
  //CONTEXT
  const { user, isLoggedIn, isLoading, handleLogout } = useContext(AuthContext);
  const userImage = user?.image;

  //THEME
  const { theme, setTheme } = useTheme();
  //this variable is true if the dark mode is activated
  const isDarkMode = theme === "dark";

  //NAVIGATION
  const nav = useNavigate();

  return (
    <div className="flex justify-between items-center shadow-md w-full h-12 md:h-16 p-2 ">
      <Link to="/">
        <img
          className=" w-10 h-10 md:w-14 md:h-14"
          src={isDarkMode ? LogoDark : LogoLight}
          alt="Logo"
        />
      </Link>
      <div className="flex justify-center items-start ">
        {/* desktop top menu */}
        <div className="hidden md:flex">
          <Menubar>
            <Link to="/swap">
              <MenubarMenu>
                <MenubarTrigger>Swap</MenubarTrigger>
              </MenubarMenu>
            </Link>
            <Link to="/my-collection">
              <MenubarMenu>
                <MenubarTrigger>My Collection</MenubarTrigger>
              </MenubarMenu>
            </Link>
            <Link to="/feed">
              <MenubarMenu>
                <MenubarTrigger>My Feed</MenubarTrigger>
              </MenubarMenu>
            </Link>
          </Menubar>
          {isLoggedIn && (
            <div className="ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      className="rounded-full border-2  border-gray-100 object-cover"
                      src={
                        userImage ||
                        "https://www.creativefabrica.com/wp-content/uploads/2022/09/15/Black-ink-drop-mark-Paint-stain-splatte-Graphics-38548553-1-1-580x387.png"
                      }
                    />
                    <AvatarFallback>??</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link to="/profile">
                    <DropdownMenuItem>My Account</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={theme}
                          onValueChange={setTheme}
                        >
                          <DropdownMenuRadioItem value="light">
                            <Sun className="mr-2 h-4" /> Light
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="dark">
                            <Moon className="mr-2 h-4" /> Dark
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="system">
                            <SunMoon className="mr-2 h-4" />
                            System
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <Link to="/about">
                    <DropdownMenuItem>About Us</DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {!isLoggedIn && (
            <Button className="ml-4" onClick={() => nav("/login")}>
              Login
            </Button>
          )}
        </div>
        {/* mobile top menu */}
        {isLoggedIn && (
          <div className="ml-2 flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link to="/profile">
                  <DropdownMenuItem>My Account</DropdownMenuItem>
                </Link>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={theme}
                        onValueChange={setTheme}
                      >
                        <DropdownMenuRadioItem value="light">
                          <Sun className="mr-2 h-4" /> Light
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="dark">
                          <Moon className="mr-2 h-4" /> Dark
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="system">
                          <SunMoon className="mr-2 h-4" />
                          System
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <Link to="/about">
                  <DropdownMenuItem>About Us</DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {!isLoggedIn && (
          <div className="ml-2 flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link to="/login">
                  <DropdownMenuItem>Login</DropdownMenuItem>
                </Link>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={theme}
                        onValueChange={setTheme}
                      >
                        <DropdownMenuRadioItem value="light">
                          <Sun className="mr-2 h-4" /> Light
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="dark">
                          <Moon className="mr-2 h-4" /> Dark
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="system">
                          <SunMoon className="mr-2 h-4" />
                          System
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <Link to="/about">
                  <DropdownMenuItem>About Us</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
