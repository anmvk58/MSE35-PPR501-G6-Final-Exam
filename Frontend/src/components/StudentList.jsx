import React, { useState, useEffect } from 'react';
import mockApiService from '../utils/mockApi';
import { Link } from 'react-router-dom';
import './StudentList.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await mockApiService.getStudents();
        setStudents(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch students. Please try again later.');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await mockApiService.deleteStudent(id);
        setStudents(students.filter(student => student.id !== id));
      } catch (err) {
        setError('Failed to delete student. Please try again later.');
        console.error('Error deleting student:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;
  
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h2>Student List</h2>
        <Link to="/add-student" className="add-student-btn">Add New Student</Link>
      </div>
      
      {students.length === 0 ? (
        <div className="no-students">No students found. Add a new student to get started.</div>
      ) : (
        <div className="table-responsive">
          <table className="student-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Hometown</th>
                <th>Math Score</th>
                <th>Literature Score</th>
                <th>English Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                  <td>{student.hometown}</td>
                  <td>{student.mathScore}</td>
                  <td>{student.literatureScore}</td>
                  <td>{student.englishScore}</td>
                  <td className="action-buttons">
                    <Link to={`/edit-student/${student.id}`} className="edit-btn">Edit</Link>
                    <button 
                      onClick={() => handleDelete(student.id)} 
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;