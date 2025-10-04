import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    // Demo credentials (in a real app, this would be validated against a backend)
    if (email === 'admin@example.com' && password === 'password') {
      login({ email, name: 'Admin User' });
      navigate('/');
    } else {
      setError('Invalid credentials. Try admin@example.com / password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Student Management</h2>
          <p className="auth-subtitle">Sign in to access your dashboard</p>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '16px'}}>
            Sign In
          </button>
        </form>
        
        <div style={{marginTop: '24px', textAlign: 'center'}}>
          <p style={{color: 'var(--gray-color)', fontSize: '0.9rem'}}>
            Demo credentials: <strong>admin@example.com / password</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;