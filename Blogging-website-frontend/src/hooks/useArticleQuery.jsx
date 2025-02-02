import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import axios from 'axios'


const getArticleBySlug = async (slug) => {
    const VITE_API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const {data} = await axios.get(`${VITE_API_URL}/api/articles/${slug}`);

    //console.log("getCurrentUser", { data });

    return data;
  };
function useArticleQuery() {
  const { slug } = useParams()

  //console.log('slug',{slug})
//   return useQuery(`/articles/${article ? article?.slug : slug}`, {
//     enabled: !!slug || !!article?.slug,
//     placeholderData: { article: {} },
//     initialData: article ? { article } : undefined,
//   })
const {
    isLoading: isArticleLoading,
    data: article,
    error: ArticleError,
  } = useQuery({
    queryKey: ["slugArticle"],
    queryFn: getArticleBySlug,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });
  return {
    isArticleLoading,
    article,
    ArticleError,
  };
}

export default useArticleQuery