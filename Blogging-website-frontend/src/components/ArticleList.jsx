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
  const articlesPerPage = 10; // Customize how many articles per page

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animation (in ms)
      easing: "ease-in-out", // Easing effect
      // once: true, // Whether animation happens only once
    });
  }, []);

  if (isArticlesLoading) {
    return (
      <div className="article-list">
        {Array.from(new Array(articlesPerPage)).map((_, index) => (
          <div
            key={index}
            style={{ marginBottom: "1.5rem" }}
            data-aos="fade-up"
          >
            {/* Skeleton loading UI */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

            <Skeleton
              variant="text"
              width="80%"
              height={30}
              sx={{ bgcolor: "#E0E3E3", marginTop: 1 }}
            />

            <Skeleton
              variant="text"
              width="50%"
              height={20}
              sx={{ bgcolor: "#E0E3E3" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Skeleton
                variant="text"
                width={100}
                height={15}
                sx={{ bgcolor: "#E0E3E3" }}
              />

              <div style={{ display: "flex", gap: "8px" }}>
                <Skeleton
                  variant="rounded"
                  width={40}
                  height={20}
                  sx={{ bgcolor: "#E0E3E3" }}
                />
                <Skeleton
                  variant="rounded"
                  width={50}
                  height={20}
                  sx={{ bgcolor: "#E0E3E3" }}
                />
              </div>
            </div>

            <Skeleton
              variant="rectangular"
              width="100%"
              height={1}
              sx={{ bgcolor: "#E0E3E3", marginY: 2, marginLeft: "auto" }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Display error message if there's an error
  if (ArticlesError) {
    return (
      <p className="article-preview">
        Error loading articles. Please try again later.
      </p>
    );
  }

  // Check if articles are available
  if (!articles || articles.length === 0) {
    return <p className="article-preview">No articles are here... yet.</p>;
  }

  const sortedArticles = articles?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Calculate the start and end index for the articles to display
  const startIndex = (page - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = sortedArticles.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      {paginatedArticles.map((article, index) => (
        <div
          key={article.slug}
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-easing="ease-in-out"
        >
          <ArticlePreview article={article} />
        </div>
      ))}

      <Stack
        spacing={2}
        sx={{
          alignItems: "center", // Center pagination horizontally
          mt: 4,
          mb: 4,
        }}
      >
        <Pagination
          count={Math.ceil(articles.length / articlesPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#001514", // Unselected page color
              borderColor: "#001514", // Border color for unselected outlined items
            },
            "& .Mui-selected": {
              backgroundColor: "#001514 !important", // Ensure selected page has this background color
              color: "#fff !important", // Ensure text color for selected page
              borderColor: "#001514 !important", // Ensure border color for selected page
            },
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "#5E6C6B", // Hover background color
              color: "#fff", // Hover text color
            },
          }}
        />
      </Stack>
    </>
  );
}

export default ArticleList;
