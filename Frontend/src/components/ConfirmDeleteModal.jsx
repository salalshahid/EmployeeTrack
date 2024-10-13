import React from 'react';
import Modal from 'react-modal';
import { deleteLog } from '../api/timeLogging';
import { deleteProject } from '../api/projects';
import { deleteTeam } from '../api/teams';

const ConfirmDeleteModal = ({ isVisible, toggleVisibility, setSuccess, itemId, itemType }) => {
  const handleDelete = async () => {
    try {
      if (itemType == 'log') {
        await deleteLog(itemId);
      } else if (itemType == 'project') {
        await deleteProject(itemId);
      } else {
        await deleteTeam(itemId);
      }

      setSuccess(`${itemType} has been deleted!`);
      toggleVisibility(false);
    } catch (error) {
      // Assuming you have a way to show error, adapt as needed
      console.error(`Error deleting ${itemType}:`, error);
      setSuccess(false);
      toggleVisibility(false);
    }
  };

  return (
    <Modal isOpen={isVisible} onRequestClose={() => toggleVisibility(false)} className="auth-wrapper">
      <div className="auth-inner">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this {itemType}?</p>
        <div className="btn-toolbar justify-content-center">
          <button onClick={handleDelete} className="btn btn-danger mx-1">
            Delete
          </button>
          <button onClick={() => toggleVisibility(false)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;