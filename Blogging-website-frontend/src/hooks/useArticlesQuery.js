import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "./useAuth";

function useArticlesQuery(tag) {
  const { authUser, isAuth } = useAuth();
  const token = authUser?.token;

  const fetchArticles = async () => {
    if (!token) {
      throw new Error("Token is missing. Cannot fetch articles.");
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
    let url = "";
    // If a tag is provided, fetch articles filtered by that tag
    if (tag) {
      url = `${VITE_API_URL}/api/articles?tag=${tag}`;
    } else {
      url = `${VITE_API_URL}/api/articles/feed`;
    }
    const { data } = await axios.get(url, { headers });
    // Adjust based on the response structure:
    return data.articles ? data.articles : data;
  };

  const { isLoading: isArticlesLoading, data: articles, error: ArticlesError } =
    useQuery({
      queryKey: ["articles", tag],
      queryFn: fetchArticles,
      enabled: isAuth,
      refetchOnWindowFocus: true,
      staleTime: 0,
      cacheTime: 0,
    });

  return { isArticlesLoading, articles, ArticlesError };
}

export default useArticlesQuery;
