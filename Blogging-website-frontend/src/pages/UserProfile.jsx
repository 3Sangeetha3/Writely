import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProfileQuery, useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  FileText,
  Pen ,
  Edit3,
  UserX,
} from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Profile.css";
import { UserNotFoundUI } from "../components";

const UserProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { isProfileLoading, profile, articles, profileError } =
    useProfileQuery();
  const { authUser } = useAuth();
  const isCurrentUser = authUser?.username === username;
  const defaultAvatar =
    "https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Avatar/user-profile.png";

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  // Check for "user not found" error by message content or 404 status
  if (
    profileError &&
    (profileError.message === "User not found" ||
      profileError.response?.status === 404 ||
      profileError.message.includes("not found"))
  ) {
    return <UserNotFoundUI />;
  }

  // For other profile errors
  if (profileError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 bg-[#F8F9FA] min-h-screen flex items-center justify-center">
        <div
          className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-lg p-10 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-6">
            <UserX size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-[#243635] mb-4">
            Something went wrong
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#53C7C0] hover:bg-[#45b1aa] text-white rounded-lg transition hover:shadow-md"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // If profile is loaded but is null/undefined (another form of "not found")
  if (!isProfileLoading && !profile) {
    return <UserNotFoundUI />;
  }

  // Loading state
  if (isProfileLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 bg-[#F8F9FA]">
        {/* Header Section Skeleton */}
        <div className="bg-gradient-to-br from-[#243635] to-[#314c4a] rounded-xl shadow-lg overflow-hidden p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Skeleton
              variant="circular"
              width={128}
              height={128}
              sx={{ bgcolor: "#E0E3E3" }}
            />
            <div className="flex-1 text-center md:text-left">
              <Skeleton
                variant="text"
                width={200}
                height={40}
                sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
              />
              <Skeleton
                variant="text"
                width={150}
                height={24}
                sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
              />
              <Skeleton
                variant="text"
                width={300}
                height={60}
                sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
              />
            </div>
          </div>
        </div>

        {/* Articles Section Skeleton */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <Skeleton
            variant="text"
            width={180}
            height={40}
            sx={{ bgcolor: "#E0E3E3", borderRadius: "8px", marginBottom: 4 }}
          />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton
                  variant="text"
                  width="70%"
                  height={30}
                  sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={24}
                  sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
                />
                <Skeleton
                  variant="text"
                  width="30%"
                  height={20}
                  sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Successfully loaded profile
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-[#F8F9FA]">
      {/* Profile Header Section */}
      <div
        className="bg-gradient-to-br from-[#243635] to-[#314c4a] rounded-xl shadow-lg overflow-hidden transition-transform hover:shadow-xl"
        data-aos="fade-up"
      >
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#53C7C0] shadow-md bg-white">
                {profile.image ? (
                  <img
                    src={profile.image || defaultAvatar}
                    alt={`${profile.username}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              {isCurrentUser && (
                <button
                  className="absolute bottom-0 right-0 bg-[#53C7C0] p-2 rounded-full shadow-md"
                  onClick={() => navigate("/settings")}
                >
                  <Pen size={16} className="text-white" />
                </button>
              )}
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.username}
              </h1>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                <div className="bg-[#1D2E2D] text-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <Calendar size={14} />
                  <span>
                    Joined{" "}
                    {new Date(
                      profile.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-200 max-w-2xl">
                {profile.bio || "No bio available"}
              </p>

              {/* Action Buttons */}
              <div className="mt-4">
                {isCurrentUser ? (
                  <button
                    className="px-4 py-2 bg-[#53C7C0] hover:bg-[#45b1aa] text-white rounded-lg transition flex items-center gap-2"
                    onClick={() => navigate("/settings")}
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-[#53C7C0] hover:bg-[#45b1aa] text-white rounded-lg transition">
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div
        className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl p-8"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="flex items-center gap-3 mb-6">
          <FileText size={24} className="text-[#53C7C0]" />
          <h2 className="text-2xl font-bold text-[#243635]">
            Articles by {profile.username}
          </h2>
        </div>

        <div className="space-y-4">
          {articles?.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
              <FileText size={48} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No articles published yet.</p>
            </div>
          ) : (
            articles?.map((article) => (
              <div
                key={article._id}
                className="border border-gray-100 rounded-lg p-5 hover:bg-gray-50 transition cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => navigate(`/article/${article.slug}`)}
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#243635]">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
