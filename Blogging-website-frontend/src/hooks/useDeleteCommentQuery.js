import { useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const deleteCommentApi = async ({ slug, commentId }) => {
    const VITE_API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const { data } = await axios.delete(`${VITE_API_URL}/api/articles/${slug}/comments/${commentId}`);
    return data;
};

// export default function useDeleteComment() {
//   const queryClient = useQueryClient();

//   const { mutate: deleteComment, isLoading: isDeletingComment } = useMutation(deleteCommentApi, {
//     onSuccess: () => {
//       alert("Comment successfully deleted");
//       queryClient.invalidateQueries({ queryKey: ["articleComments"] });
//     },
//     onError: (err) => {
//       alert(err.message);
//     }
//   });

//   return { deleteComment, isDeletingComment };
// }

function useDeleteCommentQuery() {
    const { slug } = useParams();
    const {
        isLoading: isDeletingComment,
        data: deleteComment,
        error: deleteCommentError,
    } = useQuery({
        queryKey: ["deleteComment"],
        queryFn: async () => {
            const data = await deleteCommentApi(slug);
            return data;
        },
        refetchOnWindowFocus: true,
        staleTime: 0,
        cacheTime: 0,
    });
    return { isDeletingComment, deleteComment, deleteCommentError };
}

export default useDeleteCommentQuery;

