import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const createCommentApi = async ({ slug, commentData }) => {
    const VITE_API_URL = import.meta.env.VITE_BACKEND_URL ;
    const { data } = await axios.post(
        `${VITE_API_URL}/api/articles/${slug}/comments`,
        { comment: commentData }
      );

      //console.log("createCommentApi", { data });

    return data;
  };

export default function useCreateComment() {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const navigate = useNavigate();


  const { mutate: createComment, isLoading: isCreatingComment } = useMutation({
    mutationFn: ({commentData}) => createCommentApi({slug, commentData}),
    onSuccess: () => {
      // alert("New comment successfully created");
      // Invalidate the comments query to update the list automatically
      queryClient.invalidateQueries({ queryKey: ["articleComments"] });
      // navigate('/');
    },
    onError: (err) => alert(err.message),
  });

  return { isCreatingComment, createComment };
}