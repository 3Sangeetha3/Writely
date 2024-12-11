import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import axios from 'axios'


const getArticleBySlug = async (slug) => {
  const token = localStorage.getItem('authToken'); // Retrieve token from storage
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const { data } = await axios.get(
    `http://localhost:3000/api/articles/${slug}`,
    { headers } // Include headers in the request
  );

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
    queryKey: ["article", slug], // Include slug in the query key
    queryFn: () => getArticleBySlug(slug), // Pass slug to the query function
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
