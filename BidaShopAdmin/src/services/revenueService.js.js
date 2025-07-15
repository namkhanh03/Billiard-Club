import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả đơn hàng với phân trang
export const getRevunueSumary = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const response = await axios.get(`${API_URL}/revenue/summary`, {
      params: {
        userId: userData.userId,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders", error);
    throw error;
  }
};
export const getIncomeExpenseSummary = async (startDate, endDate) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const response = await axios.get(`${API_URL}/revenue/income-expense-summary`, {
      params: {
        userId: userData.userId,
        startDate: startDate,
        endDate: endDate,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching income-expense summary:", error);
    throw error;
  }
};
// Bổ sung hàm để lấy doanh thu hàng ngày theo startDate và endDate
export const getMonthlyRevenueAndExpense = async (year, facilityId = null) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));

    const params = {
      year,
      userId: userData.userId,
    };

    if (facilityId) {
      params.facilityId = facilityId;
    }

    const response = await axios.get(`${API_URL}/revenue/monthly`, {
      params,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching monthly revenue and expense", error);
    throw error;
  }
};
export const getTop10BestSellers = async (month, year, facilityId = null) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));

    const params = {
      month,
      year,
      userId: userData.userId, // nếu cần backend filter theo user
    };

    if (facilityId) {
      params.facilityId = facilityId;
    }

    const response = await axios.get(`${API_URL}/revenue/top10-best-sellers`, {
      params,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching top 10 best sellers", error);
    throw error;
  }
};

