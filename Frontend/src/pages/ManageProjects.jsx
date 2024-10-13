import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchAllProjects } from '../api/projects'; // API functions to fetch, edit, and delete projects
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useAuth } from '../contexts/AuthContext';

const ManageProjects = () => {
    const { isAdmin } = useAuth();
    const [projects, setProjects] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const loadProjects = async () => {
        setIsLoading(true);
        try {
            const response = await fetchAllProjects();
            setProjects(response);
        } catch (error) {
            setError('Unable to fetch projects. Please try again later.');
        } finally {
            setIsLoading(false);
        }
      };

      loadProjects();
    }, [success]); // Refetch on changes to success to reflect updates

    const handleNavigateToCreateProject = () => {
      navigate('/create-project');
    };

    const handleEditProject = (projectId) => {
        navigate(`/edit-project/${projectId}`); // Assuming you have a route to edit projects
    };

    const handleDeleteProject = (projectId) => {
      setCurrentProjectId(projectId);
      setShowDeleteModal(true);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex flex-column align-items-center justify-content-center mb-3">
                <h2>Manage Projects</h2>
                { isAdmin ?
                <button className="btn btn-primary" onClick={handleNavigateToCreateProject}>
                  <FaPlus /> Create New Project
                </button> : null}
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
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Assigned Teams</th>
                                <th>Individual members</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project._id}>
                                    <td>{project.name}</td>
                                    <td>{project.description}</td>
                                    <td>
                                        {project.teams.map(team => (
                                            <span key={team._id} className="badge bg-primary me-1">
                                                {team.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        {project.users.map(user => (
                                            <span key={user._id} className="badge bg-secondary me-1">
                                                {user.full_name}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditProject(project._id)}>
                                            <FaEdit />
                                        </button>
                                        {isAdmin && (
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProject(project._id)}>
                                                <FaTrash />
                                            </button>                                        
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        <ConfirmDeleteModal
          isVisible={showDeleteModal}
          toggleVisibility={setShowDeleteModal}
          itemId={currentProjectId}
          itemType={"project"}
          setSuccess={setSuccess}
        />
        </div>
    );
};

export default ManageProjects;