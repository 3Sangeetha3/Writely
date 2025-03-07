import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [profileData, setProfileData] = useState({
    avatar_url: null,
    name: "Jadamal Sangeetha Choudhary",
    loading: true,
    error: false,
  });

  // The GitHub username to fetch
  const githubUsername = "3sangeetha3";

  useEffect(() => {
    // Fetch GitHub profile data
    const fetchGithubProfile = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}`,{
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
          },
        });

        if (response.status === 403) {
            console.log('Rate limit exceeded - try again later');
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
    <footer className="w-full py-6 bg-[#243635]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          {/* GitHub Profile Section */}
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center mb-4 transition-transform transform hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative">
              {/* Profile Image */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#53C7C0] shadow-md transition-all duration-300 group-hover:border-[#243635]">
                {profileData.loading ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-[#53C7C0] border-t-transparent rounded-full"></div>
                  </div>
                ) : profileData.error || !profileData.avatar_url ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Github size={20} className="text-gray-400" />
                  </div>
                ) : (
                  <img
                    src={profileData.avatar_url}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* GitHub Logo Overlay on Hover */}
              <div
                className={`absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                  isHovered ? "opacity-70" : "opacity-0"
                }`}
              >
                <Github size={16} className="text-white" />
              </div>
            </div>
          </a>

          {/* Visit Repository Button */}
          <a
            href={`https://github.com/${githubUsername}/writely`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center px-4 py-2 mb-4 bg-[#53C7C0] hover:bg-[#45b1aa] text-white hover:text-[#243635] text-sm rounded-lg transition-colors shadow-md `}
          >
            <Github size={16} className="mr-2" />
            Visit Repository
          </a>

          {/* Signature Line */}
          <div className="mt-3 text-center text-[#FCFBF9] text-sm">
            <p className="mt-1">
              Designed with{" "}
              <span className="text-red-500 animate-pulse">❤️</span> by{" "}
              <span className="font-medium">{profileData.name}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
