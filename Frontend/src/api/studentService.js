import axios from "axios";
import dayjs from "dayjs";

// axios
const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api/students",
    headers: {
        "Content-Type": "application/json",
    },
});

// parse XML → JSON
function parseXML(xmlString) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");
        const result = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            result.push({
                id: item.getElementsByTagName("id")[0]?.textContent || "",
                student_code: item.getElementsByTagName("student_code")[0]?.textContent || "",
                first_name: item.getElementsByTagName("first_name")[0]?.textContent || "",
                last_name: item.getElementsByTagName("last_name")[0]?.textContent || "",
                email: item.getElementsByTagName("email")[0]?.textContent || "",
                birth_date: item.getElementsByTagName("birth_date")[0]?.textContent || "",
                hometown: item.getElementsByTagName("hometown")[0]?.textContent || "",
                math_score: parseFloat(item.getElementsByTagName("math_score")[0]?.textContent || 0),
                literature_score: parseFloat(item.getElementsByTagName("literature_score")[0]?.textContent || 0),
                english_score: parseFloat(item.getElementsByTagName("english_score")[0]?.textContent || 0),
                create_at: item.getElementsByTagName("create_at")[0]?.textContent || "",
            });
        }

        return result;
    } catch (err) {
        console.error("XML parse error:", err);
        return [];
    }
}

// Lấy toàn bộ sinh viên (XML → JSON)
const getAllStudents = async () => {
    try {
        const response = await apiClient.get("/", { responseType: "text" });
        console.log("Raw XML response:", response.data);
        const students = parseXML(response.data);
        console.log("Parsed students:", students);
        return students;
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
};

// Tạo mới sinh viên
const createStudent = async (studentData) => {
    const formattedData = {
        ...studentData,
        birth_date: studentData.birth_date
            ? dayjs(studentData.birth_date).format("YYYY-MM-DD")
            : null,
    };
    console.log("Sending new student:", formattedData); 
    try {
        const response = await apiClient.post("/", formattedData);
        console.log("Created student:", response.data);
        return response;
    } catch (error) {
        console.error("Backend error detail:", error.response?.data || error.message);
        throw error;
    }
};

// Cập nhật sinh viên
const updateStudent = async (studentCode, studentData) => {
    const formattedData = {
        ...studentData,
        birth_date: studentData.birth_date
            ? dayjs(studentData.birth_date).format("YYYY-MM-DD")
            : null,
    };
    console.log("Updating student:", formattedData);
    return apiClient.put(`/${studentCode}`, formattedData);
};

// Xóa sinh viên
const deleteStudent = (studentCode) => apiClient.delete(`/${studentCode}`);

// Xuất tất cả hàm
export const studentService = {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
};
