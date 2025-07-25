
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const getAllTags = async () => {
  const VITE_API_URL = import.meta.env.VITE_BACKEND_URL ;
  const {data} = await axios.get(`${VITE_API_URL}/api/tags`);

//   console.log("getCurrentUser", { data });

  return data;
};

function useTagsQuery() {
  const {
    isLoading: isTagsLoading,
    data: tags,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });
  return {
    isTagsLoading,
    tags,
    tagsError,
  };
}

export default useTagsQuery;