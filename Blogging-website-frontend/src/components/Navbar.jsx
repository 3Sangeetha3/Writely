import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Writely_logo.svg";
import NewPostIcon from "../assets/new_post_icon.svg";
import HomeIcon from "../assets/Home_icon.svg";
import SettingsIcon from "../assets/settings.svg";
import { Menu, X, User, ChevronDown, LogOut } from "lucide-react";
// Import AOS
import AOS from "aos";
import "aos/dist/aos.css";
import Typed from "typed.js";

function Navbar() {
  const { isAuth, authUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Create reference for the typed.js element
  const typedElementRef = useRef(null);
  const typedInstanceRef = useRef(null);

  // Set up Typed.js
  useEffect(() => {
    const initTyped = () => {
      if (typedElementRef.current && !typedInstanceRef.current) {
        typedInstanceRef.current = new Typed(typedElementRef.current, {
          strings: ["Writely"],
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 1500,
          loop: true,
          showCursor: false,
        });
      }
    };

    const initDelay = setTimeout(initTyped, 500);

    return () => {
      clearTimeout(initDelay);
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
        typedInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 500,
      once: false,
      easing: "ease-out",
      mirror: true,
    });
  }, []);

  // Refresh AOS when menu state changes
  useEffect(() => {
    AOS.refresh();
  }, [isMenuOpen, isProfileMenuOpen]);

  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".mobile-menu")
      ) {
        setIsMenuOpen(false);
      }
      if (
        isProfileMenuOpen &&
        !event.target.closest(".profile-menu-container")
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isProfileMenuOpen]);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    // Simple navigation without delays
    navigate(path);
    // Close menus without timeouts for smoother response
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-lg py-2"
          : "bg-white/95 backdrop-blur-sm shadow-md py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300"
            onClick={() => handleNavigation("/")}
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <img
              src={Logo}
              alt="Writely Logo"
              className="h-12 md:h-16 transition-all duration-300"
            />
            <h1 className="text-3xl font-medium ml-2">
              <span ref={typedElementRef}></span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center space-x-3"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <button
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                isActive("/")
                  ? "bg-[#53c7bf40] text-[#243635] shadow-md"
                  : "text-gray-600 hover:bg-[#53c7bf20] hover:text-[#243635] hover:shadow-md"
              }`}
              onClick={() => handleNavigation("/")}
              title="Home"
            >
              <img src={HomeIcon} alt="Home" className="w-8 h-8" />
            </button>

            {isAuth ? (
              <>
                <button
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    isActive("/editor")
                      ? "bg-[#53c7bf40] text-[#243635] shadow-md"
                      : "text-gray-600 hover:bg-[#53c7bf20] hover:text-[#243635] hover:shadow-md"
                  }`}
                  onClick={() => handleNavigation("/editor")}
                  title="New Post"
                >
                  <img src={NewPostIcon} alt="New Post" className="w-8 h-8" />
                </button>

                <button
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    isActive("/settings")
                      ? "bg-[#53c7bf40] text-[#243635] shadow-md"
                      : "text-gray-600 hover:bg-[#53c7bf20] hover:text-[#243635] hover:shadow-md"
                  }`}
                  onClick={() => handleNavigation("/settings")}
                  title="Settings"
                >
                  <img src={SettingsIcon} alt="Settings" className="w-8 h-8" />
                </button>

                <div className="relative profile-menu-container">
                  <button
                    className={`ml-2 flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive(`/profile/${authUser?.username}`)
                        ? "bg-[#53C7C0] text-white shadow-md"
                        : "bg-[#53c7bf15] text-[#243635] hover:bg-[#53C7C0] hover:text-white hover:shadow-lg"
                    }`}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white mr-2 flex-shrink-0 transition-all duration-300">
                      {authUser?.image ? (
                        <img
                          src={authUser.image}
                          alt={`${authUser.username}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className="text-lg font-medium mr-1">
                      {authUser?.username}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        isProfileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                      data-aos="fade-down"
                      data-aos-duration="300"
                    >
                      <div
                        className="flex items-center w-full px-4 py-2 text-left hover:bg-[#53c7bf15] transition-colors cursor-pointer"
                        onClick={() =>
                          handleNavigation(`/profile/${authUser?.username}`)
                        }
                      >
                        <User size={18} className="mr-2 text-[#53C7C0]" />
                        <span>My Profile</span>
                      </div>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div
                        className="flex items-center w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut size={18} className="mr-2" />
                        <span>Sign Out</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* desktop Sign Up button */}
                <button
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 text-lg font-medium ${
                    isActive("/register")
                      ? "bg-[#53C7C0] text-white shadow-md hover:bg-[#45b1aa]"
                      : "text-[#243635] bg-[#E6E8E5] hover:bg-[#d8dad7] hover:shadow-md"
                  }`}
                  onClick={() => handleNavigation("/register")}
                >
                  Sign Up
                </button>

                {/* desktop Sign In button */}
                <button
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 text-lg font-medium ${
                    isActive("/login")
                      ? "bg-[#45b1aa] text-white shadow-md hover:bg-[#3ca19a]"
                      : "text-[#243635] bg-[#E6E8E5] hover:bg-[#d8dad7] hover:shadow-md"
                  }`}
                  onClick={() => handleNavigation("/login")}
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden mobile-menu-container">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-12 h-12 rounded-full text-gray-600 hover:bg-[#E6E8E5] hover:text-[#243635] transition-all duration-300"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              data-aos="fade-left"
              data-aos-delay="100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Using AOS for smoother animations */}
      {isMenuOpen && (
        <div
          className="md:hidden mobile-menu bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          data-aos="fade-up"
          data-aos-duration="300"
        >
          <div className="px-4 py-4 space-y-2">
            <div
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                isActive("/")
                  ? "bg-[#53c7bf30] text-[#243635]"
                  : "hover:bg-[#53c7bf15]"
              }`}
              onClick={() => handleNavigation("/")}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img src={HomeIcon} alt="Home" className="w-7 h-7 mr-3" />
              <span className="text-lg font-medium">Home</span>
            </div>

            {isAuth ? (
              <>
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    isActive("/editor")
                      ? "bg-[#53c7bf30] text-[#243635]"
                      : "hover:bg-[#53c7bf15]"
                  }`}
                  onClick={() => handleNavigation("/editor")}
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <img
                    src={NewPostIcon}
                    alt="New Post"
                    className="w-7 h-7 mr-3"
                  />
                  <span className="text-lg font-medium">New Post</span>
                </div>

                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    isActive("/settings")
                      ? "bg-[#53c7bf30] text-[#243635]"
                      : "hover:bg-[#53c7bf15]"
                  }`}
                  onClick={() => handleNavigation("/settings")}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <img
                    src={SettingsIcon}
                    alt="Settings"
                    className="w-7 h-7 mr-3"
                  />
                  <span className="text-lg font-medium">Settings</span>
                </div>

                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    isActive(`/profile/${authUser?.username}`)
                      ? "bg-[#53c7bf30] text-[#243635]"
                      : "text-[#243635] hover:bg-[#53c7bf15]"
                  }`}
                  onClick={() =>
                    handleNavigation(`/profile/${authUser?.username}`)
                  }
                  data-aos="fade-up"
                  data-aos-delay="250"
                >
                  <User
                    size={18}
                    className="w-6 h-6 mr-3 justify-center items-center object-cover text-[#475756]"
                  />
                  <span className="text-lg font-medium">My Profile</span>
                </div>

                <div
                  className="flex items-center w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-300 cursor-pointer"
                  onClick={handleLogout}
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <LogOut size={20} className="w-6 h-6 ml-1 mr-3" />
                  <span className="text-lg font-medium">Sign Out</span>
                </div>
              </>
            ) : (
              /* mobile Sign Up and Sign In buttons */
              <div
                className="grid grid-cols-2 gap-3 mt-3"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                <button
                  className={`px-4 py-3 rounded-lg transition-all duration-300 text-lg font-medium text-center cursor-pointer ${
                    isActive("/register")
                      ? "bg-[#53C7C0] text-white hover:bg-[#45b1aa]"
                      : "text-[#243635] bg-[#E6E8E5] hover:bg-[#d8dad7]"
                  }`}
                  onClick={() => handleNavigation("/register")}
                >
                  Sign Up
                </button>

                <button
                  className={`px-4 py-3 rounded-lg transition-all duration-300 text-lg font-medium text-center cursor-pointer ${
                    isActive("/login")
                      ? "bg-[#45b1aa] text-white hover:bg-[#3ca19a]"
                      : "text-[#243635] bg-[#E6E8E5] hover:bg-[#d8dad7]"
                  }`}
                  onClick={() => handleNavigation("/login")}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
