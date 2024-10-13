import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../api/users';
import { fetchEmployeeLogs, remindEmployeeToSubmitLog } from '../api/timeLogging';
import { triggerDownload } from '../utils/fileDownload';

const ManageLogReports = () => {
  // State management for form inputs
  const [employeeId, setEmployeeId] = useState('');
  const [interval, setInterval] = useState('day');
  const [listOfUsers, setListOfUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const usersList = await fetchUsers();

        if (usersList) {
            setListOfUsers(usersList);
            setEmployeeId(usersList[0]._id);
        }
      } catch (error) {
        setError(error.message || 'Failed to load data. Please try again after some time!');
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
      }
    }

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setSuccess('');
    setIsLoading(true); // Start loading
      try {
        const requestBody = {
            employeeId,
            interval
        };

        const blob = await fetchEmployeeLogs(requestBody);
        await triggerDownload(blob);
        // After successful file download
        setSuccess("Download Started...");
      } catch (error) {
        setError(error.message || 'An error occurred. Please try again');
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
      }
    };

  const handleRemindEmployee = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setSuccess('');
    setIsLoading(true); // Start loading
    try {
      await remindEmployeeToSubmitLog(employeeId);
      // After successful file download
      setSuccess("Employee has been notified!");
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again');
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
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <h3>Manage Log Reports</h3>
            <div className="mb-3">
              <label htmlFor="employeeId-select" className="form-label">&nbsp;Select An Employee&nbsp;</label>
              <select
                id="employeeId-select"
                className="employeeId-select"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              >
                {listOfUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.full_name}
                    </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="interval-select" className="form-label">&nbsp;Select Interval&nbsp;</label>
                <select
                  id="interval-select"
                  className="interval-select"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                >
                  <option value="day">Daily</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Download Log Report
              </button>
            </div>
            <div className="d-grid mt-3">
              <button className="btn btn-info" onClick={handleRemindEmployee}>
                Ask Employee to Submit Logs
              </button>
            </div>
          </>
        )}
        </form>
      </div>
    </div>
  );
};
export default ManageLogReports;
