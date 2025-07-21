import React, { useState, useEffect } from "react";
import { useArticlesQuery } from "../hooks";
import ArticlePreview from "./ArticlePreview";
import AOS from "aos";
import "aos/dist/aos.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

function ArticleList({ tag }) {
  const { articles, isArticlesLoading, ArticlesError } = useArticlesQuery(tag);
  const [page, setPage] = useState(1);
  const articlesPerPage = 30;

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  if (isArticlesLoading) {
    return (
      <div className="space-y-6">
        {Array.from(new Array(6)).map((_, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-xl flex flex-col gap-4"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (ArticlesError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 inline-block shadow-lg">
          <p className="text-red-600 font-medium">Error loading articles. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 inline-block shadow-lg">
          <p className="text-gray-500 font-medium">No articles are here... yet.</p>
        </div>
      </div>
    );
  }

  const sortedArticles = articles.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const startIndex = (page - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = sortedArticles.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <div className="space-y-8">
        {paginatedArticles.map((article, index) => (
          <ArticlePreview key={article.slug} article={article} />
        ))}
      </div>
      <div className="flex justify-center mt-10 mb-16">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(articles.length / articlesPerPage)}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#001514",
                borderColor: "#001514",
              },
              "& .Mui-selected": {
                backgroundColor: "#001514 !important",
                color: "#fff !important",
                borderColor: "#001514 !important",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#5E6C6B",
                color: "#fff",
              },
            }}
          />
        </Stack>
      </div>
    </>
  );
}

export default ArticleList;
