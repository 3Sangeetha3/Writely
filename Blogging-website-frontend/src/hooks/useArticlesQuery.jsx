import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getAllArticles = async () => {
  const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
  const { data } = await axios.get(
    `${VITE_API_URL}/api/articles/feed`
  );

  //console.log("getCurrentUser", { data });

  return data;
};

function useArticlesQuery() {
  const {
    isLoading: isArticlesLoading,
    data: articles,
    error: ArticlesError,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: getAllArticles,
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
