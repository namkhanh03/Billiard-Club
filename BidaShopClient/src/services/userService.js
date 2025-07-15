import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_END;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};
// Hàm lấy người dùng theo ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching user by ID", error);
    throw error;
  }
};
export const updateUser = async (id, userData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("phoneNumber", userData.phoneNumber);
    formData.append("fullName", userData.fullName);
    formData.append("address", userData.address);
    formData.append("role", userData.role);

    if (imageFile) {
      formData.append("avatar", imageFile); // Upload ảnh đại diện (avatar)
    }

    const response = await axios.put(`${API_URL}/users/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};
export const changePassword = async (id, currentPassword, newPassword) => {
  try {
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);

    const response = await axios.put(
      `${API_URL}/users/${id}/change-password`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error changing password", error);
    throw error;
  }
};