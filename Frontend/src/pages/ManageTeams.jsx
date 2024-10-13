import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchTeams, deleteTeam } from '../api/teams';
import { useAuth } from '../contexts/AuthContext';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const ManageTeams = () => {
    const { isAdmin } = useAuth();
    const [teams, setTeams] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentTeamId, setCurrentTeamId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const loadTeams = async () => {
        setIsLoading(true);
        try {
            const response = await fetchTeams();
            setTeams(response);
        } catch (error) {
            setError('Unable to fetch teams. Please try again later.');
        } finally {
            setIsLoading(false);
        }
      };

      loadTeams();
    }, [success]);

    const handleNavigateToCreateTeam = () => {
      navigate('/create-team');
    };

    const handleEditTeam = (teamId) => {
        navigate(`/edit-team/${teamId}`);
    };

    const handleDeleteTeam = (teamId) => {
      setCurrentTeamId(teamId);
      setShowDeleteModal(true);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex flex-column align-items-center justify-content-center mb-3">
                <h2>Manage Teams</h2>
                { isAdmin ?
                <button className="btn btn-primary" onClick={handleNavigateToCreateTeam}>
                  <FaPlus /> Create New Team
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
                                <th>Team Name</th>
                                <th>Members</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map(team => (
                                <tr key={team._id}>
                                    <td>{team.name}</td>
                                    <td>
                                        {team.members.map(member => (
                                            <span key={member._id} className="badge bg-primary me-1">
                                                {member.full_name}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditTeam(team._id)}>
                                            <FaEdit />
                                        </button>
                                        {isAdmin && (
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTeam(team._id)}>
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
          itemId={currentTeamId}
          deleteFunction={deleteTeam}
          itemType={"team"}
          setSuccess={setSuccess}
        />
        </div>
    );
};

export default ManageTeams;