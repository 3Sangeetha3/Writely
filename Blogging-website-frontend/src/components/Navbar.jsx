import React from "react";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import Logo from "../assets/Writely_logo.svg";

function Navbar() {
  const { isAuth, authUser } = useAuth();
  const navigate = useNavigate(); // Hook for navigation

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <nav className="bg-[#FCFBF9] p-3 m-3">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center cursor-pointer" onClick={() => handleNavigation("/")}>
          <img src={Logo} alt="Writely Logo" className="w-44 h-auto" />
        </div>
        <ul className="flex space-x-10">
          <li className="text-2xl">
            <button
              className="text-gray-600 no-underline cursor-pointer hover:text-[#475756] hover:bg-[#E6E8E5] transition duration-300 p-2 rounded font-semibold"
              onClick={() => handleNavigation("/")}
            >
              Home
            </button>
          </li>
          {isAuth && (
            <>
              <li className="text-2xl">
                <button
                  className="text-gray-600 no-underline cursor-pointer hover:text-[#475756] hover:bg-[#E6E8E5] transition duration-300 p-2 rounded font-semibold"
                  onClick={() => handleNavigation("/editor")}
                >
                  New Post
                </button>
              </li>
              <li className="text-2xl">
                <button
                  className="text-gray-600 no-underline cursor-pointer hover:text-[#475756] hover:bg-[#E6E8E5] transition duration-300 p-2 rounded font-semibold"
                  onClick={() => handleNavigation("/settings")}
                >
                  Settings
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
