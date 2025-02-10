import React from 'react'
import { useArticleCommentsQuery, useAuth } from '../hooks'
import { Link } from 'react-router-dom';
import ArticleComment from './ArticleComment';
import ArticleCommentForm from './ArticleCommentForm';
import Skeleton from "@mui/material/Skeleton";

function ArticleComments() {

    const {isAuth} = useAuth();

    const {
        isArticleCommentsLoading,
        articleComments,
        articleCommentsError,
    } = useArticleCommentsQuery();

      // console.log("articleComments: ", articleComments);

      // comments skeleton loading
      if (isArticleCommentsLoading) {
        return (
          <div className='card'>
            <div className="card-block">
              {Array.from(new Array(3)).map((_, index) => (
                <div key={index} className="card" style={{ marginBottom: "1rem", padding: "1rem" }}>
                  {/* Simulate comment text */}
                  <div className="card-block">
                    <Skeleton variant="text" width="90%" height={20} />
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </div>
                  {/* Simulate footer (author info and date) */}
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
        );
      }
      


    if(!isAuth){
        return (
            <p>
                <Link to='/login' >Sign in</Link>or
                <Link to='/register' >Sign up</Link> to add comment on this article

            </p>
        )
    }
  return (
    <div>
        <ArticleCommentForm />
        {articleComments?.comments?.map((comment) => (
            <ArticleComment key={comment.id} comment={comment} />
        ))}
    </div>
  )
}

export default ArticleComments 