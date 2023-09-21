import React from 'react';

const ConfirmationPage = ({ date, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-page">
      <h2 className="confirmation-message">
        Are you sure you want to confirm the {date}?
      </h2>
      <div className="confirmation-buttons">
        <button className="book-button" onClick={onConfirm}>
          Yes
        </button>
        <button className="book-button" onClick={onCancel}>
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
