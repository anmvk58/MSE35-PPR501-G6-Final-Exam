import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Button,
    Alert,
} from 'reactstrap';

import mockApiService from '../utils/mockApi';

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
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg">
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">
                        📚 Danh sách sinh viên
                    </Typography>
                    <Button
                        component={Link}
                        to="/add-student"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ ml: 2 }}
                    >
                        Thêm sinh viên
                    </Button>
                </Stack>

                {students.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" textAlign="center" color="text.secondary">
                                Không có sinh viên nào. Hãy thêm mới!
                            </Typography>
                        </CardContent>
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
                                        <TableRow
                                            key={student.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{student.id}</TableCell>
                                            <TableCell>{student.firstName}</TableCell>
                                            <TableCell>{student.lastName}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>
                                                {new Date(student.dateOfBirth).toLocaleDateString()}
                                            </TableCell>
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
        </Container>
    );
};

export default StudentList;