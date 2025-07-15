import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// ✅ 1. Lấy thông tin session theo tableId
export const getTempTableSessionByTableId = async (tableId) => {
  try {
    const response = await axios.get(`${API_URL}/temp-sessions/by-table/${tableId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Lỗi khi lấy session theo tableId", error);
    throw error;
  }
};

// ✅ 2. Tạo session mới (mở bàn)
export const createTempTableSession = async (sessionData) => {
  try {
    const response = await axios.post(`${API_URL}/temp-sessions`, sessionData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Lỗi khi tạo session", error);
    throw error;
  }
};

// ✅ 3. Cập nhật session (thêm món, chỉnh giờ,...)
export const updateTempTableSession = async (id, sessionData) => {
  try {
    const response = await axios.put(`${API_URL}/temp-sessions/${id}`, sessionData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Lỗi khi cập nhật session", error);
    throw error;
  }
};
// Gọi API để cập nhật số lần in (printCount)
export const updatePrintCount = async (sessionId) => {
  try {
    await fetch(`${API_URL}/temp-sessions/${sessionId}/increment-print`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật số lần in:", error);
  }
};
