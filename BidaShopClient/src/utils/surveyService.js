import axios from "axios";

export const getQuestionsWithOptions = async () => {
    const response = await axios.get("http://localhost:5000/api/coaches/survey/questions", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

export const getCourseSurveyResponses = async (courseId) => {
    const response = await axios.get(`http://localhost:5000/api/coaches/course/${courseId}/survey`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
}; 