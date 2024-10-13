import React, { useState } from 'react';
import { signup, signupRequest, verifyOTP } from '../api/users';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    let navigate = useNavigate();

  // State management for form inputs
  const [full_name, setFull_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('employee'); // Default to 'employee'
  const [isLoading, setIsLoading] = useState(false);

  // Validate passwords match
  const validatePasswords = () => {
    return password === confirmPassword;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    if (!validatePasswords()) {
      // Update the error state to show an error message
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true); // Start loading
    
    const userData = {
        full_name,
        email,
        password,
        role
      };
  
      try {
        await signupRequest({ email });
        navigate('/verify-otp', { state: { email, userData, purpose: 'account-activation' } });
      } catch (error) {
        setError(error.message || 'An error occurred during signup.');
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
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <h3>Sign Up</h3>
          <div className="mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Please enter your full Name"
              value={full_name}
              onChange={(e) => setFull_name(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="text-right">
            Already registered? <Link to={'/login'}>Login</Link>
          </p>
          </>
        )}
        </form>
      </div>
    </div>
  );
};
export default Signup;
