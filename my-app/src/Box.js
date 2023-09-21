import React from 'react';

const Boxes = ({ date, booked, disabled, onBook }) => {
  const today = new Date().toISOString().split('T')[0];
  const isPastDate = date < today;

  return (
    <div className={`box ${booked ? 'booked' : ''}`}>
      <p className="date">{date}</p>
      {isPastDate ? (
        <button className="not-available" disabled>
          Not Available
        </button>
      ) : (
        <button className="book-button" disabled={disabled} onClick={onBook}>
          {booked ? 'Booked' : 'Book'}
        </button>
      )}
    </div>
  );
};

export default Boxes;









