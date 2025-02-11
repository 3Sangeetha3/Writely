import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useArticleQuery } from '../hooks'
import ArticleMeta from './ArticleMeta'
import DOMPurify from "dompurify";


function ArticlePreview({ article }) {
  if (!article) return null;
  // const {data} = useArticleQuery({ article })
  // console.log("article data; ", data);
  const { slug, author, createdAt, title, body, tagList} = article;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReadMoreClick = () => {
    setIsExpanded(!isExpanded);
  };
  // Sanitize the body HTML to prevent XSS attacks since using dangerouslySetInnerHTML
  const sanitizedHTML = DOMPurify.sanitize(body);

  const tempElement = document.createElement("div");
  tempElement.innerHTML = sanitizedHTML;
  const textContent = tempElement.textContent || tempElement.innerText || "";
  const previewBody = textContent.length > 100 ? `${textContent.slice(0, 100)}...` : textContent;

  return (
    <div className="article-preview" key={slug}>
      <ArticleMeta author={author} createdAt={createdAt} />

      <Link to={`/article/${slug}`} className="preview-link">
        <h1>{title}</h1>
        <p>{isExpanded ? textContent : previewBody}</p>
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