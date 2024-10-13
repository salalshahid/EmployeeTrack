import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { resetPasswordRequest } from '../api/users'; // API function to call for password reset

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await resetPasswordRequest({ email });
      navigate("/verify-otp", { state: { email, purpose: 'reset-password'} });
    } catch (error) {
      setError('Failed to send reset email. Please try again later.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper bg-image" style={{ backgroundImage: `url(./images/bg-image.jpg)` }}>
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Reset Password</h3>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Send Reset Link'}
            </button>
          </div>
          {message && <div className="alert alert-success" role="alert">{message}</div>}
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <p className="text-right">
            <Link to="/login">Login Instead?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;