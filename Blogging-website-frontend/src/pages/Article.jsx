import React, { useEffect, useState } from 'react'
import { ArticleComments, ArticleMeta } from '../components'
import { useArticleQuery } from '../hooks'
import { useParams } from 'react-router-dom';
import axios from 'axios';
function Article() {
//   const { data } = useArticleQuery()
//   const { title, description, body } = data.article
const [article, setArticle] = useState([]);
const { slug } = useParams();
const [loading, setLoading] = useState(true);

//console.log('article',article)

const getArticleBySlug = async (slug) => {
  try {
    const VITE_API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const { data } = await axios.get(`${VITE_API_URL}/api/articles/${slug}`);
   // console.log("getArticleBySlug response", data);
    setArticle(data.article);
  } catch (error) {
    console.error("Error fetching article:", error);
  }
};

useEffect(() => {
  if (!slug) return;
  const fetchArticle = async () => {
    setLoading(true);
    await getArticleBySlug(slug);
    setLoading(false);
  };
  fetchArticle();
}, [slug]);

if (loading) {
  return <div>Loading...</div>;
}

if (!article) {
  return <div>Article not found.</div>;
}

  return (
    <div className="container article-page">
      <div className="banner" style={{ backgroundColor: "#243635", important: true, borderRadius: '25px'}}>
        <div className="container" style={{ margin: "25px" }}>
          <h1>{article?.title}</h1>
          <ArticleMeta author={article?.author} createdAt={article?.createdAt} />
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article?.description}</p>
            <p>{article?.body}</p>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <ArticleMeta author={article?.author} createdAt={article?.createdAt} />
        </div>
        <div className="row">
        {/* ArticleComments  */}
          <div className='col-xs-12 col-md-8 offeset-md-2'>
          <ArticleComments article={article} />
            {/* <ArticleComments /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article