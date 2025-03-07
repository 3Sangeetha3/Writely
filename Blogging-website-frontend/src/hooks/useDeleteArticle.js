import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const deleteArticleApi = (slug) => {
  const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
  
  // Get the JWT token 
  const jwt = window.localStorage.getItem('jwtToken');
  let token;
  
  // Parse the token from the JWT format
  if (jwt) {
    try {
      const parsed = JSON.parse(atob(jwt));
      token = parsed.token;
    //   console.log('Found token:', token ? 'Token exists' : 'No token found');
    } catch (error) {
      console.error('Error parsing JWT token:', error);
    }
  } 
//   else {
//     console.log('No JWT token found in localStorage');
//   }
  
  // delete request with the token
  return axios.delete(`${VITE_API_URL}/api/articles/${slug}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export default function useDeleteArticle() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (slug) => deleteArticleApi(slug).then(res => res.data),
    onSuccess: () => {
    //   console.log('Article deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate('/');
    },
    onError: (error) => {
      console.error('Error deleting article:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
    }
  });
}