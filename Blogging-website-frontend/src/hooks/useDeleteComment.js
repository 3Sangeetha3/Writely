import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const deleteCommentApi = async ({ slug, commentId }) => {
  const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
  const { data } = await axios.delete(
    `${VITE_API_URL}/api/articles/${slug}/comments/${commentId}`
  );
  return data;
};

export default function useDeleteComment() {
  const queryClient = useQueryClient();
  const { slug } = useParams();

  return useMutation({
    mutationFn: ({ commentId }) => deleteCommentApi({ slug, commentId }),
    onSuccess: () => {
      // Invalidate the comments query to refresh the comment list after deletion
      queryClient.invalidateQueries({ queryKey: ['articleComments'] });
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
    }
  });
}
