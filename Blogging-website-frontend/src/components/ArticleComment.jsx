import React from "react";
import { useAuth } from "../hooks";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

function ArticleComment({ comment }) {
  //console.log("comment", comment);

  const { author, body, createdAt, id } = comment;
  const { authUser } = useAuth();

  const canDelete = author?.username === authUser?.username;

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{body} </p>
      </div>

      {id && (
        <div className="card-footer">
          <Link>{author.username}</Link>&nbsp;

            <span className="date-posted">
                {new Date(createdAt).toDateString()}
            </span>

          &nbsp;
          {canDelete && <span><FaTrash className="pull-xs-right text-primary w-[15px] h-5"/></span>}
        </div>
      )}
    </div>
  );
}

export default ArticleComment;