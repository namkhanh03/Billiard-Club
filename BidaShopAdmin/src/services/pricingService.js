import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
    const token = localStorage.getItem("auth_token");
    return token ? token : null;
};

// 🏓 **Lấy danh sách bảng giá (có phân trang, tìm kiếm theo description)**
export const getAllPricings = async (page = 1, limit = 10, description = "") => {
    try {
        const params = { page, limit, description };
        const response = await axios.get(`${API_URL}/pricings`, {
            params,
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bảng giá", error);
        throw error;
    }
};
// 🏓 **Lấy thông tin bảng giá theo ID**
export const getPricingById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/pricings/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
            },
        });
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi lấy bảng giá theo ID", error);
        throw error;
    }
};
// 🏓 **Tạo bảng giá mới**
export const createPricing = async (pricingData) => {
    try {
        const response = await axios.post(
            `${API_URL}/pricings`,
            pricingData, // Truyền object trực tiếp
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Thêm token vào header
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo bảng giá", error);
        throw error;
    }
};
// 🏓 **Cập nhật bảng giá**
export const updatePricing = async (id, pricingData) => {
    try {
        const response = await axios.put(
            `${API_URL}/pricings/${id}`,
            pricingData, // Truyền object trực tiếp (không cần id trong body)
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Thêm token vào header
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật bảng giá", error);
        throw error;
    }
};
// 🏓 **Xóa bảng giá**
export const deletePricing = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/pricings/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa bảng giá", error);
        throw error;
    }
};
