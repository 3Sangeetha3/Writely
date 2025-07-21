import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleMeta from './ArticleMeta';
import DOMPurify from "dompurify";
import { 
  ArrowRight, 
  Hash, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle,
  Bookmark,
  Share2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import axios from 'axios';

function ArticlePreview({ article }) {
  if (!article) return null;
  const { slug, author, createdAt, title, body, tagList, favoritesCount = 0} = article;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(null);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsCommentsLoading(true);
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/articles/${slug}/comments`)
      .then(res => {
        if (isMounted) {
          setCommentsCount(res.data?.comments?.length || 0);
          setIsCommentsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCommentsCount(0);
          setIsCommentsLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [slug]);

  const handleReadMoreClick = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  const sanitizedHTML = DOMPurify.sanitize(body);
  const tempElement = document.createElement("div");
  tempElement.innerHTML = sanitizedHTML;
  const textContent = tempElement.textContent || tempElement.innerText || "";
  const previewBody = textContent.length > 200 ? `${textContent.slice(0, 200)}...` : textContent;

  // Calculate read time (assuming 200 words per minute)
  const wordCount = textContent.split(' ').length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <article className="group relative bg-white/80 backdrop-blur-2xl rounded-3xl border-2 border-[#53C7C0]/30 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-[#53C7C0]/10 transition-all duration-500 overflow-hidden hover:-translate-y-1">
      {/* Gradient accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#53C7C0]/0 via-[#53C7C0]/0 to-[#53C7C0]/0 group-hover:from-[#53C7C0]/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500"></div>
      
      <Link to={`/article/${slug}`} className="block relative py-4 no-underline hover:no-underline focus:no-underline">
        <div className="flex flex-col gap-2 h-full px-10 py-6">
          {/* Author and Meta Info */}
          <div className="flex items-center justify-between">
            <ArticleMeta author={author} createdAt={createdAt} />
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                {isCommentsLoading ? (
                  <span className="animate-pulse text-gray-400">...</span>
                ) : (
                  <span>{commentsCount} comments</span>
                )}
              </div>
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#243635] mb-1 group-hover:text-[#53C7C0] transition-colors duration-300 no-underline hover:no-underline">
            {title}
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-1 line-clamp-3">
            {isExpanded ? textContent : previewBody}
          </p>
          <button
            onClick={handleReadMoreClick}
            className="text-[#53C7C0] font-semibold text-xs mb-1 focus:outline-none hover:no-underline"
          >
            {isExpanded ? 'Show less' : 'Read more...'}
          </button>
          {/* Tags at the end, right-aligned on desktop, left on mobile */}
          <div className="flex flex-wrap gap-1 mt-2 justify-end md:justify-end">
            {tagList.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-[#53C7C0]/10 border-2 border-[#53C7C0] rounded-full text-[#53C7C0] text-xs font-semibold shadow-sm hover:bg-[#53C7C0] hover:text-white transition-all duration-300 cursor-pointer no-underline hover:no-underline"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* Trending indicator for popular articles */}
      {favoritesCount > 50 && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
          <TrendingUp className="w-3 h-3" />
          <span>Trending</span>
        </div>
      )}

      {/* New article indicator */}
      {new Date(createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gradient-to-r from-[#53C7C0] to-[#243635] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
          <Sparkles className="w-3 h-3" />
          <span>New</span>
        </div>
      )}
    </article>
  );
}

export default ArticlePreview;
