import axios from "axios";
import moment from "moment";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
    const token = localStorage.getItem("auth_token");
    return token ? token : null;
};

// **Lấy danh sách thu chi với phân trang và lọc theo chi nhánh, ngày, loại hóa đơn, userId**
export const getAllIncomeExpense = async (facilityId, type, keyword, date, page = 1, limit = 10, userId) => {
    try {
        // Format the date before sending it to the backend (if necessary)
        const formattedDate = date ? date.format() : moment().format();

        const response = await axios.get(`${API_URL}/income-expenses`, {
            params: {
                facilityId,
                type,
                keyword,
                date: formattedDate,  // Send the formatted date if it's available
                page,
                limit,
                userId,
            },
            headers: {
                Authorization: `Bearer ${getToken()}`, // Include the token in the header
            },
        });

        return response.data.payload; // Return the list of income-expenses
    } catch (error) {
        console.error("Error fetching income-expenses", error);
        throw error;
    }
};


export const createIncomeExpense = async (incomeExpenseData) => {
    try {
        // Create FormData instance
        const formData = new FormData();

        // Append fields to FormData (Non-file fields)
        formData.append("type", incomeExpenseData.type);
        formData.append("amount", incomeExpenseData.amount);
        formData.append("description", incomeExpenseData.description);
        formData.append("facilityId", incomeExpenseData.facilityId);
        formData.append("userId", incomeExpenseData.userId);
        formData.append("date", moment(incomeExpenseData.date).utcOffset(7, true).format()); // Convert date to UTC+7
        formData.append("file", incomeExpenseData.files);

        // Call the API to create a new income/expense with FormData
        const response = await axios.post(`${API_URL}/income-expenses`, formData, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "multipart/form-data", // Set the correct header for FormData
            },
        });

        return response.data; // Return the created IncomeExpense
    } catch (error) {
        console.error("Error creating income-expense", error);
        throw error;
    }
};



// **Cập nhật hóa đơn thu chi**
export const updateIncomeExpense = async (id, incomeExpenseData) => {
    try {
        // Create FormData instance
        const formData = new FormData();

        // Append fields to FormData
        formData.append("type", incomeExpenseData.type);
        formData.append("amount", incomeExpenseData.amount);
        formData.append("description", incomeExpenseData.description);
        formData.append("facilityId", incomeExpenseData.facilityId);
        formData.append("userId", incomeExpenseData.userId);
        formData.append("date", moment(incomeExpenseData.date).utcOffset(7, true).format()); // Convert date to UTC+7
        formData.append("file", incomeExpenseData.files);

        const response = await axios.put(`${API_URL}/income-expenses/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "multipart/form-data", // Set the correct header for FormData
            },
        });

        return response.data; // Return the updated IncomeExpense
    } catch (error) {
        console.error("Error updating income-expense", error);
        throw error;
    }
};

// **Xóa hóa đơn thu chi**
export const deleteIncomeExpense = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/income-expenses/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
            },
        });
        return response.data; // Return the result of deletion
    } catch (error) {
        console.error("Error deleting income-expense", error);
        throw error;
    }
};

// **Lấy tổng thu chi trong khoảng thời gian**
export const getTotalByDate = async (fromDate, toDate) => {
    try {
        const formattedFromDate = fromDate ? fromDate.format() : moment().format();
        const formattedToDate = toDate ? toDate.format() : moment().format();
        const response = await axios.get(`${API_URL}/income-expenses/total`, {
            params: {
                fromDate: formattedFromDate,
                toDate: formattedToDate,
            },
            headers: {
                Authorization: `Bearer ${getToken()}`, // Thêm token vào header
            },
        });
        return response.data.payload; // Return total income and expense
    } catch (error) {
        console.error("Error fetching total income-expense", error);
        throw error;
    }
};
