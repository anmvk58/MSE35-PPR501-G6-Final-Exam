import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mockApiService from '../utils/mockApi';
import './AddStudent.css';

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
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.hometown.trim()) errors.hometown = 'Hometown is required';
    
    // Score validations
    const validateScore = (score, field) => {
      const numScore = parseFloat(score);
      if (score === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1, -5)} score is required`;
      } else if (isNaN(numScore) || numScore < 0 || numScore > 10) {
        errors[field] = 'Score must be a number between 0 and 10';
      }
    };
    
    validateScore(formData.mathScore, 'mathScore');
    validateScore(formData.literatureScore, 'literatureScore');
    validateScore(formData.englishScore, 'englishScore');
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await mockApiService.createStudent(formData);
      navigate('/students');
    } catch (err) {
      setError('Failed to add student. Please try again later.');
      console.error('Error adding student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container">
      <h2>Add New Student</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={formErrors.firstName ? 'error' : ''}
            />
            {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={formErrors.lastName ? 'error' : ''}
            />
            {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? 'error' : ''}
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={formErrors.dateOfBirth ? 'error' : ''}
            />
            {formErrors.dateOfBirth && <span className="error-text">{formErrors.dateOfBirth}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="hometown">Hometown</label>
          <input
            type="text"
            id="hometown"
            name="hometown"
            value={formData.hometown}
            onChange={handleChange}
            className={formErrors.hometown ? 'error' : ''}
          />
          {formErrors.hometown && <span className="error-text">{formErrors.hometown}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mathScore">Math Score (0-10)</label>
            <input
              type="number"
              id="mathScore"
              name="mathScore"
              min="0"
              max="10"
              step="0.1"
              value={formData.mathScore}
              onChange={handleChange}
              className={formErrors.mathScore ? 'error' : ''}
            />
            {formErrors.mathScore && <span className="error-text">{formErrors.mathScore}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="literatureScore">Literature Score (0-10)</label>
            <input
              type="number"
              id="literatureScore"
              name="literatureScore"
              min="0"
              max="10"
              step="0.1"
              value={formData.literatureScore}
              onChange={handleChange}
              className={formErrors.literatureScore ? 'error' : ''}
            />
            {formErrors.literatureScore && <span className="error-text">{formErrors.literatureScore}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="englishScore">English Score (0-10)</label>
            <input
              type="number"
              id="englishScore"
              name="englishScore"
              min="0"
              max="10"
              step="0.1"
              value={formData.englishScore}
              onChange={handleChange}
              className={formErrors.englishScore ? 'error' : ''}
            />
            {formErrors.englishScore && <span className="error-text">{formErrors.englishScore}</span>}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/students')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;