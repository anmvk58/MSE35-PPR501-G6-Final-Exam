import { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Row, Col } from 'antd';
import dayjs from 'dayjs';

// Thay 'visible' bằng 'open'
const StudentForm = ({ open, onCancel, onSubmit, initialData }) => {
    const [form] = Form.useForm();
    const isEditing = !!initialData;

    useEffect(() => {
        if (open) {
            if (isEditing && initialData) {
                form.setFieldsValue({
                    ...initialData,
                    birth_date: initialData.birth_date ? dayjs(initialData.birth_date) : null,
                    math_score: initialData.math_score ? Number(initialData.math_score) : null,
                    literature_score: initialData.literature_score ? Number(initialData.literature_score) : null,
                    english_score: initialData.english_score ? Number(initialData.english_score) : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form, isEditing]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                onSubmit(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title={isEditing ? 'Chỉnh sửa thông tin sinh viên' : 'Thêm mới sinh viên'}
            open={open} 
            onOk={handleOk}
            onCancel={onCancel}
            width={800}
            okText={isEditing ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
            // Xóa form sau khi đóng để tránh lỗi hiển thị dữ liệu cũ
            destroyOnClose 
        >
            <Form form={form} layout="vertical" name="student_form">
                {/* Nội dung form giữ nguyên */}
                 <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="student_code"
                            label="Mã sinh viên"
                            rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
                        >
                            <Input disabled={isEditing} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="last_name"
                            label="Họ"
                            rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="first_name"
                            label="Tên"
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="birth_date"
                            label="Ngày sinh"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="hometown"
                            label="Quê quán"
                            rules={[{ required: true, message: 'Vui lòng nhập quê quán!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="math_score" label="Điểm Toán">
                            <InputNumber min={0} max={10} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="literature_score" label="Điểm Văn">
                            <InputNumber min={0} max={10} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="english_score" label="Điểm Anh">
                            <InputNumber min={0} max={10} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default StudentForm;