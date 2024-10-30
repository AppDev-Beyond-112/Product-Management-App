import React from "react";
import '../Custom CSS/DeleteConfirmation.css'; 

const DeleteConfirmation = ({ onClose, onConfirm }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h4>Are you sure you want to delete this item?</h4>
        <div className="modal-actions">
          <button className="modal-button confirm" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
