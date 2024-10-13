import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signup, verifyOTP } from '../api/users';

const VerifyOTP = () => {
    const location = useLocation();
    const { email, purpose, userData } = location.state || {};
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      if (name === 'otp') {
        setOtp(value);
      }
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsLoading(true);
      try {
        console.log(email);
        await verifyOTP({ email, otp, purpose });
        if (purpose == 'reset-password') {
          setMessage('OTP verified successfully.');
          setError('');  
          navigate('/reset-password', { state: { email } }); // Pass the email to the NewPassword component
        } else {
          await signup(userData);
          setMessage('Account has been activated successfully.');
          setError('');
          navigate('/login', { success: true });
        }
      } catch (error) {
        setError('Failed to verify OTP. Please try again.');
        setMessage('');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="auth-wrapper bg-image" style={{ backgroundImage: `url(./images/bg-image.jpg)` }}>
        <div className="auth-inner">
          <form onSubmit={handleSubmit}>
            <h3>Verify OTP</h3>
            <div className="mb-3">
              <label>OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                name="otp"
                value={otp}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Verify OTP'}
              </button>
            </div>
            {message && <div className="alert alert-success" role="alert">{message}</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
          </form>
        </div>
      </div>
    );
  };
  
  export default VerifyOTP;