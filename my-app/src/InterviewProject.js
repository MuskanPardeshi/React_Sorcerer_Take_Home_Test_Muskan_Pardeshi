import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Box from './Box';
import ConfirmationPage from './ConfirmationPage';
import OceanEffect from './OceanEffect';
import './InterviewProject.css';

const InterviewProject = () => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('week'));
  const [numWeeksDisplayed, setNumWeeksDisplayed] = useState(1); // Number of weeks displayed
  const [showPreviousButton, setShowPreviousButton] = useState(false); // Track visibility of previous button
  const [showNextButton, setShowNextButton] = useState(true); // Track visibility of next button

  useEffect(() => {
    const initialDates = generateCurrentWeekDates(currentWeekStart);
    setDates(initialDates);
  }, [currentWeekStart]);

  useEffect(() => {
    // Update the visibility of the previous button based on the number of weeks displayed
    setShowPreviousButton(numWeeksDisplayed > 1);
  }, [numWeeksDisplayed]);

  useEffect(() => {
    // Update the visibility of the next button based on the number of weeks displayed
    setShowNextButton(numWeeksDisplayed < 2);
  }, [numWeeksDisplayed]);

  const generateCurrentWeekDates = (weekStart) => {
    const startOfWeek = weekStart.clone();
    const endOfWeek = weekStart.clone().endOf('week');

    const dates = [];
    let date = startOfWeek.clone().subtract(1, 'day');

    while (date.isBefore(endOfWeek, 'day')) {
      date.add(1, 'day');

      if (date.day() !== 0) {
        const formattedDate = date.format('YYYY-MM-DD');
        const booked = false;
        dates.push({ date: formattedDate, booked });
      }
    }

    return dates;
  };

  const handleBook = (index) => {
    const selected = dates[index];
    setSelectedDate({ ...selected, index });
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    const updatedDates = dates.map((date, index) =>
      index === selectedDate.index ? { ...date, booked: true } : date
    );

    setDates(updatedDates);

    setSelectedDate(null);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setShowConfirmation(false);
  };

  const handleNextWeek = () => {
    if (numWeeksDisplayed < 2) {
      const nextWeekStart = currentWeekStart.clone().add(1, 'week');
      setCurrentWeekStart(nextWeekStart);
      setNumWeeksDisplayed(numWeeksDisplayed + 1);
    }
  };

  const handlePreviousWeek = () => {
    if (numWeeksDisplayed > 1) {
      const previousWeekStart = currentWeekStart.clone().subtract(1, 'week');
      setCurrentWeekStart(previousWeekStart);
      setNumWeeksDisplayed(numWeeksDisplayed - 1);
    }
  };

  return (
    <div className="ocean-background">
      <div className="container">
        {showConfirmation ? (
          <ConfirmationPage
            date={selectedDate ? selectedDate.date : ''}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <h1 className="title">Interview Dates</h1>
            <div className="box-container">
              {dates.map((date, index) => (
                <Box
                  key={index}
                  date={date.date}
                  booked={date.booked}
                  disabled={date.booked}
                  onBook={() => handleBook(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <OceanEffect />
      {showPreviousButton && (
        <button className="button-previous" onClick={handlePreviousWeek}>&lt; &lt; Previous</button>
      )}
      {showNextButton && (
        <button className="button-next" onClick={handleNextWeek}>Next > ></button>
      )}
    </div>
  );
};

export default InterviewProject;
