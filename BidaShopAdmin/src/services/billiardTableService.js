import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
    const token = localStorage.getItem("auth_token");
    return token ? token : null;
};

// 🏓 **Lấy danh sách bàn bi-a (có phân trang, tìm kiếm)**
export const getAllBilliardTables = async (page = 1, limit = 10, keyword = "", facilityId = null, userId = "") => {
    try {
        const params = { page, limit, keyword, userId };
        if (facilityId) params.facilityId = facilityId; // Thêm facilityId nếu có

        const response = await axios.get(`${API_URL}/billiard-tables`, {
            params,
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bàn bi-a", error);
        throw error;
    }
};


// 🏓 **Lấy thông tin bàn bi-a theo ID**
export const getBilliardTableById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/billiard-tables/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
            },
        });
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi lấy bàn bi-a theo ID", error);
        throw error;
    }
};

// 🏓 **Tạo bàn bi-a mới**
export const createBilliardTable = async (tableData) => {
    try {
        const response = await axios.post(
            `${API_URL}/billiard-tables`,
            tableData, // Truyền object trực tiếp
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Thêm token vào header
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo bàn bi-a", error);
        throw error;
    }
};

// 🏓 **Cập nhật thông tin bàn bi-a**
export const updateBilliardTable = async (id, tableData) => {
    try {
        const response = await axios.put(
            `${API_URL}/billiard-tables/${id}`,
            tableData, // Truyền object trực tiếp (không cần id trong body)
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Thêm token vào header
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật bàn bi-a", error);
        throw error;
    }
};

// 🏓 **Xóa bàn bi-a**
export const deleteBilliardTable = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/billiard-tables/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa bàn bi-a", error);
        throw error;
    }
};

// 🏓 **Kích hoạt / Vô hiệu hóa bàn bi-a**
export const toggleBilliardTableActive = async (id, isActive) => {
    try {
        const response = await axios.put(
            `${API_URL}/billiard-tables/${id}/active`,
            { isActive },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Thêm token vào header
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái bàn bi-a", error);
        throw error;
    }
};
// 🏓 **Cập nhật trạng thái bàn bi-a (chỉ đổi status)**
export const changeBilliardTableStatus = async (id, status) => {
    try {
        const response = await axios.put(
            `${API_URL}/billiard-tables/${id}/status`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái bàn bi-a", error);
        throw error;
    }
};
