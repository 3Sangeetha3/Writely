import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const getProfileByUsername = async (username) => {
  const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('authToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  try {
    const { data } = await axios.get(
      `${VITE_API_URL}/api/profiles/${username}`,
      { headers }
    );
    
    return data;
  } catch (error) {
    throw error;
  }
};

function useProfileQuery() {
  const { username } = useParams();
  
  const {
    isLoading: isProfileLoading,
    data: profileData,
    error: profileError,
  } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfileByUsername(username),
    enabled: !!username,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60000,
    cacheTime: 300000,
  });
  // console.log(profileData);
  
  return {
    isProfileLoading,
    profile: profileData?.profile, //User profile data
    articles: profileData?.articles, //Articles created by the user
    profileError,
  };
}

export default useProfileQuery;