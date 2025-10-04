import { createContext, useState, useEffect } from 'react';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load students from localStorage
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
    setLoading(false);
  }, []);

  // Save students to localStorage whenever the students state changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students, loading]);

  // Add a new student
  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
    };
    setStudents([...students, newStudent]);
    return newStudent;
  };

  // Update an existing student
  const updateStudent = (id, updatedStudent) => {
    const updatedStudents = students.map(student => 
      student.id === id ? { ...updatedStudent, id } : student
    );
    setStudents(updatedStudents);
    return updatedStudent;
  };

  // Delete a student
  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  // Get a student by ID
  const getStudent = (id) => {
    return students.find(student => student.id === id) || null;
  };

  return (
    <StudentContext.Provider value={{ 
      students, 
      loading, 
      addStudent, 
      updateStudent, 
      deleteStudent, 
      getStudent 
    }}>
      {children}
    </StudentContext.Provider>
  );
};