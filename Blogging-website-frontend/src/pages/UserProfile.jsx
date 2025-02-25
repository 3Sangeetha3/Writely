import React from 'react';
import { useParams } from 'react-router-dom';
import { useProfileQuery, useAuth } from '../hooks';
import "./Profile.css";


const UserProfile = () => {
  const { username } = useParams();
  const { isProfileLoading, profile, profileError } = useProfileQuery();
  const { authUser } = useAuth();
  const isCurrentUser = authUser?.username === username;
  const defaultAvatar = "https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Avatar/user-profile.png";

  if (isProfileLoading) {
    return <div className="container text-center py-8">Loading profile...</div>;
  }
  if (profileError) {
    return <div className="container text-center py-8 text-red-500">Error fetching profile: {profileError.message}</div>;
  }
  if (!profile) {
    return <div className="container text-center py-8">Profile not found</div>;
  }

  return (
    <div className="pb-8">
      <div className="text-center bg-gray-100 py-8 mb-8">
        <div className="user-info container mx-auto px-4 flex flex-col items-center">
          <img 
            src={profile.image || defaultAvatar} 
            alt={`${profile.username}'s avatar`}
            className="rounded-full h-40 w-40 object-cover p-1"
          />
          <h4 className="mt-2 text-2xl font-bold">{profile.username}</h4>
          <p className="text-gray-600 mt-2 text-center max-w-md">{profile.bio || 'No bio available'}</p>
          {isCurrentUser ? (
            <button className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
              Edit Profile
            </button>
          ) : (
            <button className="mt-4 px-4 py-2 bg-[#001519] text-white rounded-md hover:bg-[#475756] transition">
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
