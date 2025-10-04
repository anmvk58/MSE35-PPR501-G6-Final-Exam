import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudents } from '../hooks/useStudents';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addStudent, updateStudent, getStudent } = useStudents();
  const [isEdit, setIsEdit] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    dateOfBirth: Yup.date().required('Date of birth is required'),
    hometown: Yup.string().required('Hometown is required'),
    mathScore: Yup.number()
      .min(0, 'Score must be between 0 and 10')
      .max(10, 'Score must be between 0 and 10')
      .required('Math score is required'),
    literatureScore: Yup.number()
      .min(0, 'Score must be between 0 and 10')
      .max(10, 'Score must be between 0 and 10')
      .required('Literature score is required'),
    englishScore: Yup.number()
      .min(0, 'Score must be between 0 and 10')
      .max(10, 'Score must be between 0 and 10')
      .required('English score is required'),
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      hometown: '',
      mathScore: '',
      literatureScore: '',
      englishScore: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (isEdit) {
        updateStudent(id, values);
      } else {
        addStudent(values);
      }
      navigate('/');
    },
  });

  // Load student data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const student = getStudent(id);
      if (student) {
        formik.setValues({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          dateOfBirth: student.dateOfBirth,
          hometown: student.hometown,
          mathScore: student.mathScore,
          literatureScore: student.literatureScore,
          englishScore: student.englishScore,
        });
      }
    }
  }, [id, getStudent]);

  return (
    <div>
      <h2>{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
      <div className="card">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="error">{formik.errors.firstName}</div>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="error">{formik.errors.lastName}</div>
              ) : null}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dateOfBirth}
            />
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
              <div className="error">{formik.errors.dateOfBirth}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="hometown">Hometown</label>
            <input
              type="text"
              id="hometown"
              name="hometown"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.hometown}
            />
            {formik.touched.hometown && formik.errors.hometown ? (
              <div className="error">{formik.errors.hometown}</div>
            ) : null}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mathScore">Math Score</label>
              <input
                type="number"
                id="mathScore"
                name="mathScore"
                className="form-control"
                min="0"
                max="10"
                step="0.1"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mathScore}
              />
              {formik.touched.mathScore && formik.errors.mathScore ? (
                <div className="error">{formik.errors.mathScore}</div>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="literatureScore">Literature Score</label>
              <input
                type="number"
                id="literatureScore"
                name="literatureScore"
                className="form-control"
                min="0"
                max="10"
                step="0.1"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.literatureScore}
              />
              {formik.touched.literatureScore && formik.errors.literatureScore ? (
                <div className="error">{formik.errors.literatureScore}</div>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="englishScore">English Score</label>
              <input
                type="number"
                id="englishScore"
                name="englishScore"
                className="form-control"
                min="0"
                max="10"
                step="0.1"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.englishScore}
              />
              {formik.touched.englishScore && formik.errors.englishScore ? (
                <div className="error">{formik.errors.englishScore}</div>
              ) : null}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update Student' : 'Add Student'}
            </button>
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;