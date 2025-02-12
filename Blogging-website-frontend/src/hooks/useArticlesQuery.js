import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import useAuth from './useAuth';  // Import the useAuth hook

function useArticlesQuery() {
  const { authUser, isAuth } = useAuth();  // Get authUser and isAuth from useAuth
  
  // Get the JWT token from authUser
  const token = authUser?.token;

  // API call to fetch all articles
  const getAllArticles = async () => {
    if (!token) {
      throw new Error("Token is missing. Cannot fetch articles.");
    }

    //console.log('token: ', token);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,  // Add the Authorization header with the token from useAuth
    };

    const VITE_API_URL = import.meta.env.VITE_BACKEND_URL ;
    const { data } = await axios.get(`${VITE_API_URL}/api/articles/feed`, {
      headers: headers,
    });
    return data;
  };

  const { isLoading: isArticlesLoading, data: articles, error: ArticlesError } = useQuery({
    queryKey: ["articles"],
    queryFn: getAllArticles,
    enabled: isAuth,  // Only enable the query if the user is authenticated
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });

  return {
    isArticlesLoading,
    articles,
    ArticlesError,
  };
}

export default useArticlesQuery;
