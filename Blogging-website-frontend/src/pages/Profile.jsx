import React, { useState } from 'react';
import { useUserQuery, useArticlesQuery } from '../hooks';
import "./Profile.css";

const Profile = () => {
  const { isCurrentUserLoading, currentUser, currentUserError } = useUserQuery();
  const username = currentUser?.user?.username;
  // Fetch articles created by the current user
  const { isArticlesLoading, articles, ArticlesError } = useArticlesQuery(null, username);

  // Check if the user is still loading
  if (isCurrentUserLoading) {
    return <div className="container text-center py-8">Loading profile...</div>;
  }
  // Handle any errors during fetching
  if (currentUserError) {
    return (
      <div className="container text-center py-8 text-red-500">
        Error fetching user profile: {currentUserError.message}
      </div>
    );
  }
  // Access the user data
  const user = currentUser?.user;
  // Check if user data is available
  if (!user) {
    return <div className="container text-center py-8">No user data available</div>;
  }
  const defaultAvatar =
    'https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Avatar/user-profile.png';

  return (
    <div className="pb-8">
      <div className="text-center bg-gray-100 py-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="user-info flex flex-col items-center">
            <img
              src={user.image || defaultAvatar}
              alt={`${user.username}'s avatar`}
              className="rounded-full h-24 w-24 object-cover p-1"
            />
            <h4 className="mt-2 text-2xl font-bold">{user.username}</h4>
            <p className="text-gray-600 mt-2 max-w-md text-center">
              {user.bio || 'No bio available'}
            </p>
            <button className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Uncomment below to display articles */}
      {/*
      <div className="container mx-auto px-4">
        <div className="feed-toggle">
          <ul className="flex border-b mb-4">
            <li className="nav-item">
              <button className="px-4 py-2 bg-[#001519] text-white rounded-t-md">
                My Articles
              </button>
            </li>
          </ul>
        </div>
        {isArticlesLoading ? (
          <div className="text-center py-8">Loading articles...</div>
        ) : ArticlesError ? (
          <div className="text-center py-8 text-red-500">
            Error loading articles: {ArticlesError.message}
          </div>
        ) : (
          <ArticleList articles={articles} />
        )}
      </div>
      */}
    </div>
  );
};

export default Profile;
