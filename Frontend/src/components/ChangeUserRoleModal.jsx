import React, { useState } from 'react';
import Modal from 'react-modal';
import { changeUserRole } from '../api/users'; // Ensure this API is correctly implemented
import Loader from './Loader';

const ChangeUserRoleModal = ({ isVisible, toggleVisibility, userId, updateSuccess }) => {
  const [isLoading, setLoading] = useState(false);
  const [role, setRole] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await changeUserRole(userId, { role });
      updateSuccess(`User role updated to ${role}.`);
      toggleVisibility(false);
    } catch (error) {
      updateSuccess(`Error updating role: ${error.message}`);
      toggleVisibility(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={() => toggleVisibility(false)}
      contentLabel="Change User Role"
      className="auth-wrapper"
    >
      <div className="auth-inner">
        {isLoading && <Loader/>}
        <h3>Change User Role</h3>
        <select value={role} onChange={e => setRole(e.target.value)} className="form-control">
          <option value="">Select New Role</option>
          <option value="administrator">Administrator</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
        <div className="btn-toolbar justify-content-center m-3">
          <button onClick={handleSubmit} className="btn btn-success mx-2">
            Update Role
          </button>
          <button onClick={() => toggleVisibility(false)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeUserRoleModal;