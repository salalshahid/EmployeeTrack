import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamData, updateTeamData } from '../api/teams';
import { fetchUsers } from '../api/users';

const EditTeamInfo = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersList = await fetchUsers();
        const teamData = await fetchTeamData(teamId);

        if (usersList) {
          setListOfUsers(usersList);
        }

        console.log(teamData.members);

        if (teamData) {
          setName(teamData.name);
          setSelectedMembers(teamData.members.map(member => member._id));
        }
      } catch (error) {
        setError(error.message || 'Failed to load data. Please try again after some time!');
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchData();
  }, [teamId]);

  const handleSelectChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    const newSelection = [...new Set([...selectedMembers, ...selectedOptions])];
    setSelectedMembers(newSelection);
  };

  const handleRemoveMember = (member) => {
    const newMembers = selectedMembers.filter(m => m !== member);
    setSelectedMembers(newMembers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true); // Start loading

    const requestBody = {
      name,
      members: selectedMembers,
    };

    try {
      await updateTeamData(teamId, requestBody);
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
              {success && <div className="alert alert-success">Team Updated Successfully</div>}
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <h3>Edit Team</h3>
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
                <label htmlFor="member-select" className="form-label">Team Members</label>
                <select
                  id="member-select"
                  className="form-select"
                  multiple
                  value={selectedMembers}
                  onChange={handleSelectChange}
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
                  Update Team
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditTeamInfo;