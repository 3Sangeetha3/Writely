import React, { useState } from "react";
import { useAuth } from "../hooks";
import { Link } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import useDeleteComment from "../hooks/useDeleteComment";
import TrashBin from "../assets/TrashBin.svg";

function ArticleComment({ comment }) {
  //console.log("comment", comment);

  const { author, body, createdAt, id } = comment;
  const { authUser } = useAuth();
  const { mutate: deleteComment, isLoading: isDeletingComment } =
    useDeleteComment();

  const canDelete = author?.username === authUser?.username;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    if (canDelete) {
      // deleteComment({ commentId: id });
      setIsModalOpen(true);
    }
  };

  const confirmDelete = () => {
    deleteComment({ commentId: id });
    setIsModalOpen(false);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

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
          {/* &nbsp; */}
          {canDelete && (
            <span>
              <FaRegTrashCan
                className="pull-xs-right w-5 h-5 text-gray-600 cursor-pointer" 
                onClick={handleDelete}
                disabled={isDeletingComment}
              />
            </span>
          )}
        </div>
      )}

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-lg z-50 p-6 max-w-sm mx-auto">
            <div className="justify-center items-center">
              <img src={TrashBin} alt="Trash Bin" className="w-3/5 mx-auto" />
            </div>
            <h2 className="text-xl text-center font-semibold mb-4">
              Confirm Delete
            </h2>
            <p className="mb-4 text-center text-gray-700">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex justify-center">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                disabled={isDeletingComment}
              >
                {isDeletingComment ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded ml-2 hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleComment;
