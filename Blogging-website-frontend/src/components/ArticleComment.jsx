import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import { Link } from "react-router-dom";
import { Trash2, Calendar } from "lucide-react";
import useDeleteComment from "../hooks/useDeleteComment";
import TrashBin from "../assets/TrashBin.svg";
import AOS from "aos";
import "aos/dist/aos.css";

function ArticleComment({ comment }) {
  const { author, body, createdAt, id } = comment;
  const { authUser } = useAuth();
  const { mutate: deleteComment, isLoading: isDeletingComment } = useDeleteComment();
  const canDelete = author?.username === authUser?.username;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const handleDelete = () => {
    if (canDelete) {
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
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="mb-3">
        <p className="text-gray-700 leading-relaxed">{body}</p>
      </div>
      {id && (
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#53C7C0] bg-opacity-20 flex items-center justify-center text-[#243635] font-bold shadow-sm">
              {author.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <Link 
                to={`/profile/${author.username}`} 
                className="font-medium text-[#243635] hover:text-[#53C7C0] transition-colors"
              >
                {author.username}
              </Link>
              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                <Calendar size={12} className="mr-1" />
                <span>{new Date(createdAt).toDateString()}</span>
              </div>
            </div>
          </div>
          
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeletingComment}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Delete comment"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
      
      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={cancelDelete}
          ></div>
          
          {/* Modal content */}
          <div 
            className="bg-white rounded-xl shadow-xl z-50 p-6 max-w-sm mx-auto transform transition-all" 
            data-aos="zoom-in"
          >
            <div className="flex justify-center items-center mb-4">
              <img src={TrashBin} alt="Trash Bin" className="w-2/5 mx-auto" />
            </div>
            <h2 className="text-xl text-center font-semibold mb-3 text-[#FF4C4C]">
              Delete Comment
            </h2>
            <p className="mb-5 text-center text-gray-700">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={cancelDelete}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeletingComment}
                className="px-5 py-2 bg-[#FF4C4C] text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none flex items-center gap-2"
              >
                {isDeletingComment ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleComment;