import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudents } from '../hooks/useStudents';
import Sidebar from '../components/Sidebar';

const StudentList = () => {
    const { students, deleteStudent } = useStudents();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');

    // Handle search
    const filteredStudents = students.filter(student => {
        const searchLower = searchTerm.toLowerCase();
        return (
            student.firstName.toLowerCase().includes(searchLower) ||
            student.lastName.toLowerCase().includes(searchLower) ||
            student.email.toLowerCase().includes(searchLower) ||
            student.hometown.toLowerCase().includes(searchLower)
        );
    });

    // Handle sorting
    const sortedStudents = [...filteredStudents].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        if (['mathScore', 'literatureScore', 'englishScore'].includes(sortField)) {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
        }
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const exportToCSV = () => {
        const headers = ['ID','First Name','Last Name','Email','Date of Birth','Hometown','Math Score','Literature Score','English Score'];
        const csvData = [
            headers.join(','),
            ...sortedStudents.map(student => [
                student.id,
                student.firstName,
                student.lastName,
                student.email,
                student.dateOfBirth,
                student.hometown,
                student.mathScore,
                student.literatureScore,
                student.englishScore
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'students.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f9fafb' }}>
                <div className="header d-flex justify-content-between align-items-center mb-4">
                    <h2>Student List</h2>
                    <div className="actions">
                        <Link to="/students/add" className="btn btn-primary">Add New Student</Link>
                        <button onClick={exportToCSV} className="btn btn-success ml-2">Export to CSV</button>
                    </div>
                </div>

                <div className="card p-3">
                    <div className="search-container mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {sortedStudents.length === 0 ? (
                        <p>No students found. Add some students to get started.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th onClick={() => handleSort('id')}>ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('firstName')}>First Name {sortField === 'firstName' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('lastName')}>Last Name {sortField === 'lastName' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('mathScore')}>Math {sortField === 'mathScore' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('literatureScore')}>Literature {sortField === 'literatureScore' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => handleSort('englishScore')}>English {sortField === 'englishScore' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sortedStudents.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td>{student.firstName}</td>
                                        <td>{student.lastName}</td>
                                        <td>{student.email}</td>
                                        <td>{student.mathScore}</td>
                                        <td>{student.literatureScore}</td>
                                        <td>{student.englishScore}</td>
                                        <td>
                                            <Link to={`/students/${student.id}`} className="btn btn-primary btn-sm">View</Link>
                                            <Link to={`/students/edit/${student.id}`} className="btn btn-success btn-sm ml-2">Edit</Link>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this student?')) {
                                                        deleteStudent(student.id);
                                                    }
                                                }}
                                                className="btn btn-danger btn-sm ml-2"
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
            </div>
        </div>
    );
};

export default StudentList;
