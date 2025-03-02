import React from 'react';
import { useArticleCommentsQuery, useAuth } from '../hooks';
import { Link } from 'react-router-dom';
import ArticleComment from './ArticleComment';
import ArticleCommentForm from './ArticleCommentForm';
import Skeleton from "@mui/material/Skeleton";
import { MessagesSquare } from 'lucide-react';

function ArticleComments() {
  const { isAuth } = useAuth();
  const {
    isArticleCommentsLoading,
    articleComments,
    articleCommentsError,
  } = useArticleCommentsQuery();

  // comments skeleton loading
  if (articleComments && isArticleCommentsLoading) {
    return (
      <div className='p-4'>
        <div className="space-y-4">
          {Array.from(new Array(3)).map((_, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg animate-pulse">
              {/* Simulate comment text */}
              <div className="mb-3">
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </div>
              {/* Simulate footer (author info and date) */}
              <div className="flex items-center gap-3 mt-3">
                <Skeleton variant="circular" width={30} height={30} />
                <Skeleton variant="text" width="20%" height={20} />
                <Skeleton variant="text" width="15%" height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="p-6 text-center">
        <MessagesSquare size={32} className="mx-auto mb-3 text-[#53C7C0]" />
        <p className="text-gray-600 mb-4">Join the conversation!</p>
        <p className="flex items-center justify-center gap-3">
          <Link to='/login' className="text-[#53C7C0] hover:text-[#45b1aa] font-medium transition-colors">
            Sign in
          </Link>
          <span className="text-gray-400">or</span>
          <Link to='/register' className="text-[#53C7C0] hover:text-[#45b1aa] font-medium transition-colors">
            Sign up
          </Link>
          <span className="text-gray-600">to add comments on this article</span>
        </p>
      </div>
    );
  }

  return (
    <div className="comment-section">
      <div className="p-4 border-b border-gray-100">
        <ArticleCommentForm />
      </div>
      <div className="comments-list divide-y divide-gray-100">
        {articleComments?.comments?.map((comment) => (
          <ArticleComment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default ArticleComments;