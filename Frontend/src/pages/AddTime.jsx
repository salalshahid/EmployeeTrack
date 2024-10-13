import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { logTime } from '../api/timeLogging';
import { fetchAssignedProjects } from '../api/projects';

const AddTime = () => {
  // State management for form inputs
  const [listOfProjects, setListOfProjects] = useState([]); // For storing the list of projects
  const [project, setProject] = useState(''); // For storing the selected project's ID
  const [date, setDate] = useState(new Date()); // For storing the date
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await fetchAssignedProjects();
        if (projectsResponse && projectsResponse.length) {
          setListOfProjects(projectsResponse);
          setProject(projectsResponse[0]._id); // Set the first project as the selected one, ensure projects[0] exists
        } else {
          setError(error.message || 'You are currently not a part of any project.');
        }
      } catch (error) {
        console.log(error);
        if (error.detail == 'No projects found') {
          setError('You are currently not a part of any project.');
        } else {
          setError(error.message || 'Failed to load data. Please try again after some time!');
        }
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setSuccess('');
    setIsLoading(true); // Start loading

    try {
      if (!startTime && !endTime) {
        // Update the error state to show an error message
        setError('Start Time and End Time are required.');
        return;
      }

      if (!project) {
        setError('Please select a project from the list.');
        return;
      }

      const APIdata = {
        project,
        date: date.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
        start_time: `${startTime.getHours()}:${startTime.getMinutes()}`,
        end_time: `${endTime.getHours()}:${endTime.getMinutes()}`,
        notes
      };

      await logTime(APIdata);
      // If Successful
      setSuccess(true);
      setTimeout(() => {
        navigate('/time-logs');
      }, 1000);
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again');
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="auth-wrapper bg-image" style={{ backgroundImage: `url(./images/bg-image.jpg)` }}>
      <div className="auth-inner">
        {listOfProjects ? (<form onSubmit={handleSubmit}>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {success && <div className="alert alert-success">Time Logged Successfully</div>}
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <h3>Log Time for a Project</h3>
              <div className="mb-3">
                <label htmlFor="role-select" className="form-label">Project</label>
                <select
                  name="Select Project"
                  id="role-select"
                  className="form-select"
                  value={project}
                  onChange={(e) => {
                    setProject(e.target.value);
                  }}
                >
                  {listOfProjects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="date-picker" className="form-label">Date</label>
                <DatePicker
                  id="date-picker"
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>Notes</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter a small description"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  Start Time:
                  <DatePicker
                    selected={startTime}
                    onChange={(date) => {
                      setStartTime(date);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15} // Interval of time selection
                    timeCaption="Time"
                    dateFormat="HH:mm" // 24-hour format
                    className="form-control"
                  />
                </label>
              </div>
              <div className="mb-3">
                <label>
                  End Time:
                  <DatePicker
                    selected={endTime}
                    onChange={(date) => setEndTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15} // Interval of time selection
                    timeCaption="Time"
                    dateFormat="HH:mm" // 24-hour format
                    className="form-control"
                  />
                </label>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </>
          )}
        </form>) : <div className="alert alert-danger" role="alert">{error}</div>}
      </div>
    </div>
  );
};

export default AddTime;