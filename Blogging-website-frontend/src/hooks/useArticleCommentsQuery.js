import { useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const getArticleComments = async (slug) => {
  const VITE_API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const { data } = await axios.get(
    `${VITE_API_URL}/api/articles/${slug}/comments`
  );

  return data;
};

function useArticleCommentsQuery() {
  const { slug } = useParams();

  const {
    isLoading: isArticleCommentsLoading,
    data: articleComments,
    error: articleCommentsError,
  } = useQuery({
    queryKey: ["articleComments"],
    queryFn: async () => {
      const data = await getArticleComments(slug);
      return data;
    },


    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });
  return {
    isArticleCommentsLoading,
    articleComments,
    articleCommentsError,
  };
}

export default useArticleCommentsQuery;