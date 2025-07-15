import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// ✅ Lấy token từ localStorage
const getToken = () => {
    return localStorage.getItem("auth_token") || null;
};

// ✅ Lấy danh sách đồ uống/thức ăn với phân trang, tìm kiếm, filter theo category
export const getAllDrinkFoods = async (page = 1, limit = 10, keyword = "", categoryId = null, facilityId = null, userId = null) => {
    try {
        const response = await axios.get(`${API_URL}/drink-foods`, {
            params: { keyword, page, limit, categoryId, facilityId, userId },
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đồ uống/thức ăn", error);
        throw error;
    }
};

// ✅ Lấy thông tin đồ uống/thức ăn theo ID
export const getDrinkFoodById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/drink-foods/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin đồ uống/thức ăn", error);
        throw error;
    }
};
export const createDrinkFood = async (
    name,
    price,
    description,
    categoryId,
    facilityId,
    quantity,
    warningThreshold,
    imageFile
) => {
    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("facilityId", facilityId);
        formData.append("quantity", quantity);
        formData.append("warningThreshold", warningThreshold);
        formData.append("image", imageFile);

        const response = await axios.post(`${API_URL}/drink-foods`, formData, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi thêm đồ uống/thức ăn", error);
        throw error;
    }
};

export const updateDrinkFood = async (
    id,
    name,
    price,
    description,
    categoryId,
    facilityId,
    quantity,
    warningThreshold,
    imageFile
) => {
    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("facilityId", facilityId);
        formData.append("quantity", quantity);
        formData.append("warningThreshold", warningThreshold);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        const response = await axios.put(`${API_URL}/drink-foods/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi cập nhật đồ uống/thức ăn", error);
        throw error;
    }
};


// ✅ Xóa đồ uống/thức ăn (Soft delete)
export const deleteDrinkFood = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/drink-foods/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi xóa đồ uống/thức ăn", error);
        throw error;
    }
};

// ✅ Bật/Tắt trạng thái hoạt động
export const toggleDrinkFoodActive = async (id, isActive) => {
    try {
        const response = await axios.put(
            `${API_URL}/drink-foods/${id}/active`,
            isActive, // Gửi trực tiếp isActive
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.payload;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đồ uống/thức ăn", error);
        throw error;
    }
};
