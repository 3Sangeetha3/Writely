// AuthRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserQuery } from '../hooks';
import Skeleton from "@mui/material/Skeleton";

const AuthRoute = () => {
  const { isCurrentUserLoading, currentUser } = useUserQuery();

  // Render skeleton loading state
  if (isCurrentUserLoading) {
    return (
      <div className="settings-page bg-[#F8F9FA] min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Title Skeleton */}
          <Skeleton 
            variant="text"
            width="40%"
            height={60}
            sx={{ bgcolor: "#E0E3E3", borderRadius: "8px", margin: "0 auto 2rem" }}
          />
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
              {/* Left Column - Form Skeleton */}
              <div className="md:col-span-3 p-8">
                {/* Section Title Skeleton */}
                <Skeleton 
                  variant="text"
                  width="40%"
                  height={40}
                  sx={{ bgcolor: "#E0E3E3", borderRadius: "8px", marginBottom: 4 }}
                />
                
                {/* Profile Image Skeleton */}
                <div className="flex flex-col items-center mb-8">
                  <Skeleton 
                    variant="circular"
                    width={128}
                    height={128}
                    sx={{ bgcolor: "#E0E3E3", marginBottom: 1 }}
                  />
                  <Skeleton 
                    variant="text"
                    width={100}
                    height={20}
                    sx={{ bgcolor: "#E0E3E3" }}
                  />
                </div>
                
                {/* Form Fields Skeletons */}
                {[1, 2, 3, 4].map((item) => (
                  <div className="mb-6" key={item}>
                    <Skeleton 
                      variant="text"
                      width="25%"
                      height={24}
                      sx={{ bgcolor: "#E0E3E3", marginBottom: 1 }}
                    />
                    <Skeleton 
                      variant="rectangular"
                      width="100%"
                      height={56}
                      sx={{ bgcolor: "#E0E3E3", borderRadius: "6px" }}
                    />
                  </div>
                ))}
                
                {/* Button Skeletons */}
                <div className="flex flex-wrap gap-4 justify-between mt-8">
                  <Skeleton 
                    variant="rectangular"
                    width={140}
                    height={50}
                    sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
                  />
                  <Skeleton 
                    variant="rectangular"
                    width={140}
                    height={50}
                    sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
                  />
                </div>
              </div>
              
              {/* Right Column - Illustration Skeleton */}
              <div className="bg-gradient-to-br from-[#E7F9F8] to-[#F0FDFC] md:col-span-2 p-8 flex flex-col items-center justify-center">
                <div className="max-w-xs">
                  <Skeleton 
                    variant="rectangular"
                    width="300px"
                    height={200}
                    sx={{ bgcolor: "#E0E3E3", borderRadius: "12px", marginBottom: 3 }}
                  />
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <Skeleton 
                      variant="text"
                      width="60%"
                      height={32}
                      sx={{ bgcolor: "#E0E3E3", marginBottom: 2 }}
                    />
                    {[1, 2, 3].map((item) => (
                      <div className="flex items-start mb-3" key={item}>
                        <Skeleton 
                          variant="circular"
                          width={20}
                          height={20}
                          sx={{ bgcolor: "#E0E3E3", marginRight: 1, marginTop: 0.5 }}
                        />
                        <Skeleton 
                          variant="text"
                          width="90%"
                          height={20}
                          sx={{ bgcolor: "#E0E3E3" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!currentUser?.user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default AuthRoute;
