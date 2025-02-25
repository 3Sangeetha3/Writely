import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks";

function ArticleMeta({ author, createdAt }) {
  const { authUser } = useAuth();
  const defaultAvatar  = "https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Avatar/user-profile.png";

  const displayImage = author?.image || defaultAvatar;
  const displayName = author?.username || "Anonymous";

  if (!author) {
    return (
      <div className="article-meta">
        <div className="flex items-center">
          <img
            className="p-[2px] rounded-full mr-2 ring-2 ring-[#475756] hover:ring-[#53C7C0] transition duration-300"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={defaultAvatar}
            alt="Anonymous user"
          />
          <div className="info">
            <span className="text-md font-semibold hover:text-[#53C7C0] hover:underline transition duration-300">Anonymous</span>
          </div>
        </div>
      </div>
    );
  }

  const canUpdate = authUser?.username === author?.username;

  return (
    <div className="article-meta">
      <Link to={`/profile/${author?.username}`}>
        <img
          className="p-[2px] rounded-full mr-2 ring-2 ring-[#475756] hover:ring-[#53C7C0] transition duration-300"
          style={{
            width: "48px",
            height: "48px",
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "50%",
          }}
          src={displayImage}
          alt={`${displayName} image`}
        />
      </Link>
      <div className="info">
        <Link
          to={`/profile/${author?.username}`}
          className="text-md font-semibold hover:text-[#53C7C0] hover:underline transition duration-300"
        >
          {displayName}
        </Link>
        <span 
          className="date text-sm text-gray-500"
          style={{
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            color: '#718096',
          }}
        >
          {new Date(createdAt).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}

export default ArticleMeta;
