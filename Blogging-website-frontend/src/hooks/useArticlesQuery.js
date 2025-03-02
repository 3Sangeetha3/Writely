import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "./useAuth";

function useArticlesQuery(tag) {
  const { authUser, isAuth } = useAuth();
  const token = authUser?.token;

  const fetchArticles = async () => {
    const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
    let url = "";
    let headers = {
      "Content-Type": "application/json",
    };

    // Add authorization header if user is authenticated
    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    // If a tag is provided, fetch articles filtered by that tag
    if (tag) {
      url = `${VITE_API_URL}/api/articles?tag=${tag}`;
    } else {
      // If user is authenticated, fetch feed, otherwise fetch global articles
      url = isAuth
        ? `${VITE_API_URL}/api/articles/feed`
        : `${VITE_API_URL}/api/articles`;
    }

    const { data } = await axios.get(url, { headers });
    // Adjust based on the response structure:
    return data.articles ? data.articles : data;
  };

  const {
    isLoading: isArticlesLoading,
    data: articles,
    error: ArticlesError,
  } = useQuery({
    queryKey: ["articles", tag, isAuth],
    queryFn: fetchArticles,
    enabled: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });

  return { isArticlesLoading, articles, ArticlesError };
}

export default useArticlesQuery;
