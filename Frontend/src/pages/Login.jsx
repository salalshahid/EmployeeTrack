import React, { useState } from 'react';
import { login as loginApi } from '../api/users';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  // State hooks for each form field
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authContext = useAuth();
  const location = useLocation();
  const loginContext = authContext.login;
  const success = location.state && location.state.success;

  // Handle change in input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message

    setIsLoading(true); // Start loading
    try {
      const response = await loginApi({ email, password });
      setAuthToken(response.access);
      loginContext(response.access, response.user); // Pass the user object to loginContext
      navigate('/', { state: { success: false } });
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="auth-wrapper bg-image" style={{ backgroundImage: `url(./images/bg-image.jpg)` }}>
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {success && <div className="alert alert-success">Signup successful. Please log in.</div>}
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <h3>Login</h3>
              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
              <div className="text-right">
                <Link to="/reset-password-request" className="btn btn-link">Forgot Password?</Link>
              </div>
              <div className="text-right">
                Not registered yet? <Link to={'/signup'}>Signup</Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;