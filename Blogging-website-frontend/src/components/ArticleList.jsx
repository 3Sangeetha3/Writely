import React from "react";
import { isEmpty, isNil } from "lodash-es";
import { useArticlesQuery } from "../hooks";
import ArticlePreview from "./ArticlePreview";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function ArticleList() {
  const { articles } = useArticlesQuery();

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animation (in ms)
      easing: "ease-in-out", // Easing effect
      // once: true, // Whether animation happens only once
    });
  }, []);

  // console.log('ArticleList',{articles})

  if (!articles || articles.length === 0) {
    return <p className="article-preview">No articles are here... yet.</p>;
  }

  // if (isEmpty(articles)) return <p className="article-preview">No articles are here... yet.</p>

  return (
    <>
      {articles.map((article, index) => (
        <div
          key={article.slug}
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-easing="ease-in-out"
          data-aos-delay={`${index * 100}`} // Optional: adds delay to stagger animations
        >
          <ArticlePreview article={article} />
        </div>
      ))}
    </>
  );
}

export default ArticleList;
