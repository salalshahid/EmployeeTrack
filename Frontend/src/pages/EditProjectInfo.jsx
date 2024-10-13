import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProjectData, editProjectDetails } from '../api/projects'; // API functions to fetch and update project
import { fetchUsers } from '../api/users';
import { fetchTeams } from '../api/teams';

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [listOfTeams, setListOfTeams] = useState([]);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryOptions] = useState(['Software Development', 'Finance', 'HR']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projectData = await fetchProjectData(projectId);
        console.log(projectData);
        setName(projectData.name);
        setCode(projectData.code);
        setDescription(projectData.description);
        setSelectedTeams(projectData.teams.map(team => team._id));
        setSelectedUsers(projectData.users.map(user => user._id));
        setSelectedCategories(projectData.categories.map(category => category.name));
        
        const usersList = await fetchUsers();
        setListOfUsers(usersList);

        const teamsList = await fetchTeams();
        setListOfTeams(teamsList);
      } catch (error) {
        setError('Failed to load data. Please try again after some time!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleSelectChange = (event, setter, currentSelection) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    const newSelection = [...new Set([...currentSelection, ...selectedOptions])];
    setter(newSelection);
  };

  const handleRemoveItem = (item, setter, list) => {
    const newList = list.filter(i => i !== item);
    setter(newList);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const requestBody = {
      name,
      code,
      description,
      users: selectedUsers,
      teams: selectedTeams,
      categories: selectedCategories,
    };

    try {
      await editProjectDetails(projectId, requestBody);
      setSuccess(true);
      setTimeout(() => {
        navigate('/manage-projects');
      }, 1000);
    } catch (error) {
      setError('An error occurred. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="project-form-wrapper">
      <div className="project-form-inner">
        <form onSubmit={handleSubmit}>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {success && <div className="alert alert-success">Project Updated Successfully</div>}
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <h3>Edit Project</h3>
              <div className="row mb-2">
                <div className="col-md-6 mb-3">
                  <label>Project Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name of the project"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Project Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter a codename for project"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6 mb-3">
                  <label>Project Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter project description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="category-select" className="form-label">Project Categories:</label>
                  <select
                    id="category-select"
                    className="form-select"
                    multiple
                    value={selectedCategories}
                    onChange={(e) => handleSelectChange(e, setSelectedCategories, selectedCategories)}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    {selectedCategories.map((category) => (
                      <span key={category} className="badge bg-primary me-2">
                        {category}
                        <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-1"
                          onClick={() => handleRemoveItem(category, setSelectedCategories, selectedCategories)}
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6 mb-3">
                  <label htmlFor="team-select" className="form-label">Assign To Teams:</label>
                  <select
                    id="team-select"
                    className="form-select"
                    multiple
                    value={selectedTeams}
                    onChange={(e) => handleSelectChange(e, setSelectedTeams, selectedTeams)}
                  >
                    {listOfTeams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    {selectedTeams.map((teamId) => {
                      const team = listOfTeams.find((t) => t._id === teamId);
                      return (
                        <span key={teamId} className="badge bg-primary me-2">
                          {team?.name}
                          <button
                            type="button"
                            className="btn-close btn-close-white btn-sm ms-1"
                            onClick={() => handleRemoveItem(teamId, setSelectedTeams, selectedTeams)}
                          ></button>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="user-select" className="form-label">Assign To Users:</label>
                  <select
                    id="user-select"
                    className="form-select"
                    multiple
                    value={selectedUsers}
                    onChange={(e) => handleSelectChange(e, setSelectedUsers, selectedUsers)}
                  >
                    {listOfUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    {selectedUsers.map((userId) => {
                      const user = listOfUsers.find((u) => u._id === userId);
                      return (
                        <span key={userId} className="badge bg-primary me-2">
                          {user?.full_name}
                          <button
                            type="button"
                            className="btn-close btn-close-white btn-sm ms-1"
                            onClick={() => handleRemoveItem(userId, setSelectedUsers, selectedUsers)}
                          ></button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Update Project
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProject;