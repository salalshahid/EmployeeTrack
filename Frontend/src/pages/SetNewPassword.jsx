import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setNewPassword } from '../api/users'; // Assuming you have this API function to set a new password

const SetNewPassword = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await setNewPassword({ email, password });
      setMessage('Your password has been successfully reset. You can now log in with your new password.');
      setError('');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      setError('Failed to reset password. Please try again later.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper bg-image" style={{ backgroundImage: `url(./images/bg-image.jpg)` }}>
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Set New Password</h3>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Set New Password'}
            </button>
          </div>
          {message && <div className="alert alert-success" role="alert">{message}</div>}
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default SetNewPassword;
