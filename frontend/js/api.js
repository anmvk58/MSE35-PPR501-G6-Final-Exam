// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Utility: Convert XML string to JS object/array
function parseXML(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'application/xml');
    if (xml.querySelector('parsererror')) {
        throw new Error('Error parsing XML');
    }
    function xmlToJson(node) {
        // If text node
        if (node.nodeType === 3) {
            return node.nodeValue.trim();
        }
        // If element node
        let obj = {};
        if (node.children.length > 0) {
            // Special: if all children are <item>, return array
            const allItems = Array.from(node.children).every(c => c.tagName === 'item');
            if (allItems) {
                return Array.from(node.children).map(xmlToJson);
            }
            // If all children have same tag, treat as array
            const childTag = node.children[0].tagName;
            const allSame = Array.from(node.children).every(c => c.tagName === childTag);
            if (allSame && node.children.length > 1) {
                obj = Array.from(node.children).map(xmlToJson);
            } else {
                for (let child of node.children) {
                    obj[child.tagName] = xmlToJson(child);
                }
            }
        } else if (node.textContent) {
            obj = node.textContent.trim();
        }
        return obj;
    }
    let root = xml.documentElement;
    return xmlToJson(root);
}

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
                'Accept': 'application/xml',
                // Only set Content-Type for requests with a body (POST/PUT)
                ...(options.body ? {'Content-Type': 'application/json'} : {}),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const text = await response.text();
            if (!response.ok) {
                // Try to parse error from XML
                try {
                    const errorObj = parseXML(text);
                    throw new Error(errorObj.detail || 'An error occurred');
                } catch {
                    throw new Error('An error occurred');
                }
            }
            // Parse XML to JS
            const data = parseXML(text);
            // If root is array (list of <item>), return as is
            if (Array.isArray(data)) return data;
            // If root is object with 'item' array, return that
            if (data.item && Array.isArray(data.item)) return data.item;
            // If root is object with single 'item', wrap in array
            if (data.item) return [data.item];
            return data;
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