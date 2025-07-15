import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getUserById, updateUser } from "../../services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./profile-components/UserProfile.module.css";
import { WarningOutlined } from '@ant-design/icons';
import ChangePasswordForm from "./profile-components/ChangePasswordForm";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState("https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg");
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getUserById(userId);
        setProfile(data);
        setFormData({
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
        });
        setAvatar(data.avatar || avatar);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim().length < 2 || !/^[a-zA-ZÀ-ỳ\s]+$/.test(formData.fullName)) {
      newErrors.fullName = "Họ tên không hợp lệ";
    }
    const phoneRegex = /^(0|\+84)([3|5|7|8|9])([0-9]{8})$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = "Địa chỉ không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profile) return;
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateUser(profile.userId, { ...formData, role: profile.role }, selectedImage);
      toast.success("Cập nhật thông tin thành công! Vui lòng đăng nhập lại để làm mới thông tin");
    } catch (error) {
      toast.error("Cập nhật thông tin không thành công. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) return toast.error("Ảnh vượt quá 5MB");
      if (!file.type.match("image.*")) return toast.error("Chỉ chọn file ảnh");
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <div id="preloder"><div className="loader"></div></div>;
  if (error || !profile) return (
    <div className={styles.errorContainer}>
      <WarningOutlined className={styles.errorIcon} />
      <p className={styles.errorMessage}>Không thể tải thông tin người dùng</p>
      <p className={styles.errorDetail}>Vui lòng kiểm tra kết nối mạng và thử lại</p>
    </div>
  );

  return (
    <div className={styles.mainContent}>
      <ToastContainer />
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <div className="text-center">
                  <div
                    className={styles.avatarContainer}
                  >
                    <img
                      src={imagePreview || avatar}
                      alt="Avatar"
                      className={`rounded-circle mb-3 ${styles.profileImage}`}
                    />

                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <h5>{formData.fullName}</h5>
                </div>
              </div>
            </div>

          </div>
          {/* <ChangePasswordForm userId={profile.userId} /> */}
          <div className="col-lg-8">
            <ChangePasswordForm userId={profile.userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
