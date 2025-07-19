import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Writely_logo.svg";
import HomeIcon from "../assets/Home_icon.svg";
import SettingsIcon from "../assets/settings.svg";
import { Menu, X, User, ChevronDown, LogOut, PenSquare } from "lucide-react";
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
  const typedElementRef = useRef(null);
  const typedInstanceRef = useRef(null);

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

  useEffect(() => {
    AOS.init({ duration: 500, once: false, easing: "ease-out", mirror: true });
  }, []);
  useEffect(() => { AOS.refresh(); }, [isMenuOpen, isProfileMenuOpen]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".mobile-menu")
      ) setIsMenuOpen(false);
      if (
        isProfileMenuOpen &&
        !event.target.closest(".profile-menu-container")
      ) setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isProfileMenuOpen]);
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };
  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-lg py-2"
          : "bg-white/95 backdrop-blur-sm shadow-md py-3"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300 gap-2"
            onClick={() => handleNavigation("/")}
            data-aos="fade-right"
            data-aos-delay="100"
            tabIndex={0}
            aria-label="Go to home"
            onKeyDown={e => e.key === 'Enter' && handleNavigation("/")}
          >
            <img
              src={Logo}
              alt="Writely Logo"
              className="h-12 md:h-16 transition-all duration-300 drop-shadow-lg rounded-xl p-1"
            />
            <h1 className="text-3xl font-bold ml-1 tracking-tight text-[#243635]">
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
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#53C7C0]/40 focus:outline-none ${
                isActive("/")
                  ? "bg-[#53c7bf30] text-[#243635] shadow-md"
                  : "text-gray-600 hover:bg-[#53c7bf15] hover:text-[#243635] hover:shadow-md"
              }`}
              onClick={() => handleNavigation("/")}
              title="Home"
              aria-label="Home"
            >
              <img src={HomeIcon} alt="Home" className="w-7 h-7" />
            </button>

            {isAuth ? (
              <>
                <button
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#53C7C0]/40 focus:outline-none ${
                    isActive("/editor")
                      ? "bg-[#53c7bf30] text-[#243635] shadow-md"
                      : "text-gray-600 hover:bg-[#53c7bf15] hover:text-[#243635] hover:shadow-md"
                  }`}
                  onClick={() => handleNavigation("/editor")}
                  title="New Post"
                  aria-label="New Post"
                >
                  <PenSquare className="w-7 h-7" />
                </button>

                <button
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#53C7C0]/40 focus:outline-none ${
                    isActive("/settings")
                      ? "bg-[#53c7bf30] text-[#243635] shadow-md"
                      : "text-gray-600 hover:bg-[#53c7bf15] hover:text-[#243635] hover:shadow-md"
                  }`}
                  onClick={() => handleNavigation("/settings")}
                  title="Settings"
                  aria-label="Settings"
                >
                  <img src={SettingsIcon} alt="Settings" className="w-7 h-7" />
                </button>

                <div className="relative profile-menu-container">
                  <button
                    className={`ml-2 flex items-center px-4 py-2 rounded-full transition-all duration-300 focus:ring-2 focus:ring-[#53C7C0]/40 focus:outline-none gap-2 ${
                      isActive(`/profile/${authUser?.username}`)
                        ? "bg-[#53C7C0] text-white shadow-md"
                        : "bg-[#53c7bf15] text-[#243635] hover:bg-[#53C7C0] hover:text-white hover:shadow-lg"
                    }`}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    aria-haspopup="true"
                    aria-expanded={isProfileMenuOpen}
                    aria-label="Open profile menu"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white mr-1 flex-shrink-0 transition-all duration-300 bg-gray-100 flex items-center justify-center">
                      {authUser?.image ? (
                        <img
                          src={authUser.image}
                          alt={`${authUser.username}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-gray-400" />
                      )}
                    </div>
                    <span className="text-lg font-semibold mr-1">
                      {authUser?.username}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        isProfileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn"
                      data-aos="fade-down"
                      data-aos-duration="300"
                      tabIndex={-1}
                    >
                      <div
                        className="flex items-center w-full px-4 py-3 text-left hover:bg-[#F0FDFC] transition-colors cursor-pointer rounded-xl gap-2"
                        onClick={() => handleNavigation(`/profile/${authUser?.username}`)}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && handleNavigation(`/profile/${authUser?.username}`)}
                      >
                        <User size={20} className="text-[#53C7C0]" />
                        <span className="text-base font-medium">My Profile</span>
                      </div>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div
                        className="flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-colors cursor-pointer rounded-xl gap-2"
                        onClick={handleLogout}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && handleLogout()}
                      >
                        <LogOut size={20} />
                        <span className="text-base font-medium">Sign Out</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  className={`px-5 py-2.5 rounded-xl transition-all duration-300 text-lg font-semibold focus:ring-2 focus:ring-[#53C7C0]/40 focus:outline-none ${
                    isActive("/register")
                      ? "bg-[#53C7C0] text-white shadow-md hover:bg-[#45b1aa]"
                      : "text-[#243635] bg-[#E6E8E5] hover:bg-[#d8dad7] hover:shadow-md"
                  }`}
                  onClick={() => handleNavigation("/register")}
                  aria-label="Sign Up"
                >
                  Sign Up
                </button>
                <button
                  className={`px-5 py-2.5 rounded-xl transition-all duration-300 text-lg font-semibold focus:ring-2 focus:ring-[#53C7C0]/40 focus:outline-none ${
                    isActive("/login")
                      ? "bg-[#45b1aa] text-white shadow-md hover:bg-[#3ca19a]"
                      : "text-[#243635] bg-[#E6E8E5] hover:bg-[#d8dad7] hover:shadow-md"
                  }`}
                  onClick={() => handleNavigation("/login")}
                  aria-label="Sign In"
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
              className="flex items-center justify-center w-12 h-12 rounded-xl text-gray-600 hover:bg-[#E6E8E5] hover:text-[#243635] transition-all duration-300 focus:ring-2 focus:ring-[#53C7C0]/40 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              data-aos="fade-left"
              data-aos-delay="100"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden mobile-menu bg-white border-t border-gray-100 shadow-2xl overflow-hidden animate-fadeIn"
          data-aos="fade-up"
          data-aos-duration="300"
        >
          <div className="px-4 py-4 space-y-2">
            <div
              className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer gap-3 ${
                isActive("/")
                  ? "bg-[#53c7bf30] text-[#243635]"
                  : "hover:bg-[#F0FDFC]"
              }`}
              onClick={() => handleNavigation("/")}
              data-aos="fade-up"
              data-aos-delay="100"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleNavigation("/")}
            >
              <img src={HomeIcon} alt="Home" className="w-7 h-7" />
              <span className="text-lg font-semibold">Home</span>
            </div>

            {isAuth ? (
              <>
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer gap-3 ${
                    isActive("/editor")
                      ? "bg-[#53c7bf30] text-[#243635]"
                      : "hover:bg-[#F0FDFC]"
                  }`}
                  onClick={() => handleNavigation("/editor")}
                  data-aos="fade-up"
                  data-aos-delay="150"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleNavigation("/editor")}
                >
                  <PenSquare className="w-7 h-7" />
                  <span className="text-lg font-semibold">New Post</span>
                </div>

                <div
                  className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer gap-3 ${
                    isActive("/settings")
                      ? "bg-[#53c7bf30] text-[#243635]"
                      : "hover:bg-[#F0FDFC]"
                  }`}
                  onClick={() => handleNavigation("/settings")}
                  data-aos="fade-up"
                  data-aos-delay="200"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleNavigation("/settings")}
                >
                  <img src={SettingsIcon} alt="Settings" className="w-7 h-7" />
                  <span className="text-lg font-semibold">Settings</span>
                </div>

                <div
                  className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer gap-3 ${
                    isActive(`/profile/${authUser?.username}`)
                      ? "bg-[#53c7bf30] text-[#243635]"
                      : "hover:bg-[#F0FDFC]"
                  }`}
                  onClick={() => handleNavigation(`/profile/${authUser?.username}`)}
                  data-aos="fade-up"
                  data-aos-delay="250"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleNavigation(`/profile/${authUser?.username}`)}
                >
                  <User size={20} className="w-7 h-7" />
                  <span className="text-lg font-semibold">My Profile</span>
                </div>

                <div
                  className="flex items-center w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 cursor-pointer gap-3"
                  onClick={handleLogout}
                  data-aos="fade-up"
                  data-aos-delay="300"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleLogout()}
                >
                  <LogOut size={22} className="w-7 h-7" />
                  <span className="text-lg font-semibold">Sign Out</span>
                </div>
              </>
            ) : (
              <div
                className="grid grid-cols-2 gap-3 mt-3"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                <button
                  className={`px-4 py-3 rounded-xl transition-all duration-300 text-lg font-semibold text-center cursor-pointer focus:ring-2 focus:ring-[#53C7C0]/40 focus:outline-none ${
                    isActive("/register")
                      ? "bg-[#53C7C0] text-white hover:bg-[#45b1aa]"
                      : "text-[#243635] bg-[#E6E8E5] hover:bg-[#d8dad7]"
                  }`}
                  onClick={() => handleNavigation("/register")}
                  aria-label="Sign Up"
                >
                  Sign Up
                </button>
                <button
                  className={`px-4 py-3 rounded-xl transition-all duration-300 text-lg font-semibold text-center cursor-pointer focus:ring-2 focus:ring-[#53C7C0]/40 focus:outline-none ${
                    isActive("/login")
                      ? "bg-[#45b1aa] text-white hover:bg-[#3ca19a]"
                      : "text-[#243635] bg-[#E6E8E5] hover:bg-[#d8dad7]"
                  }`}
                  onClick={() => handleNavigation("/login")}
                  aria-label="Sign In"
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
