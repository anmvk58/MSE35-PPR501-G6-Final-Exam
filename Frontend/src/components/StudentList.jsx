import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    Table,
    Button,
    Alert,
} from 'reactstrap';
import {
    Box,
    Stack,
    Typography,
    Container,
    CircularProgress,
    IconButton,
    Paper,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Sidebar from '../components/Sidebar'; // ✅ Import sidebar riêng của bạn
import mockApiService from '../utils/mockApi';
import AddStudent from "./AddStudent.jsx";

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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg">
                <Alert color="danger" className="mt-3">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* ✅ Sidebar cố định bên trái */}
            <Sidebar />

            {/* ✅ Nội dung chính */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f8f9fa' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">
                        📚 Danh sách sinh viên
                    </Typography>
                    <Button
                        component={AddStudent}
                        to="/add-student"
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        Thêm sinh viên
                    </Button>
                </Stack>

                {students.length === 0 ? (
                    <Card className="p-4 text-center">
                        <Typography variant="h6" color="text.secondary">
                            Không có sinh viên nào. Hãy thêm mới!
                        </Typography>
                    </Card>
                ) : (
                    <Card>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Họ</TableCell>
                                        <TableCell>Tên</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Ngày sinh</TableCell>
                                        <TableCell>Quê quán</TableCell>
                                        <TableCell align="center">Toán</TableCell>
                                        <TableCell align="center">Văn</TableCell>
                                        <TableCell align="center">Anh</TableCell>
                                        <TableCell align="center">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>{student.id}</TableCell>
                                            <TableCell>{student.firstName}</TableCell>
                                            <TableCell>{student.lastName}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                                            <TableCell>{student.hometown}</TableCell>
                                            <TableCell align="center">{student.mathScore}</TableCell>
                                            <TableCell align="center">{student.literatureScore}</TableCell>
                                            <TableCell align="center">{student.englishScore}</TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <IconButton
                                                        component={Link}
                                                        to={`/edit-student/${student.id}`}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDelete(student.id)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                )}
            </Box>
        </Box>
    );
};

export default StudentList;
