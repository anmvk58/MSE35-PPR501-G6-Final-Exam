import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Container,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

import mockApiService from '../utils/mockApi';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    hometown: '',
    mathScore: '',
    literatureScore: '',
    englishScore: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'Họ là bắt buộc';
    if (!formData.lastName.trim()) errors.lastName = 'Tên là bắt buộc';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email là bắt buộc';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Vui lòng nhập địa chỉ email hợp lệ';
    }
    
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Ngày sinh là bắt buộc';
    if (!formData.hometown.trim()) errors.hometown = 'Quê quán là bắt buộc';
    
    // Score validations
    const validateScore = (score, field, fieldName) => {
      const numScore = parseFloat(score);
      if (score === '') {
        errors[field] = `Điểm ${fieldName} là bắt buộc`;
      } else if (isNaN(numScore) || numScore < 0 || numScore > 10) {
        errors[field] = 'Điểm phải là số từ 0 đến 10';
      }
    };
    
    validateScore(formData.mathScore, 'mathScore', 'Toán');
    validateScore(formData.literatureScore, 'literatureScore', 'Văn');
    validateScore(formData.englishScore, 'englishScore', 'Anh');
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      await mockApiService.createStudent(formData);
      navigate('/students');
    } catch (err) {
      setError('Không thể thêm sinh viên. Vui lòng thử lại sau.');
      console.error('Error adding student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ➕ Thêm sinh viên mới
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={!!formErrors.dateOfBirth}
                    helperText={formErrors.dateOfBirth}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quê quán"
                    name="hometown"
                    value={formData.hometown}
                    onChange={handleChange}
                    error={!!formErrors.hometown}
                    helperText={formErrors.hometown}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Điểm Toán (0-10)"
                    name="mathScore"
                    type="number"
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    value={formData.mathScore}
                    onChange={handleChange}
                    error={!!formErrors.mathScore}
                    helperText={formErrors.mathScore}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Điểm Văn (0-10)"
                    name="literatureScore"
                    type="number"
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    value={formData.literatureScore}
                    onChange={handleChange}
                    error={!!formErrors.literatureScore}
                    helperText={formErrors.literatureScore}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Điểm Anh (0-10)"
                    name="englishScore"
                    type="number"
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    value={formData.englishScore}
                    onChange={handleChange}
                    error={!!formErrors.englishScore}
                    helperText={formErrors.englishScore}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => navigate('/students')}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Đang lưu...' : 'Lưu sinh viên'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AddStudent;