import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const getCurrentUser = async () => {
  const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
  const { data } = await axios.get(`${VITE_API_URL}/api/user`);
  return data;
};

function useUserQuery() {
  const {
    isLoading: isCurrentUserLoading,
    data: currentUser,
    error: currentUserError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });

  return {
    isCurrentUserLoading,
    currentUser,
    currentUserError,
  };
}

export default useUserQuery;
