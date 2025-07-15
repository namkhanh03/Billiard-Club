import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
    const token = localStorage.getItem("auth_token");
    return token ? token : null;
};

export const getFacilityByUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/facility-users/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data.payload; // Trả về danh sách facility từ response
    } catch (error) {
        console.error("Lỗi khi lấy danh sách facility của user", error);
        throw error;
    }
};

export const updateUserManageFacility = async (userId, facilityIds) => {
    try {
        const response = await axios.put(
            `${API_URL}/facility-users/user/${userId}`,
            facilityIds,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.payload; // Trả về danh sách facility sau khi cập nhật
    } catch (error) {
        console.error("Lỗi khi cập nhật danh sách facility của user", error);
        throw error;
    }
};
