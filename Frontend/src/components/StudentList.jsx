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
                const data = await mockApiService.getStudents();
                setStudents(data);
                setError(null);
            } catch (err) {
                setError('Không thể tải danh sách sinh viên. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
            try {
                await mockApiService.deleteStudent(id);
                setStudents(prev => prev.filter(student => student.id !== id));
            } catch (err) {
                setError('Xóa sinh viên thất bại. Vui lòng thử lại.');
                console.error(err);
            }
        }
    };

    return (
        <div className="student-list-wrapper">
            <div className="student-list-header">
                <h1>📚 Danh sách sinh viên</h1>
                <Link to="/add-student" className="btn btn-primary">➕ Thêm sinh viên</Link>
            </div>

            {loading && <div className="status loading">Đang tải dữ liệu...</div>}
            {error && <div className="status error">{error}</div>}

            {!loading && !error && (
                <>
                    {students.length === 0 ? (
                        <div className="status empty">Không có sinh viên nào. Hãy thêm mới!</div>
                    ) : (
                        <div className="table-container">
                            <table className="student-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ</th>
                                    <th>Tên</th>
                                    <th>Email</th>
                                    <th>Ngày sinh</th>
                                    <th>Quê quán</th>
                                    <th>Toán</th>
                                    <th>Văn</th>
                                    <th>Anh</th>
                                    <th>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students.map(student => (
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
                                        <td>
                                            <div className="action-group">
                                                <Link to={`/edit-student/${student.id}`} className="btn btn-edit">✏️</Link>
                                                <button onClick={() => handleDelete(student.id)} className="btn btn-delete">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StudentList;
