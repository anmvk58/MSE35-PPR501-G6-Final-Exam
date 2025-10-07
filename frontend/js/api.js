// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// API Client Class
class StudentAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // Helper method for making requests
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'An error occurred');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Get all students
    async getAllStudents(params = {}) {
        const queryParams = new URLSearchParams();
        
        if (params.skip !== undefined) queryParams.append('skip', params.skip);
        if (params.limit !== undefined) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        const endpoint = `/students${queryString ? '?' + queryString : ''}`;
        
        return await this.request(endpoint);
    }

    // Get student by ID
    async getStudentById(id) {
        return await this.request(`/students/${id}`);
    }

    // Get student by ma_so_sv
    async getStudentByMaSo(maSoSv) {
        return await this.request(`/students/ma-so/${maSoSv}`);
    }

    // Create new student
    async createStudent(studentData) {
        return await this.request('/students', {
            method: 'POST',
            body: JSON.stringify(studentData),
        });
    }

    // Update student
    async updateStudent(id, studentData) {
        return await this.request(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(studentData),
        });
    }

    // Delete student
    async deleteStudent(id) {
        return await this.request(`/students/${id}`, {
            method: 'DELETE',
        });
    }

    // Search students
    async searchStudents(keyword) {
        return await this.getAllStudents({ search: keyword });
    }

    // Get statistics
    async getStatistics() {
        return await this.request('/statistics');
    }

    // Create batch students
    async createBatchStudents(studentsData) {
        return await this.request('/students/batch', {
            method: 'POST',
            body: JSON.stringify(studentsData),
        });
    }
}

// Create API instance
const api = new StudentAPI(API_BASE_URL);