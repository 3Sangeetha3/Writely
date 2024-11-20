import React from "react";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import Logo from "../assets/Writely_logo.svg";
import NewPostIcon from "../assets/new_post_icon.svg";
import HomeIcon from "../assets/Home_icon.svg";
import SettingsIcon from "../assets/settings.svg";

function Navbar() {
  const { isAuth, authUser } = useAuth();
  const navigate = useNavigate(); // Hook for navigation

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#FCFBF9] p-3 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center cursor-pointer" onClick={() => handleNavigation("/")}>
          <img src={Logo} alt="Writely Logo" className="w-44 h-auto" />
        </div>
        <ul className="flex space-x-2">
          <li className="text-2xl">
            <button
              className="text-gray-600 no-underline cursor-pointer hover:text-[#475756] hover:bg-[#E6E8E5] transition duration-300 p-2 rounded font-semibold"
              onClick={() => handleNavigation("/")}
            >
              <img src={HomeIcon} alt="Home icon" className="w-8 h-8" />
            </button>
          </li>
          {isAuth && (
            <>
              <li className="text-2xl">
                <button
                  className="text-gray-600 no-underline cursor-pointer hover:text-[#475756] hover:bg-[#E6E8E5] transition duration-300 p-2 rounded font-semibold"
                  onClick={() => handleNavigation("/editor")}
                >
                  <img src={NewPostIcon} alt="New post icon" className="w-8 h-8" />
                </button>
              </li>
              <li className="text-2xl">
                <button
                  className="text-gray-600 no-underline cursor-pointer hover:text-[#475756] hover:bg-[#E6E8E5] transition duration-300 p-2 rounded font-semibold"
                  onClick={() => handleNavigation("/settings")}
                >
                  <img src={SettingsIcon} alt="Settings icon" className="w-8 h-8" />
                </button>
              </li>
              <li className="text-2xl">
                <button
                  className="text-gray-600 no-underline cursor-pointer hover:text-[#475756] hover:bg-[#E6E8E5] transition duration-300 p-2 rounded font-semibold"
                  onClick={() => handleNavigation(`/profile/${authUser?.username}`)}
                >
                  👋🏻 {authUser?.username}
                </button>
              </li>
            </>
          )}
          {!isAuth && (
            <>
              <li className="text-2xl">
                <button
                  className="text-gray-600 no-underline cursor-pointer hover:text-[#475756] hover:bg-[#E6E8E5] transition duration-300 p-2 rounded font-semibold"
                  onClick={() => handleNavigation("/register")}
                >
                  SignUp
                </button>
              </li>
              <li className="text-2xl">
                <button
                  className="text-gray-600 no-underline cursor-pointer hover:text-[#475756] hover:bg-[#E6E8E5] transition duration-300 p-2 rounded font-semibold"
                  onClick={() => handleNavigation("/login")}
                >
                  Sign in
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
