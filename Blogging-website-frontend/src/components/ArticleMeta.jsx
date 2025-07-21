import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks";
import { Calendar, User, Clock, Star, Sparkles } from "lucide-react";

function ArticleMeta({ author, createdAt }) {
  const { authUser } = useAuth();
  const defaultAvatar = "https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Avatar/user-profile.png";
  const displayImage = author?.image || defaultAvatar;
  const displayName = author?.username || "Anonymous";
  
  // Calculate relative time
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const articleDate = new Date(dateString);
    const diffInHours = Math.floor((now - articleDate) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return articleDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: articleDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const isCurrentUser = authUser?.username === author?.username;

  return (
    <div className="flex items-center gap-4 mb-4 p-4 bg-white/60 backdrop-blur-xl border-2 border-[#53C7C0]/40 rounded-2xl shadow-lg shadow-[#53C7C0]/5 hover:shadow-xl hover:shadow-[#53C7C0]/10 transition-all duration-300 group">
      {/* Avatar Section */}
      <div className="relative">
        <Link to={`/profile/${author?.username}`} className="block">
          <div className="relative">
            <img
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/60 group-hover:ring-[#53C7C0]/50 transition-all duration-300 shadow-lg shadow-gray-200/50 group-hover:shadow-[#53C7C0]/20 group-hover:scale-105"
              src={displayImage}
              alt={`${displayName}'s avatar`}
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
            
            {/* Online indicator for current user */}
            {isCurrentUser && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#53C7C0] to-[#4AB3AC] rounded-full border-2 border-white shadow-md">
                <div className="w-full h-full rounded-full bg-[#53C7C0] animate-pulse"></div>
              </div>
            )}
            
            {/* Sparkle effect on hover */}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
              <Sparkles className="w-4 h-4 text-[#53C7C0] animate-pulse" />
            </div>
          </div>
        </Link>
      </div>

      {/* Author Info Section */}
      <div className="flex-1 min-w-0">
        {/* Author Name */}
        <div className="flex items-center gap-2 mb-2">
          <Link
            to={`/profile/${author?.username}`}
            className="text-lg font-bold text-[#243635] hover:text-[#53C7C0] transition-all duration-300 group-hover:translate-x-1 flex items-center gap-2 truncate"
          >
            {displayName}
            {isCurrentUser && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#53C7C0]/20 to-[#4AB3AC]/20 rounded-full border border-[#53C7C0]/30">
                <Star className="w-3 h-3 text-[#53C7C0]" />
                <span className="text-xs font-medium text-[#53C7C0]">You</span>
              </div>
            )}
          </Link>
        </div>

        {/* Date and Time Info */}
        <div className="flex items-center gap-4 text-sm">
          {/* Relative Time */}
          <div className="flex items-center gap-1.5 text-gray-600 group-hover:text-[#53C7C0] transition-colors duration-300">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{getRelativeTime(createdAt)}</span>
          </div>

          {/* Separator */}
          <div className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-[#53C7C0] transition-colors duration-300"></div>

          {/* Full Date */}
          <div className="flex items-center gap-1.5 text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">
              {new Date(createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Author Badge (for verified or special users) */}
        {author?.bio && (
          <div className="mt-2 text-xs text-gray-600 line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
            <User className="w-3 h-3 inline mr-1" />
            {author.bio.substring(0, 50)}
            {author.bio.length > 50 && '...'}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleMeta;