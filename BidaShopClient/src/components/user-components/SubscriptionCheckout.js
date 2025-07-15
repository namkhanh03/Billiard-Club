import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SubscriptionCheckout.css";

const SubscriptionCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  // Tính toán giá sau khi giảm giá
  const discount = course?.discount || 0;
  const discountedPrice = course?.price - (course?.price * discount) / 100;

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Bạn cần đăng nhập trước khi thanh toán.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/payment",
        {
          courseId: course._id,
          price: discountedPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        toast.error("Khởi tạo thanh toán thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      toast.error("Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  if (!course) {
    return <div className="not-found">Không tìm thấy khóa học</div>;
  }

  return (
    <div className="subscription-page">
      <ToastContainer />

      <div className="step">
        <h1 className="header-title">Thông tin khóa học</h1>

        {/* Course Card */}
        <div className="course-card-checkout">
          <div className="course-images-slider">
            {course?.image && course.image.length > 0 ? (
              <ImageSlider images={course.image} />
            ) : (
              <img
                src="https://via.placeholder.com/400"
                alt="Không có ảnh khóa học"
                className="course-placeholder-image"
              />
            )}
          </div>

          <div className="course-info-checkout">
            <h2 className="course-name-checkout">
              {course?.name || "Chưa có tên"}
            </h2>

            <p className="course-description-checkout">
              <div
                dangerouslySetInnerHTML={{
                  __html: course?.description || "",
                }}
              />
            </p>

            <p>
              <strong>Số buổi tập:</strong> {course?.slotNumber || "Chưa có thông tin"}
            </p>
            <p>
              <strong>Giá:</strong>{" "}
              {discount > 0 ? (
                <>
                  <span className="original-price">
                    {course?.price?.toLocaleString()} VNĐ
                  </span>
                  <br />
                  <span className="discounted-price">
                    {discountedPrice?.toLocaleString()} VNĐ
                  </span>
                </>
              ) : (
                <span>{course?.price?.toLocaleString()} VNĐ</span>
              )}
            </p>
            <p>
              <strong>Huấn luyện viên:</strong>{" "}
              {course?.coachId?.accountId?.name ||
                course?.coachId?.name ||
                "Chưa có huấn luyện viên"}
            </p>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <button className="next-btn" onClick={handlePayment}>
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  );
};

const ImageSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="image-slider">
      <button className="slider-btn prev" onClick={goToPrevImage}>
        &lt;
      </button>
      <img
        src={images[currentImageIndex]}
        alt={`Ảnh ${currentImageIndex + 1}`}
        className="slider-image"
      />
      <button className="slider-btn next" onClick={goToNextImage}>
        &gt;
      </button>
    </div>
  );
};

export default SubscriptionCheckout;
