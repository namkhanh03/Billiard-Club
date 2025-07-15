import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faEdit,
  faTrashAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./FeedbackCourse.module.css";
import { WarningOutlined } from '@ant-design/icons';

const FeedbackCourse = ({ courseId, purchasedSubscriptions }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  // const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [replyFeedbackId, setReplyFeedbackId] = useState(null);
  const [rating, setRating] = useState(0);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [ratings, setRatings] = useState({ totalVotes: 0, averageRating: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackImages, setFeedbackImages] = useState([]);
  const [feedbackVideos, setFeedbackVideos] = useState([]);
  const [replyImages, setReplyImages] = useState([]);
  const [replyVideos, setReplyVideos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [feedbackImagesPreview, setFeedbackImagesPreview] = useState([]);
  const [feedbackVideosPreview, setFeedbackVideosPreview] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // setIsLoggedIn(true); // Người dùng đã đăng nhập
      fetchFeedbacks(); // Gọi API để lấy bình luận
    } else {
      // setIsLoggedIn(false);
    }
    fetchFeedbacks();
    fetchCourseRatings();
  }, [courseId]);

  // API: Lấy danh sách feedback
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/courses/${courseId}/feedbacks`
      );
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to fetch feedbacks.");
    }
  };

  // API: Lấy đánh giá trung bình
  const fetchCourseRatings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/courses/${courseId}/rating`
      );
      setRatings(response.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setError("Failed to fetch ratings.");
    }
  };
  // API: Thêm feedback hoặc trả lời
  const addFeedback = async () => {
    if (!newFeedback.trim() || rating === 0) {
      setError("Bạn phải vote sao và nhập bình luận trước khi gửi.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("content", newFeedback);
      formData.append("rating", rating || null);
      formData.append("parentFeedbackId", replyFeedbackId || "");

      // Append images and videos to form data
      Array.from(feedbackImages).forEach((image) =>
        formData.append("image", image)
      );
      Array.from(feedbackVideos).forEach((video) =>
        formData.append("video", video)
      );

      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/users/courses/${courseId}/feedbacks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setNewFeedback("");
      setRating(0);
      setReplyFeedbackId("");
      setFeedbackImages([]); // Reset file inputs
      setFeedbackVideos([]); // Reset file inputs
      setFeedbackImagesPreview([]); // Reset preview
      setFeedbackVideosPreview([]); // Reset preview
      setSuccessMessage("Đăng thành công!");
      fetchFeedbacks();
      fetchCourseRatings();
    } catch (error) {
      console.error("Error adding feedback:", error);
      setError(error.response?.data?.message || "Failed to add feedback.");
    } finally {
      setLoading(false);
    }
  };

  // API: Cập nhật feedback
  const updateFeedback = async (feedbackId) => {
    if (!newFeedback.trim()) {
      setError("Content is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("content", newFeedback);
      formData.append("rating", rating);

      // Append images and videos if they exist
      Array.from(editingFeedback.images || []).forEach((image) => {
        formData.append("image", image);
      });
      Array.from(editingFeedback.videos || []).forEach((video) => {
        formData.append("video", video);
      });

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/courses/${courseId}/feedbacks/${feedbackId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEditingFeedback(null);
      fetchFeedbacks();
      fetchCourseRatings();
    } catch (error) {
      console.error("Error updating feedback:", error);
      setError("Failed to update feedback.");
    } finally {
      setLoading(false);
    }
  };

  // API: Xóa feedback
  const deleteFeedback = async (feedbackId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/users/courses/${courseId}/feedbacks/${feedbackId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchFeedbacks(); // Làm mới danh sách feedback sau khi xóa
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setError("Failed to delete feedback.");
    }
  };

  const renderStars = (averageRating) => {
    const fullStars = Math.floor(averageRating); // Số ngôi sao đầy
    const halfStar = averageRating % 1 !== 0; // Có ngôi sao nửa không?
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Số ngôi sao rỗng

    return (
      <>
        {Array(fullStars)
          .fill()
          .map((_, index) => (
            <span key={`full-${index}`} className="star full-star">
              ★
            </span>
          ))}
        {halfStar && (
          <span className="star half-star">
            ☆{/* Ngôi sao nửa có thể thay đổi biểu tượng */}
          </span>
        )}
        {Array(emptyStars)
          .fill()
          .map((_, index) => (
            <span key={`empty-${index}`} className="star empty-star">
              ☆
            </span>
          ))}
      </>
    );
  };

  // Hủy trả lời
  const cancelReply = () => {
    setReplyFeedbackId(null);
    setReplyContent("");
  };

  // Hủy chỉnh sửa feedback
  const cancelFeedbackEditing = () => {
    setEditingFeedback(null);
  };

  // Hủy chỉnh sửa trả lời
  const cancelReplyEditing = () => {
    setEditingReply(null);
  };

  // Kiểm tra quyền truy cập
  const hasPurchasedCourse = purchasedSubscriptions.some(
    (sub) => sub.courseId === courseId
  );

  // const canRate = subscriptionStatus === "finish";

  const calculateStarPercentage = (star) => {
    if (!ratings.totalVotes) return 0;
    const starCount = feedbacks.filter(
      (f) => Math.round(f.rating) === star
    ).length;
    return Math.round((starCount / ratings.totalVotes) * 100);
  };

  // Thêm hàm xử lý click vào ảnh
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFeedbackImages(files);
    setFeedbackImagesPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setFeedbackVideos(files);
    setFeedbackVideosPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handlePreviewClick = (url) => {
    setSelectedImage(url);
  };

  const handleEditClick = (feedback) => {
    setEditingFeedback(feedback);
    setNewFeedback(feedback.content);
    setRating(feedback.rating);
  };

  const handleFeedbackClick = () => {
    if (
      feedbacks.some((fb) => fb.userId._id === localStorage.getItem("userId"))
    ) {
      setError("Bạn đã đăng feedback cho khóa học này rồi.");
    }
  };

  // Kiểm tra xem người dùng đã đăng feedback chưa
  const hasUserFeedback = feedbacks.some(
    (fb) => fb.userId._id === localStorage.getItem("userId")
  );

  const handleStarClick = (star) => {
    setRating(star);
  };

  // if (!isLoggedIn) {
  //   return <p>Bạn cần đăng nhập để xem đánh giá.</p>;
  // }

  return (
    <div className={styles.feedbackContainer}>
      {/* Phần rating tổng quan */}
      <div className={styles.ratingOverview}>
        <div className={styles.ratingHeader}>
          <div className={styles.ratingStars}>
            {renderStars(ratings.averageRating)}
            <p className={styles.ratingScore}>
              {ratings.averageRating.toFixed(2)}
              <span className={styles.ratingMax}> trên 5</span>
            </p>
          </div>
          <p className={styles.totalRatings}>{ratings.totalVotes} đánh giá</p>
        </div>

        <div className={styles.ratingBars}>
          {[5, 4, 3, 2, 1].map((star) => {
            const percentage = calculateStarPercentage(star);
            return (
              <div key={star} className={styles.ratingBar}>
                <span className={styles.starLabel}>{star} sao</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className={styles.percentage}>{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phần form thêm feedback */}
      {hasPurchasedCourse && !hasUserFeedback && (
        <div className={styles.addFeedbackSection}>
          <h3 className={styles.sectionTitle}>
            {replyFeedbackId ? "Trả lời đánh giá" : "Viết đánh giá của bạn"}
          </h3>
          <div className={styles.feedbackForm}>
            {!replyFeedbackId && (
              <div className={styles.ratingSelect}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`${styles.ratingStar} ${rating >= star ? styles.active : ""
                      }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              onClick={handleFeedbackClick}
              placeholder={
                replyFeedbackId
                  ? "Viết câu trả lời của bạn..."
                  : "Chia sẻ trải nghiệm học tập của bạn..."
              }
              className={styles.feedbackInput}
            />
            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}
            {error && <p className="errorMessage">{error}</p>}
            <div className={styles.mediaUpload}>
              <div className={styles.uploadButton}>
                <i className="fas fa-image"></i>
                <span>Thêm ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </div>
              <div className={styles.uploadButton}>
                <i className="fas fa-video"></i>
                <span>Thêm video</span>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoChange}
                  className={styles.fileInput}
                />
              </div>
            </div>
            <div className={styles.mediaPreview}>
              {feedbackImagesPreview.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Preview"
                  className={styles.mediaItem}
                  onClick={() => handlePreviewClick(image)}
                />
              ))}
              {feedbackVideosPreview.map((video, index) => (
                <video
                  key={index}
                  src={video}
                  controls
                  className={styles.mediaItem}
                  onClick={() => handlePreviewClick(video)}
                />
              ))}
            </div>
            {loading && (
              <p className={styles.loadingMessage}>Đang tải lên...</p>
            )}
            <div className={styles.formActions}>
              {replyFeedbackId && (
                <button onClick={cancelReply} className={styles.cancelButton}>
                  Hủy
                </button>
              )}
              <button onClick={addFeedback} className={styles.submitButton}>
                {replyFeedbackId ? "Trả lời" : "Đăng đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách feedback */}
      <div className={styles.feedbackList}>
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className={styles.feedbackItem}>
            <div className={styles.userInfo}>
              <img
                src={feedback.userId.avatar || "/default-avatar.png"}
                alt={`Avatar của ${feedback.userId.name}`}
                className={styles.userAvatar}
              />
              <div className={styles.userMeta}>
                <h4 className={styles.userName}>{feedback.userId.name}</h4>
                <div className={styles.feedbackMeta}>
                  <div className={styles.userRating}>
                    {Array(5)
                      .fill()
                      .map((_, index) => (
                        <span
                          key={index}
                          className={`${styles.star} ${index < feedback.rating ? styles.filled : ""
                            }`}
                        >
                          ★
                        </span>
                      ))}
                  </div>
                  <span className={styles.feedbackDate}>
                    {new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.feedbackContent}>
              {editingFeedback && editingFeedback._id === feedback._id ? (
                <div>
                  <div className={styles.ratingSelect}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className={`${styles.ratingStar} ${rating >= star ? styles.active : ""
                          }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    className={styles.feedbackInput}
                  />
                  <div className={styles.buttonGroup}>
                    <button
                      onClick={() => updateFeedback(feedback._id)}
                      className={styles.actionButton}
                    >
                      <i className="fas fa-save"></i> Lưu
                    </button>
                    <button
                      onClick={cancelFeedbackEditing}
                      className={styles.actionButton}
                    >
                      <i className="fas fa-times"></i> Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>{feedback.content}</p>
                  <div className={styles.feedbackActions}>
                    {feedback.userId._id === localStorage.getItem("userId") && (
                      <>
                        <button
                          onClick={() => handleEditClick(feedback)}
                          className={styles.actionButton}
                        >
                          <i className="fas fa-edit"></i> Sửa
                        </button>
                        <button
                          onClick={() => deleteFeedback(feedback._id)}
                          className={styles.actionButton}
                        >
                          <i className="fas fa-trash-alt"></i> Xóa
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
              {feedback.imageUrls?.length > 0 && (
                <div className={styles.mediaGrid}>
                  {feedback.imageUrls?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Feedback"
                      className={styles.mediaItem}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                  {feedback.videos?.map((video, index) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className={styles.mediaItem}
                      onClick={() => handleImageClick(video)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Thêm modal hiển thị ảnh full size */}
      {selectedImage && (
        <div
          className={styles.imageModal}
          onClick={() => setSelectedImage(null)}
        >
          <div className={styles.modalContent}>
            <img
              src={selectedImage}
              alt="Full size"
              className={styles.fullSizeImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackCourse;
