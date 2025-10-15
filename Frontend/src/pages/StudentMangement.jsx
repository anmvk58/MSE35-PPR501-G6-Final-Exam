import { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import StudentForm from '../components/StudentForm';
import { studentService } from '../api/studentService';

const { Title } = Typography;

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const students = await studentService.getAllStudents();
            console.log("👀 Final student list:", students);
            setStudents(students || []);
        } catch (error) {
            console.error("Error fetching students:", error);
            message.error("Không thể tải danh sách học sinh. Vui lòng kiểm tra kết nối Backend.");
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        // Delay để tránh crash khi component mount
        const timer = setTimeout(() => {
            fetchStudents();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const handleAdd = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingStudent(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (studentCode) => {
        try {
            await studentService.deleteStudent(studentCode);
            message.success('Xóa học sinh thành công');
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
            message.error('Không thể xóa học sinh');
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            if (editingStudent) {
                await studentService.updateStudent(editingStudent.student_code, values);
                message.success('Cập nhật học sinh thành công');
            } else {
                await studentService.createStudent(values);
                message.success('Thêm học sinh thành công');
            }
            setIsModalOpen(false);
            fetchStudents();
        } catch (error) {
            console.error('Error saving student:', error);
            message.error('Không thể lưu thông tin học sinh');
        }
    };

    const columns = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_code',
            width: 120,
        },
        {
            title: 'Họ và tên',
            key: 'full_name',
            width: 200,
            render: (_, record) => `${record.last_name} ${record.first_name}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birth_date',
            key: 'birth_date',
            width: 120,
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '',
        },
        {
            title: 'Quê quán',
            dataIndex: 'hometown',
            key: 'hometown',
            width: 150,
        },
        {
            title: 'Điểm Toán',
            dataIndex: 'math_score',
            key: 'math_score',
            width: 100,
            render: (score) => (score === 0 || score === null ? '-' : score),
        },
        {
            title: 'Điểm Văn',
            dataIndex: 'literature_score',
            key: 'literature_score',
            width: 100,
            render: (score) => (score === 0 || score === null ? '-' : score),
        },
        {
            title: 'Điểm Anh',
            dataIndex: 'english_score',
            key: 'english_score',
            width: 100,
            render: (score) => (score === 0 || score === null ? '-' : score),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa học sinh"
                        description="Bạn có chắc chắn muốn xóa học sinh này?"
                        onConfirm={() => handleDelete(record.student_code)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Quản lý học sinh</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                >
                    Thêm học sinh
                </Button>
            </div>

            {loading && students.length === 0 ? (
                <div className="loading-container">
                    <div>Đang tải dữ liệu...</div>
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={students}
                    rowKey="student_code"
                    loading={loading}
                    scroll={{ x: 1300 }}
                    bordered
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showQuickJumper: false,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} học sinh`,
                    }}
                />
            )}

            <StudentForm
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingStudent}
            />
        </div>
    );
};

export default StudentManagement;