import axios from "axios";

const API_URL = process.env.REACT_APP_API_END;

export const login = async (username, password) => {
  try {
    // Thực hiện yêu cầu POST đến API login
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    // Trả về dữ liệu từ server (ví dụ: token, thông tin người dùng)
    return response.data;
  } catch (error) {
    console.error("Error during login", error);
    throw error; // Ném lỗi ra ngoài để có thể xử lý trong component
  }
};
export const signup = async (userInfo) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userInfo);
    return response.data;
  } catch (error) {
    console.error("Error during signup", error);
    throw error;
  }
};
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending forgot password request", error);
    throw error;
  }
};
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password", error);
    throw error;
  }
};
