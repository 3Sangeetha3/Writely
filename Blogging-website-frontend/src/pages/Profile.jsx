import React from 'react';
import { useUserQuery } from '../hooks';
import "./Profile.css";

const Profile = () => {
  const { isCurrentUserLoading, currentUser, currentUserError } = useUserQuery();

  // Check if the user is still loading
  if (isCurrentUserLoading) {
    return <div>Loading...</div>;
  }

  // Handle any errors during fetching
  if (currentUserError) {
    return <div>Error fetching user profile: {currentUserError.message}</div>;
  }

  // Access the user data
  const user = currentUser?.user;

  // Check if user data is available
  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 offset-md-3 col-xs-12">
        <h1 className="text-xs-center" style={{color: "#475756", marginBottom: "30px", marginTop: "60px"}}>Profile</h1>
          <div className='profile'>
            {user.image && (
              <img src={user.image} alt={`${user.username}'s profile`} className="profile-image" />
            )}
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Bio: {user.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
