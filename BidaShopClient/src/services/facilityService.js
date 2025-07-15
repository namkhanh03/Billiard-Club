import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_END;

// Hàm lấy token từ localStorage
const getToken = () => {
    const token = localStorage.getItem("auth_token");
    return token ? token : null;
};

// Hàm lấy tất cả facility với phân trang, tìm kiếm
export const getAllFacilities = async (page = 1, limit = 10, keyword = "", userId = "") => {
    try {
        const response = await axios.get(`${API_URL}/facilities`, {
            params: {
                keyword,
                page,
                limit,
                userId,
            },
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
            },
        });
        return response.data.payload; // Thay `payload` nếu trường trong response khác
    } catch (error) {
        console.error("Error fetching facilities", error);
        throw error;
    }
};

// Hàm lấy facility theo ID
export const getFacilityById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/facilities/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
            },
        });
        return response.data.payload; // Trả về facility
    } catch (error) {
        console.error("Error fetching facility by ID", error);
        throw error;
    }
};

export const createFacility = async (facility, imageFiles) => {
    try {
        const formData = new FormData();

        // Thêm các trường vào formData
        formData.append("name", facility.name);
        formData.append("address", facility.address);
        formData.append("phoneNumber", facility.phoneNumber);

        // Nếu có nhiều file ảnh, thêm từng file vào formData
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                formData.append("images", file); // API backend sử dụng key "images"
            });
        }

        // Gửi yêu cầu POST tới API
        const response = await axios.post(`${API_URL}/facilities`, formData, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
                "Content-Type": "multipart/form-data", // Đảm bảo header cho form data
            },
        });

        return response.data; // Trả về facility vừa tạo
    } catch (error) {
        console.error("Lỗi khi tạo facility", error);
        throw error; // Quăng lỗi để xử lý ở nơi gọi hàm
    }
};
export const updateFacility = async (id, facility, imageFiles) => {
    try {
        const formData = new FormData();

        // Thêm các trường vào formData
        formData.append("name", facility.name);
        formData.append("address", facility.address);
        formData.append("phoneNumber", facility.phoneNumber);

        // Nếu có nhiều file ảnh, thêm từng file vào formData
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                if (typeof file === 'string') {
                    // Nếu là URL (string), thêm URL vào formData
                    formData.append("images", file); // API backend sử dụng key "images"
                } else if (file instanceof File) {
                    // Nếu là MultipartFile (file ảnh), thêm vào formData
                    formData.append("images", file); // API backend sử dụng key "images"
                }
            });
        }

        // Gửi yêu cầu PUT tới API
        const response = await axios.put(`${API_URL}/facilities/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
                "Content-Type": "multipart/form-data", // Đảm bảo header cho form data
            },
        });

        return response.data; // Trả về facility vừa cập nhật
    } catch (error) {
        console.error("Lỗi khi cập nhật facility", error);
        throw error; // Quăng lỗi để xử lý ở nơi gọi hàm
    }
};

// Hàm xóa facility theo ID
export const deleteFacility = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/facilities/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
            },
        });
        return response.data; // Trả về kết quả xóa
    } catch (error) {
        console.error("Error deleting facility", error);
        throw error;
    }
};
export const deleteFacilityImage = async (id) => {
    try {
        // Sending DELETE request to the API to delete the image
        const response = await axios.delete(`${API_URL}/facility-images/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Adding token to header
            },
        });

        return response.data; // Return the result of the deletion
    } catch (error) {
        console.error("Error deleting facility image", error);
        throw error; // Propagate the error
    }
};