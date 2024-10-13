import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import EditTimeLog from '../components/EditTimeLog';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';  // Import the ConfirmDelete modal
import { fetchTimeLogs, deleteLog } from '../api/timeLogging'; // Assuming deleteLog is the function to call for deletion

const TimeLogs = () => {
  const [showEditlogModal, setShowEditlogModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timeLogs, setTimeLogs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLogId, setCurrentLogId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadTimeLogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTimeLogs();
        setTimeLogs(response);
        setError('');
      } catch (error) {
        setError('Unable to fetch time logs. Please try again later.');
        console.error('Error fetching time logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTimeLogs();
  }, [success]);

  const handleNavigateToAddTime = () => {
    navigate('/add-time');
  };

  const handleEditLog = (log) => {
    setShowEditlogModal(true);
    setCurrentLogId(log._id);
    // Assuming log.date, log.start_time etc. are the correct fields
    setDate(log.date);
    setStartTime(log.start_time);
    setEndTime(log.end_time);
    setNotes(log.notes);
  };

  const handleRemoveLog = (logId) => {
    setCurrentLogId(logId);
    setShowDeleteModal(true);
  };

  const handleDeleteLog = async (logId) => {
    try {
      await deleteLog(logId);
      setSuccess('Log deleted successfully!');
      setShowDeleteModal(false);
      // Trigger a re-fetch or update of the logs
      const updatedLogs = timeLogs.filter(log => log._id !== logId);
      setTimeLogs(updatedLogs);
    } catch (error) {
      setError('Failed to delete the log. Please try again.');
      console.error('Error deleting log:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column align-items-center justify-content-center mb-3">
        <h2>Time Logs</h2>
        <button className="btn btn-primary" onClick={handleNavigateToAddTime}>
          <FaPlus /> Add Time
        </button>
      </div>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="table-responsive" style={{ maxWidth: '90%', margin: '0 auto', overflow: 'auto' }}>
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Project</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Hours Worked</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeLogs.length > 0 ? timeLogs.map((log) => (
                <tr key={log.notes}>
                  <td>{log.project.name}</td>
                  <td>{log.date}</td>
                  <td>{log.start_time}</td>
                  <td>{log.end_time}</td>
                  <td>{log.hours_worked}</td>
                  <td>{log.notes}</td>
                  <td>
                    <a href="#" onClick={() => handleEditLog(log)} className="btn btn-sm btn-primary me-2">
                      <FaEdit />
                    </a>
                    <a href="#" onClick={() => handleRemoveLog(log._id)} className="btn btn-sm btn-danger">
                      <FaTrash />
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center">No time logs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <EditTimeLog
        isVisible={showEditlogModal}
        toggleVisibility={setShowEditlogModal}
        setSuccess={setSuccess}
        LogId={currentLogId}
        StartTime={startTime}
        EndTime={endTime}
        logDate={date}
        Notes={notes}
      />
      <ConfirmDeleteModal
        isVisible={showDeleteModal}
        toggleVisibility={setShowDeleteModal}
        onDelete={handleDeleteLog}
        itemId={currentLogId}
        itemType={"log"}
        setSuccess={setSuccess}
      />
    </div>
  );
};

export default TimeLogs;