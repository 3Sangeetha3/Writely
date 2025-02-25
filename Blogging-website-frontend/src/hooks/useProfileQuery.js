import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const getProfileByUsername = async (username) => {
  const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('authToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  const { data } = await axios.get(
    `${VITE_API_URL}/api/profiles/${username}`,
    { headers }
  );
  
  return data;
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
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });
  
  return {
    isProfileLoading,
    profile: profileData?.profile,
    profileError,
  };
}

export default useProfileQuery;