import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../api/users';
import { createTeam } from '../api/teams';

const CreateTeam = () => {
  // State management for form inputs
  const [name, setName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersList = await fetchUsers();
        if (usersList) setListOfUsers(usersList);
      } catch (error) {
        setError(error.message || 'Failed to load data. Please try again after some time!');
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchData();
  }, []);

  // Add the selected user to the team members list
  const handleAddMember = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    const newSelection = [...new Set([...selectedMembers, ...selectedOptions])];
    setSelectedMembers(newSelection);
  };

  // Remove a member from the team members list
  const handleRemoveMember = (member) => {
    const newMembers = selectedMembers.filter(m => m !== member);
    setSelectedMembers(newMembers);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true); // Start loading

    const requestBody = {
      name,
      members: selectedMembers,
    };

    try {
      await createTeam(requestBody);
      // After successful team creation
      setSuccess(true);
      setTimeout(() => {
        navigate('/manage-teams');
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
        <form onSubmit={handleSubmit}>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {success && <div className="alert alert-success">New Team Created Successfully</div>}
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <h3>Create Team</h3>
              <div className="mb-3">
                <label>Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name of the team"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="member-select" className="form-label">Add Members</label>
                <select
                  id="member-select"
                  className="form-select"
                  multiple
                  value={selectedMembers}
                  onChange={handleAddMember}
                >
                  {listOfUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  {selectedMembers.map((memberId) => {
                    const member = listOfUsers.find((u) => u._id === memberId);
                    return (
                      <span key={memberId} className="badge bg-primary me-2">
                        {member?.full_name}
                        <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-1"
                          onClick={() => handleRemoveMember(memberId)}
                        ></button>
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Create new Team
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;