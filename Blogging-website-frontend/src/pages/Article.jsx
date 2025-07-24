import React, { useEffect } from "react";
import { ArticleComments, ArticleMeta } from "../components";
import { useArticleQuery } from "../hooks";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import DOMPurify from "dompurify";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function Article() {
  const { slug } = useParams();
  const { article, isArticleLoading, ArticleError } = useArticleQuery();

  useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  if (isArticleLoading) {
    return (
      <div className="max-w-6xl mt-28 mx-auto px-4 py-8 bg-[#FCFBF9]">
        {/* Banner Section Skeleton */}
        <div className="banner bg-[#243635] rounded-xl shadow-lg overflow-hidden p-8 flex flex-col items-center justify-center">
          <Skeleton
            variant="text"
            width="60%"
            height={50}
            sx={{ bgcolor: "#E0E3E3", borderRadius: "8px", marginBottom: 6 }}
          />
          <div className="">
            <div className="flex items-center m-2 gap-3">
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ bgcolor: "#E0E3E3" }}
              />
              <div>
                <Skeleton
                  variant="text"
                  width={100}
                  height={15}
                  sx={{ bgcolor: "#E0E3E3" }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={12}
                  sx={{ bgcolor: "#E0E3E3" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-200 text-sm">
            <Skeleton
              variant="rectangular"
              width={80}
              height={20}
              sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
            />
            <Skeleton
              variant="rectangular"
              width={80}
              height={20}
              sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
            />
            <Skeleton
              variant="rectangular"
              width={80}
              height={20}
              sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
            />
          </div>
        </div>

        {/* Article Content Skeleton */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <Skeleton
            variant="text"
            width="70%"
            height={40}
            sx={{ bgcolor: "#E0E3E3", borderRadius: "8px" }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={30}
            sx={{
              bgcolor: "#E0E3E3",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          />
          <hr className="border-t border-gray-200 mb-6" />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={250}
            sx={{ bgcolor: "#E0E3E3", borderRadius: "12px" }}
          />
        </div>

        <div className="flex justify-center items-center my-8">
            <div className="flex items-center m-2 gap-3">
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ bgcolor: "#E0E3E3" }}
              />
              <div>
                <Skeleton
                  variant="text"
                  width={100}
                  height={15}
                  sx={{ bgcolor: "#E0E3E3" }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={12}
                  sx={{ bgcolor: "#E0E3E3" }}
                />
              </div>
            </div>
          </div>

        {/* Comments Section Skeleton */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mx-2 mb-4 justify-start">
            <Skeleton
              variant="rectangluar"
              width={40}
              height={40}
              sx={{ bgcolor: "#E0E3E3",borderRadius: "12px" }}
            />
            <Skeleton
              variant="text"
              width={160}
              height={60}
              sx={{ bgcolor: "#E0E3E3" }}
            />
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={150}
              sx={{ bgcolor: "#E0E3E3", borderRadius: "12px" }}
            />

          </div>
        </div>
      </div>
    );
  }

  if (ArticleError) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div
          className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center"
          data-aos="fade-up"
        >
          Error loading article: {ArticleError.message}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div
          className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg text-center"
          data-aos="fade-up"
        >
          Article not found.
        </div>
      </div>
    );
  }

  // Sanitize the body HTML to prevent XSS attacks
  const sanitizedHTML = DOMPurify.sanitize(article.body);

  return (
    <div className="max-w-7xl mt-20 mx-auto px-4 py-8 bg-[#FCFBF9]">
      {/* Banner Section */}
      <div
        className="banner shadow-lg bg-gradient-to-br from-[#243635] to-[#314c4a] rounded-xl overflow-hidden transition-transform hover:shadow-xl"
        data-aos="fade-up"
      >
        <div className="p-8 flex flex-col items-center justify-center">
          {/* Title */}
          <h1 className="text-4xl font-bold text-white leading-tight text-center mb-4">
            {article.title}
          </h1>
          {/* Author Meta */}
          <div className="mt-2">
            <ArticleMeta
              author={article.author}
              createdAt={article.createdAt}
            />
          </div>
          {/* Date, Reading Time & Comments Count */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-6 text-gray-200 text-sm">
            <div className="flex items-center gap-2 bg-[#1D2E2D] px-3 py-1 rounded-full">
              <Calendar size={16} />
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1D2E2D] px-3 py-1 rounded-full">
              <Clock size={16} />
              <span>{Math.ceil(article.body.length / 1000)} min read</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1D2E2D] px-3 py-1 rounded-full">
              <MessageSquare size={16} />
              <span>{article.commentsCount || 0} comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content Section */}
      <div
        className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl"
        data-aos="fade-up"
      >
        <div className="px-8 py-8 md:px-16">
          <div className="text-2xl font-medium text-[#243635] mb-6 leading-relaxed text-center">
            {article.description}
          </div>
          <hr className="border-t border-gray-200 mb-6" />
          <div className="prose prose-lg max-w-none article-body">
            <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
          </div>
        </div>
      </div>

      {/* Article Meta */}
      <div className="flex justify-center items-center my-8" data-aos="fade-up">
        <ArticleMeta author={article.author} createdAt={article.createdAt} />
      </div>

      {/* Comments Section */}
      <div data-aos="fade-up">
        <div className="flex items-center gap-3 mx-2 mb-4 justify-start">
          <MessageSquare size={32} className="text-[#53C7C0]" />
          <h3 className="text-2xl font-semibold text-[#243635]">Comments</h3>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
          <ArticleComments article={article} />
        </div>
      </div>
    </div>
  );
}

export default Article;
