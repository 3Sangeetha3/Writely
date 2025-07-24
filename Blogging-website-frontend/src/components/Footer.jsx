import React, { useEffect, useState } from "react";
import { Github, Heart } from "lucide-react";
import Logo from "../assets/logo.svg";

const Footer = () => {
  const [profileData, setProfileData] = useState({
    avatar_url: null,
    name: "Jadamal Sangeetha Choudhary",
    loading: true,
    error: false,
  });

  const githubUsername = "3sangeetha3";

  useEffect(() => {
    const fetchGithubProfile = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
            },
          }
        );

        if (response.status === 403) {
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub profile");
        }

        const data = await response.json();
        setProfileData({
          avatar_url: data.avatar_url,
          name: data.name || "Jadamal Sangeetha Choudhary",
          loading: false,
          error: false,
        });
      } catch (error) {
        console.error("Error fetching GitHub profile:", error);
        setProfileData((prev) => ({
          ...prev,
          loading: false,
          error: true,
        }));
      }
    };

    fetchGithubProfile();
  }, []);

  return (
    <footer className="w-full bg-gradient-to-r from-white/90 to-gray-50/90 border-t border-[#53C7C0]/30 shadow-lg px-6 py-6 backdrop-blur-lg mt-12">
      <div className="flex items-center justify-between gap-6 max-w-6xl mx-auto">
        {/* Logo and name */}
        <div className="flex items-center gap-3 font-bold text-[#243635]">
            <img src={Logo} alt="Writely Logo" className="w-10 h-10" />
          <span className="text-lg font-extrabold tracking-wide">Writely</span>
        </div>

        {/* Developed with heart message */}
        <div className="flex items-center gap-2 text-[#243635] font-medium">
          <span className="text-base">Developed with</span>
          <Heart 
            className={`w-5 h-5 text-red-500 fill-current transition-transform duration-300 animate-pulse`}
          />
          <span className="text-base font-semibold">by Sangeetha Jadamal</span>
        </div>

        {/* GitHub Button */}
        <a
          href={`https://github.com/${githubUsername}/writely`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#53C7C0] to-[#4AB3AC] text-white rounded-xl font-semibold shadow-lg hover:from-[#243635] hover:to-[#1a2928] transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <Github className="text-white hover:text-white" size={18} />
          <span className="text-white hover:text-white no-underline hover:no-underline focus:no-underline">GitHub</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
