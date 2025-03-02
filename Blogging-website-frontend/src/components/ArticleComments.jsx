import React, { useEffect } from "react";
import { useArticleCommentsQuery, useAuth } from "../hooks";
import { Link } from "react-router-dom";
import ArticleComment from "./ArticleComment";
import ArticleCommentForm from "./ArticleCommentForm";
import Skeleton from "@mui/material/Skeleton";
import { MessagesSquare, MessageCircle } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function ArticleComments() {
  const { isAuth } = useAuth();
  const { isArticleCommentsLoading, articleComments, articleCommentsError } =
    useArticleCommentsQuery();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  // comments skeleton loading
  if (articleComments && isArticleCommentsLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {Array.from(new Array(3)).map((_, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg animate-pulse"
            >
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

  if (articleCommentsError) {
    return (
      <div className="p-6 text-center" data-aos="fade-up">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          Error loading comments: {articleCommentsError.message}
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="p-6 text-center" data-aos="fade-up">
        <div className="bg-[#E7F9F8] rounded-lg p-6">
          <MessagesSquare size={32} className="mx-auto mb-3 text-[#53C7C0]" />
          <p className="text-xl text-[#243635] mb-4">Join the conversation!</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/login"
              className="bg-[#53C7C0] hover:bg-[#45b1aa] hover:text-[#001514] text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Sign in
            </Link>
            <span className="text-gray-400">or</span>
            <Link
              to="/register"
              className="bg-white border border-[#53C7C0] text-[#53C7C0] hover:text-[#001514] hover:bg-[#E7F9F8] px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Sign up
            </Link>
            <span className="text-[243635] mt-2 md:mt-0">
              to add comments on this article
            </span>
          </div>
        </div>
      </div>
    );
  }

  const commentCount = articleComments?.comments?.length || 0;

  return (
    <div className="comment-section">
      <div className="p-6 border-b border-gray-100">
        <ArticleCommentForm />
      </div>
      {commentCount > 0 ? (
        <div className="comments-list divide-y divide-gray-100">
          {articleComments?.comments?.map((comment) => (
            <ArticleComment key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <MessageCircle size={32} className="mx-auto mb-3 text-[#53C7C0]" />
          <p className="text-[#243635]">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}

export default ArticleComments;
