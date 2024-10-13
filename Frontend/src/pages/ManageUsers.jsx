import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaUserSlash } from 'react-icons/fa';
import { fetchUsers, toggleUserStatus } from '../api/users';
import ChangeUserRoleModal from '../components/ChangeUserRoleModal';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError('Unable to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, [success]);

  const changeUserAccountStatus = async (userId, status) => {
    try {
      setIsLoading(true);
      setSuccess("User account status has been changed.");
      await toggleUserStatus(userId, { status });
      const updatedUsers = users.map(user =>
        user._id === userId ? { ...user, is_active: !user.is_active } : user
      );
      setUsers(updatedUsers);
    } catch (err) {
      setError('Failed to update user status. Please try again.');
      console.error('Error updating user status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRoleClick = (userId) => {
    setSelectedUserId(userId);
    setIsRoleModalVisible(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column align-items-center justify-content-center mb-3">
        <h2>Manage Users</h2>
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
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button 
                      className={`btn ${user.is_active ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => changeUserAccountStatus(user._id, !user.is_active)}
                    >
                      {user.is_active ? <FaUserSlash /> : <FaUserEdit />} 
                      {user.is_active ? ' Disable User' : ' Enable User'}
                    </button>
                    <button 
                      className="btn btn-info ms-2"
                      onClick={() => handleEditRoleClick(user._id)}
                    >
                      <FaUserEdit /> Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isRoleModalVisible && (
        <ChangeUserRoleModal
          isVisible={isRoleModalVisible}
          toggleVisibility={setIsRoleModalVisible}
          userId={selectedUserId}
          updateSuccess={setSuccess}
        />
      )}
    </div>
  );
};

export default ManageUsers;