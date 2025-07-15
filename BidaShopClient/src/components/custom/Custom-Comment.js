import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./Comments.module.css";
const Comments = ({
  userId,
  comments,
  isLoggedIn,
  fetchComments,
  setIsLoggedIn,
  setError,
  toggle,
  setToggle,
}) => {
  // console.log(comments, "dfsdfsdfdsfdsfds");
  const { blogId } = useParams();


  const handleToggle = () => {
    if (typeof setToggle === "function") {
      setToggle((prev) => !prev);
    } else {
      console.error("setToggle is not defined or is not a function");
    }
  };


  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const replyRef = useRef(null);

  const handleClickOutside = (event) => {
    if (replyRef.current && !replyRef.current.contains(event.target)) {
      setReplyingCommentId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteClick = async (commentId) => {
    console.log("Delete Clicked for Comment ID:", commentId);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admins/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      if (err.response && err.response.status === 401) {
        // toast.error("Session expired. Please log in again.");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError(err.message);
      }
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // toast.error("You need to be logged in to comment.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/admins/blogs/${blogId}/comments`,
        {
          content: newComment,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error submitting comment:", err);
      if (err.response && err.response.status === 401) {
        // toast.error("Session expired. Please log in again.");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError(err.message);
      }
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingCommentId(commentId);
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("You need to be logged in to reply.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/admins/blogs/${blogId}/comments`,
        {
          content: replyContent,
          userId: userId,
          parentCommentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReplyingCommentId(null);
      setReplyContent("");
      fetchComments();
    } catch (err) {
      console.error("Error submitting reply:", err);
      if (err.response && err.response.status === 401) {
        // toast.error("Session expired. Please log in again.");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError(err.message);
      }
    }
  };

  const handleEditClick = (comment) => {
    console.log("Edit Clicked for Comment ID:", comment._id);
    setEditingCommentId(comment._id);
    setEditedComment(comment.content);
  };

  const handleEditChange = (e) => {
    setEditedComment(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/admins/comments/${editingCommentId}`,
        {
          content: editedComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingCommentId(null);
      setEditedComment("");
      fetchComments();
      // toast.success("Comment edited successfully!");
    } catch (err) {
      console.error("Error editing comment:", err);
      if (err.response && err.response.status === 401) {
        // toast.error("Session expired. Please log in again.");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError(err.message);
      }
    }
  };

  return (<div>
    {toggle && (
      <div>
        <div className={`max-w-full mx-auto p-4 bg-gray-800 text-white rounded-lg ${styles.commentBox}`}>
          <h1 className="text-2xl font-bold mb-4">Comments</h1>

          {comments.map((comment) => {
            return (
              <ul key={comment._id} className="space-y-4">
                <li className="flex flex-col md:flex-row space-x-0 md:space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                      src={comment.userId && comment.userId.avatar ? comment.userId.avatar : "https://default-avatar-url.jpg"}
                      alt="User Avatar"
                    />
                  </div>
                  <div className={`flex-1 p-3 md:p-4 rounded-lg ${styles.comment}`}>
                    <div className="flex justify-between items-center">
                      <h6 className="text-sm md:text-base font-bold">
                        {comment.userId ? comment.userId.name : "Unknown User"}
                      </h6>
                      <span className="text-xs md:text-sm text-gray-400">{new Date(comment.date).toLocaleString()}</span>
                    </div>
                    {editingCommentId === comment._id ? (
                      <form onSubmit={handleEditSubmit} className="flex items-center">
                        <input
                          type="text"
                          value={editedComment}
                          onChange={handleEditChange}
                          className="w-full p-2 bg-gray-800 text-white rounded-lg"
                        />
                        <button type="submit" className="text-white-500 cursor-pointer ml-2">
                          <SendIcon />
                        </button>
                        <CloseIcon onClick={() => setEditingCommentId(null)} className="text-red-500 cursor-pointer ml-2" />
                      </form>
                    ) : (
                      <p className="mt-2 text-sm md:text-base flex justify-between items-center">
                        {comment.content}
                        <div className="flex space-x-2 text-xs md:text-sm text-gray-400">
                          <ReplyIcon onClick={() => setReplyingCommentId(comment._id)} className="cursor-pointer" />
                          {comment.userId && comment.userId._id === userId && (
                            <>
                              <EditIcon onClick={() => handleEditClick(comment)} className="cursor-pointer" />
                              <DeleteIcon onClick={() => handleDeleteClick(comment._id)} className="cursor-pointer" />
                            </>
                          )}
                        </div>
                      </p>
                    )}
                  </div>
                </li>
                {replyingCommentId === comment._id && (
                  <li className="flex flex-col md:flex-row space-x-0 md:space-x-4 ml-0 md:ml-10" ref={replyRef}>
                    <div className={`flex-1 p-3 md:p-4 rounded-lg flex items-center ${styles.replyBox}`}>
                      <input
                        type="text"
                        value={replyContent}
                        onChange={handleReplyChange}
                        placeholder="Write your reply here..."
                        className={`w-full p-2 bg-gray-800 text-white rounded-lg ${styles.replyBoxContent}`}
                      />
                      <SendIcon
                        onClick={(e) => handleReplySubmit(e, comment._id)}
                        className="text-blue-500 cursor-pointer ml-2"
                      />
                    </div>
                  </li>
                )}
                {comment.replies && comment.replies.length > 0 && (
                  <li className="ml-0 md:ml-10">
                    <ul className="space-y-4">
                      {comment.replies.map((replies) => {
                        return (
                          <li key={replies._id} className="flex flex-col md:flex-row space-x-0 md:space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                                src={replies.userId.avatar}
                                alt="User Avatar"
                              />
                            </div>
                            <div className={` ${styles.comment} flex-1 p-3 md:p-4 rounded-lg`}>
                              <div className="flex justify-between items-center">
                                <h6 className="text-sm md:text-base font-bold">{replies.userId.name}</h6>
                                <span className="text-xs md:text-sm text-gray-400">{new Date(replies.date).toLocaleString()}</span>
                              </div>
                              {editingCommentId === replies._id ? (
                                <form onSubmit={handleEditSubmit} className="flex items-center">
                                  <input
                                    type="text"
                                    value={editedComment}
                                    onChange={handleEditChange}
                                    className="w-full p-2 bg-gray-800 text-white rounded-lg"
                                  />
                                  <button type="submit" className="text-white-500 cursor-pointer ml-2">
                                    <SendIcon />
                                  </button>
                                  <CloseIcon onClick={() => setEditingCommentId(null)} className="text-red-500 cursor-pointer ml-2" />
                                </form>
                              ) : (
                                <p className="mt-2 text-sm md:text-base flex justify-between items-center">
                                  {replies.content}
                                  <div className="flex space-x-2 text-xs md:text-sm text-gray-400">
                                    {replies.userId && replies.userId._id === userId && (
                                      <>
                                        <EditIcon onClick={() => handleEditClick(replies)} className="cursor-pointer" />
                                        <DeleteIcon onClick={() => handleDeleteClick(replies._id)} className="cursor-pointer" />
                                      </>
                                    )}
                                  </div>
                                </p>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                )}
              </ul>
            );
          })}
          {isLoggedIn ? (
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
                className="w-full p-2 bg-gray-800 text-white rounded-lg"
              />
              <SendIcon
                onClick={handleCommentSubmit}
                className="text-blue-500 cursor-pointer ml-2"
              />
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-4">Please log in to add a comment.</p>
          )}
          <ToastContainer />
        </div>
      </div>
    )}
  </div>
  );
};

export default Comments;
