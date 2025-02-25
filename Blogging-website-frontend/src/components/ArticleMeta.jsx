import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks";

function ArticleMeta({ author, createdAt }) {
  const { authUser } = useAuth();

  if (!author) return null; // Prevent rendering if author is undefined

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
          src={author.image || '/default-avatar.png'}
          alt={`${author.username} image`}
        />
      </Link>
      <div className="info">
        <Link
          to={`/profile/${author?.username}`}
          className="text-md font-semibold hover:text-[#53C7C0] hover:underline transition duration-300"
        >
          {author?.username}
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
