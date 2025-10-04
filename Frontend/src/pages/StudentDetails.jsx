import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStudents } from '../hooks/useStudents';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudent, deleteStudent } = useStudents();
  const student = getStudent(id);

  if (!student) {
    return (
      <div className="card">
        <h2>Student Not Found</h2>
        <p>The student you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Back to List</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
      navigate('/');
    }
  };

  // Calculate average score
  const averageScore = (
    (parseFloat(student.mathScore) + 
     parseFloat(student.literatureScore) + 
     parseFloat(student.englishScore)) / 3
  ).toFixed(2);

  return (
    <div>
      <h2>Student Details</h2>
      <div className="card">
        <div className="student-details">
          <div className="detail-row">
            <strong>ID:</strong> {student.id}
          </div>
          <div className="detail-row">
            <strong>Name:</strong> {student.firstName} {student.lastName}
          </div>
          <div className="detail-row">
            <strong>Email:</strong> {student.email}
          </div>
          <div className="detail-row">
            <strong>Date of Birth:</strong> {student.dateOfBirth}
          </div>
          <div className="detail-row">
            <strong>Hometown:</strong> {student.hometown}
          </div>
          
          <h3 className="mt-4">Academic Performance</h3>
          <div className="scores-container">
            <div className="score-item">
              <strong>Math:</strong> {student.mathScore}
            </div>
            <div className="score-item">
              <strong>Literature:</strong> {student.literatureScore}
            </div>
            <div className="score-item">
              <strong>English:</strong> {student.englishScore}
            </div>
            <div className="score-item average">
              <strong>Average:</strong> {averageScore}
            </div>
          </div>
          
          <div className="actions mt-4">
            <Link to="/" className="btn btn-primary">Back to List</Link>
            <Link to={`/students/edit/${id}`} className="btn btn-success ml-2">Edit</Link>
            <button onClick={handleDelete} className="btn btn-danger ml-2">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;