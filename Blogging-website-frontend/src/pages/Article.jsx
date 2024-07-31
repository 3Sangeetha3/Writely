import React, { useEffect, useState } from 'react'
import { ArticleComments, ArticleMeta } from '../components'
import { useArticleQuery } from '../hooks'
import { useParams } from 'react-router-dom';
import axios from 'axios';
function Article() {
//   const { data } = useArticleQuery()
//   const { title, description, body } = data.article
const [article, setArticle] = useState([]);
const { slug } = useParams()

//console.log('article',article)

const getArticleBySlug = async (slug) => {
  try {
    const { data } = await axios.get(`https://blogging-website-5l8x.onrender.com/api/articles/${slug}`);
    console.log("getArticleBySlug response", data);
    setArticle(data.article);
  } catch (error) {
    setInterval(2000);
    console.error("Error fetching article:", error);
  }
};

useEffect(() => {
  if (!slug) return;
  getArticleBySlug(slug);
}, [slug]);

if (!article) {
  return <div>Loading...</div>;
}

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
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