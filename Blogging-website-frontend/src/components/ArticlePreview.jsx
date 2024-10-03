import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useArticleQuery } from '../hooks'
import ArticleMeta from './ArticleMeta'

function ArticlePreview({ article }) {
  if (!article) return null;
  // const {data} = useArticleQuery({ article })
  // console.log("article data; ", data);
  const { slug, author, createdAt, title, body, tagList} = article;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReadMoreClick = () => {
    setIsExpanded(!isExpanded);
  };
  const previewBody = body.length > 100 ? `${body.slice(0, 100)}...` : body;

  return (
    <div className="article-preview" key={slug}>
      <ArticleMeta author={author} createdAt={createdAt} />

      <Link to={`/article/${slug}`} className="preview-link">
        <h1>{title}</h1>
        <p>{isExpanded ? body : previewBody}</p>
        <span onClick={handleReadMoreClick} className="read-more">
          {isExpanded ? 'Show less' : 'Read more...'}
        </span>
        <ul className="tag-list">
          {tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  )
}

export default ArticlePreview