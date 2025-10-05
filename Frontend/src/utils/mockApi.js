// Mock API service for student management
let students = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '2000-05-15',
    hometown: 'Hanoi',
    mathScore: 8.5,
    literatureScore: 7.0,
    englishScore: 9.0
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    dateOfBirth: '2001-03-22',
    hometown: 'Ho Chi Minh City',
    mathScore: 9.0,
    literatureScore: 8.5,
    englishScore: 7.5
  },
  {
    id: '3',
    firstName: 'David',
    lastName: 'Nguyen',
    email: 'david.nguyen@example.com',
    dateOfBirth: '2000-11-10',
    hometown: 'Da Nang',
    mathScore: 7.5,
    literatureScore: 9.0,
    englishScore: 8.0
  }
];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export const mockApiService = {
  // Get all students
  getStudents: async () => {
    await delay(500); // Simulate network delay
    return [...students];
  },
  
  // Get a single student by ID
  getStudent: async (id) => {
    await delay(300);
    const student = students.find(s => s.id === id);
    if (!student) {
      throw new Error('Student not found');
    }
    return {...student};
  },
  
  // Create a new student
  createStudent: async (data) => {
    await delay(700);
    const newStudent = {
      ...data,
      id: String(Date.now()), // Generate a unique ID
    };
    students.push(newStudent);
    return newStudent;
  },
  
  // Update an existing student
  updateStudent: async (id, data) => {
    await delay(500);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    
    const updatedStudent = {
      ...students[index],
      ...data,
      id // Ensure ID doesn't change
    };
    
    students[index] = updatedStudent;
    return updatedStudent;
  },
  
  // Delete a student
  deleteStudent: async (id) => {
    await delay(400);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    
    students = students.filter(s => s.id !== id);
    return { success: true };
  }
};

export default mockApiService;