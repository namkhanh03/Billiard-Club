import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_END;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả đơn hàng với phân trang
export const getAllOrders = async (
  page = 1,
  limit = 10,
  keyword,
  customerId = "",

) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const response = await axios.get(`${API_URL}/orders/orders-by-customer`, {
      params: {
        keyword,
        page,
        limit,
        customerId: customerId,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });

    return response.data.payload;
  } catch (error) {
    console.error("Error fetching orders", error);
    throw error;
  }
};

