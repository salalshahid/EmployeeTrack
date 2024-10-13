import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { editLog } from '../api/timeLogging';
import { combineDateTime } from '../utils/moment';
import Modal from 'react-modal';
Modal.setAppElement('#root');

const EditTimeLog = ({ isVisible, toggleVisibility, setSuccess, LogId, logDate, StartTime, EndTime, Notes }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logId, setLogId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setLogId(LogId);
    setDate(new Date(logDate));
    setStartTime(new Date(combineDateTime(logDate, StartTime)));
    setEndTime(new Date(combineDateTime(logDate, EndTime)));
    setNotes(Notes);
  }, [isVisible]);
  
  const handleSubmit = async(event) => {
    event.preventDefault();
    setSuccess(false);
    setError('');
    setLoading(true);
    try {
      const data = {
        start_time: `${startTime.getHours()}:${startTime.getMinutes()}`,
        end_time: `${endTime.getHours()}:${endTime.getMinutes()}`,
        notes,
        date: new Date(date).toISOString().slice(0, 10)
      };
  
      await editLog(logId, data);
      setSuccess("Time log edited successfully");
      toggleVisibility(false);
    } catch (error) {
      setError(error.message || 'Some error occurred. Try again after sometime.');
    } finally {
      setLoading(false);
    }
  }  

  return (
    <Modal isOpen={isVisible} onRequestClose={() => toggleVisibility(false)} className="auth-wrapper">
      <div className="auth-inner">
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (<>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <h3>Edit Time Log</h3>
          <div className="mb-3">
            <label>
              Start Time:
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15} // Interval of time selection
                timeCaption="Time"
                dateFormat="HH:mm" // 24-hour format
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
              />
            </label>
          </div>
          <div className="mb-3">
            <label>
              Date:
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
              />
            </label>
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
          <div className="btn-toolbar justify-content-center">
            <button type="submit" className="btn btn-primary mx-1">
              Submit
            </button>
            <button className="btn btn-danger" onClick={() => toggleVisibility(false)}>Close</button>
          </div>
        </form>
        </>
      )}
      </div>
    </Modal>
  );
};

export default EditTimeLog;