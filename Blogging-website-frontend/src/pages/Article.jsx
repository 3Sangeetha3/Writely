import React, { useEffect, useState } from "react";
import { ArticleComments, ArticleMeta } from "../components";
import { useArticleQuery } from "../hooks";
import { useParams } from "react-router-dom";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import DOMPurify from "dompurify";

function Article() {
  //   const { data } = useArticleQuery()
  //   const { title, description, body } = data.article
  // const [article, setArticle] = useState([]);
  const { slug } = useParams();
  const { article, isArticleLoading, ArticleError } = useArticleQuery();
  // const [loading, setLoading] = useState(true);

  //console.log('article',article)

  // const getArticleBySlug = async (slug) => {
  //   try {
  //     const VITE_API_URL = import.meta.env.VITE_BACKEND_URL ;
  //     const { data } = await axios.get(`${VITE_API_URL}/api/articles/${slug}`);
  //    // console.log("getArticleBySlug response", data);
  //     setArticle(data.article);
  //   } catch (error) {
  //     console.error("Error fetching article:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (!slug) return;
  //   const fetchArticle = async () => {
  //     setLoading(true);
  //     await getArticleBySlug(slug);
  //     setLoading(false);
  //   };
  //   fetchArticle();
  // }, [slug]);

  if (isArticleLoading) {
    return (
      <div className="container article-page">
        <div
          className="banner"
          style={{ backgroundColor: "#243635", borderRadius: "25px" }}
        >
          <div className="container" style={{ margin: "25px" }}>
            {/* Title */}
            <Skeleton
              variant="text"
              width="80%"
              height={80}
              sx={{ bgcolor: "#E0E3E3", borderRadius: "8px", marginBottom: 1 }}
            />
            {/* Profile Image & Author Info */}
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
          </div>
        </div>
        <div className="container page">
          <div className="col-md-12">
            {/* Description */}
            <Skeleton
              variant="text"
              width="100%"
              height={50}
              sx={{ bgcolor: "#EOE3E3" }}
            />

            {/* body */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ bgcolor: "#EOE3E3", borderRadius: "12px" }}
            />
          </div>

          {/* Right-Aligned Divider Line */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={1}
            sx={{ bgcolor: "#E0E3E3", marginY: 2, marginLeft: "auto" }}
          />
        </div>
        <div
          className="article-actions"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          {/* Profile Image & Author Info */}
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
        </div>
        {/* comments skeleton loading */}
        <div className="row">
          <div className="col-xs-12 col-md-8 offeset-md-2">
            
              {Array.from(new Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="card"
                  style={{ marginBottom: "1rem", padding: "1rem" }}
                >
                  <div className="card-block">
                    <Skeleton variant="text" width="90%" height={20} />
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </div>
                  <div
                    className="card-footer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="text" width="20%" height={20} />
                    <Skeleton variant="text" width="15%" height={20} />
                  </div>
                </div>
              ))}
            </div>
          
        </div>
      </div>
    );
  }

  if (ArticleError) {
    return <div>Error loading article: {ArticleError.message}</div>;
  }

  if (!article) {
    return <div>Article not found.</div>;
  }
  
  // Sanitize the body HTML to prevent XSS attacks since using dangerouslySetInnerHTML
  const sanitizedHTML = DOMPurify.sanitize(article.body);

  return (
    <div className="container article-page">
      <div
        className="banner"
        style={{
          backgroundColor: "#243635",
          important: true,
          borderRadius: "25px",
        }}
      >
        <div className="container" style={{ margin: "25px" }}>
          <h1 className="p-4">{article.title}</h1>
          <ArticleMeta author={article.author} createdAt={article.createdAt} />
        </div>
      </div>
      <div className="container page">
        <div className="row article-content my-6">
          <div className="container max-w-screen-lg bg-neutral-100 p-4 rounded-lg">
            {/* <p className="px-16 pt-12 ">{article.description}</p> */}
            <div className="px-16 pt-12 py-6 text-2xl font-medium" >{ article.description }</div>
            <hr className="mx-16 mb-3 bg-black" />
            {/* <p>{article.body}</p> */}
            <div className="px-16" dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <ArticleMeta author={article.author} createdAt={article.createdAt} />
        </div>
        <div className="row">
          {/* ArticleComments  */}
          <div className="col-xs-12 col-md-8 offeset-md-2">
            <ArticleComments article={article} />
            {/* <ArticleComments /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
