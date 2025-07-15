import axios from "axios";
import moment from "moment";
// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả bài viết với phân trang, tìm kiếm
export const getAllPosts = async (page = 1, limit = 10, keyword = "", date = "") => {
  try {
    let formattedDate = "";
    if (date) {
      // +1 ngày và chuyển sang múi giờ UTC+7, sau đó format sang ISO
      formattedDate = moment(date)
        .add(1, 'day')               // Cộng thêm 1 ngày
        .toISOString();             // Format ISO
    }

    const response = await axios.get(`${API_URL}/posts`, {
      params: {
        keyword,
        page,
        limit,
        date: formattedDate,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data.payload;
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
  }
};

// Hàm lấy bài viết theo ID
export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching post by ID", error);
    throw error;
  }
};

const getUserId = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData?.userId || null;
};

// Hàm tạo bài viết
export const createPost = async (title, content, imageFile) => {
  const postedBy = getUserId();
  if (!postedBy) {
    throw new Error("Không tìm thấy thông tin người đăng bài.");
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("postedBy", postedBy);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.post(`${API_URL}/posts`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating post", error);
    throw error;
  }
};

// Hàm cập nhật bài viết theo ID
export const updatePost = async (id, title, content, imageFile) => {
  const postedBy = getUserId();
  if (!postedBy) {
    throw new Error("Không tìm thấy thông tin người cập nhật bài viết.");
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("postedBy", postedBy);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.put(`${API_URL}/posts/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating post", error);
    throw error;
  }
};

// Hàm xóa bài viết theo ID (Soft Delete)
export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting post", error);
    throw error;
  }
};
