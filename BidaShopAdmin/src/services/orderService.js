import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả đơn hàng với phân trang
export const getAllOrders = async (
  page = 1,
  limit = 10,
  orderId = "",
  customerName = "",
  phone = "",
  facilityId = "",
  customerId = ""
) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const response = await axios.get(`${API_URL}/orders`, {
      params: {
        orderId,
        customerName,
        phone,
        page,
        limit,
        facilityId,
        customerId,
        staffId: userData.userId,
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


// Hàm cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/status`,
      null,
      {
        params: { status },
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status", error);
    throw error;
  }
};
export const createOrder = async (sessionId, paymentMethod, requestTotalAmount, playDuration, customerPhone) => {
  try {
    // Gửi sessionId và paymentMethod trong body thay vì query params
    const userData = JSON.parse(localStorage.getItem("user"));
    const response = await axios.post(
      `${API_URL}/orders/`,
      {
        sessionId,
        paymentMethod,
        requestTotalAmount,
        playDuration,
        staffId: userData.userId,
        customerPhone,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data.payload;
  } catch (error) {
    console.error("Error creating order", error);
    throw error;
  }
};
export const getCassoBankTransactions = async ({
  page = 1,
  pageSize = 10,
  sort = "ASC",
}) => {
  try {
    const response = await axios.get(
      `https://oauth.casso.vn/v2/transactions`,
      {
        params: {
          page,
          pageSize,
          sort,
        },
        headers: {
          Authorization: `Apikey ${process.env.REACT_APP_CASSO_API_KEY}`, // hoặc Bearer nếu dùng access_token
        },
      }
    );

    return response.data.data.records;
  } catch (error) {
    console.error("Error fetching Casso transactions:", error);
    throw error;
  }
};
export const checkPayment = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/check-payment`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking payment:", error);
    throw error;
  }
};