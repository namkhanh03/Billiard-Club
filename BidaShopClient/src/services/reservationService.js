import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_END;

// Lấy token từ localStorage
const getToken = () => {
    const token = localStorage.getItem("auth_token");
    return token ? token : null;
};

// ✅ 🧾 Tạo đặt lịch mới
export const createReservation = async (reservationData) => {
    try {
        const response = await axios.post(
            `${API_URL}/reservations`,
            null, // Vì dùng @RequestParam nên body rỗng
            {
                params: reservationData,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            }
        );
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi tạo đặt lịch", error);
        throw error;
    }
};

// ✅ 📋 Lấy danh sách đặt lịch (có phân trang, filter)
export const getAllReservations = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/reservations`, {
            params,
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đặt lịch", error);
        throw error;
    }
};
export const cancelReservation = async (reservationId) => {
    try {
        const response = await axios.delete(
            `${API_URL}/reservations/${reservationId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            }
        );
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi hủy đặt lịch", error);
        throw error;
    }
};
export const changeReservationStatus = async (reservationId, status) => {
    try {
        const response = await axios.put(
            `${API_URL}/reservations/${reservationId}/status`,
            null, // dùng @RequestParam
            {
                params: { status },
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            }
        );
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái đặt lịch", error);
        throw error;
    }
};
