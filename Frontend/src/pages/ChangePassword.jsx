import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { changePassword } from '../api/users';

const ChangePassword = () => {
  // State hooks for each form field
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle change in input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'oldPassword':
        setOldPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  // Validate passwords match
  const validatePasswords = () => {
    return newPassword === confirmPassword;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message
    setIsLoading(true); // Start loading

    try {
      if (!validatePasswords()) {
        // Update the error state to show an error message
        setError('New passwords do not match.');
        return;
      }

      const requestBody = {
        oldPassword,
        newPassword
      };

      await changePassword(requestBody);
      // After successfull password change
      setSuccess(true);
    } catch (error) {
      setError(error.message || 'Old password is incorrect.');
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
            {success && <div className="alert alert-success">Password Changed Successfully</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <h3>Change Password</h3>
            <div className="mb-3">
              <label>Current Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter current password"
                name="oldPassword"
                value={oldPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
        </>
        )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
