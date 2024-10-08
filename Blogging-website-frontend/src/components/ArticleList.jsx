import React, { useState, useEffect } from "react";
import { useArticlesQuery } from "../hooks";
import ArticlePreview from "./ArticlePreview";
import AOS from "aos";
import "aos/dist/aos.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function ArticleList() {
  const { articles } = useArticlesQuery();
  const [page, setPage] = useState(1);
  const articlesPerPage = 5; // Customize how many articles per page

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animation (in ms)
      easing: "ease-in-out", // Easing effect
      // once: true, // Whether animation happens only once
    });
  }, []);

  // Check if articles are available
  if (!articles || articles.length === 0) {
    return <p className="article-preview">No articles are here... yet.</p>;
  }

  // Calculate the start and end index for the articles to display
  const startIndex = (page - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = articles.slice(startIndex, endIndex);

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
          data-aos-duration="1500"
          data-aos-easing="ease-in-out"
          data-aos-delay={`${index * 10}`} // Optional: adds delay to stagger animations
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
