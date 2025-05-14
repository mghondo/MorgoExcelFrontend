import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
// eslint-disable-next-line
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';

// Custom CSS to style the date picker
const customStyles = `
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    background-color: white; /* Explicitly set to white to match other inputs */
  }
  .react-datepicker__input-container input:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const ExpirationDatePicker = ({ value, onChange, isInvalid }) => {
  // Parse the initial value (if any) into a Date object
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (value) {
      // Parse the MM/DD/YYYY format into a Date object
      const parsedDate = parse(value, 'MM/dd/yyyy', new Date());
      if (!isNaN(parsedDate)) {
        setSelectedDate(parsedDate);
      }
    } else {
      // Set to current date if no value is provided
      setSelectedDate(new Date());
    }
  }, [value]);

  const handleDateChange = (date) => {
    if (date) {
      // Format the selected date as MM/DD/YYYY
      const formattedDate = format(date, 'MM/dd/yyyy');
      setSelectedDate(date);
      onChange(formattedDate);
    } else {
      setSelectedDate(null);
      onChange('');
    }
  };

  const handleInputChange = (e) => {
    // onChangeRaw is called for both manual input and calendar selection
    // Only process if e.target.value is a valid string (manual input)
    if (e && e.target && typeof e.target.value === 'string') {
      const input = e.target.value;
      onChange(input); // Update the parent state with the raw input

      // Try to parse the input as MM/DD/YYYY
      const parsedDate = parse(input, 'MM/dd/yyyy', new Date());
      if (!isNaN(parsedDate)) {
        setSelectedDate(parsedDate);
      } else {
        // If parsing fails, try a more lenient format (e.g., M/D/YYYY)
        const parts = input.split('/');
        if (parts.length === 3) {
          const month = parts[0].padStart(2, '0');
          const day = parts[1].padStart(2, '0');
          const year = parts[2];
          const formattedInput = `${month}/${day}/${year}`;
          const lenientParsedDate = parse(formattedInput, 'MM/dd/yyyy', new Date());
          if (!isNaN(lenientParsedDate)) {
            setSelectedDate(lenientParsedDate);
            onChange(formattedInput); // Update with the padded format
          }
        }
      }
    }
    // If e.target.value is not a string (e.g., calendar selection), do nothing
    // onChange will handle the date selection
  };

  return (
    <>
      <style>{customStyles}</style>
      <DatePicker
        id="expirationDateInput" // Add an id to the DatePicker input
        selected={selectedDate}
        onChange={handleDateChange}
        onChangeRaw={handleInputChange}
        dateFormat="MM/dd/yyyy"
        placeholderText="MM/DD/YYYY"
        className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
        minDate={new Date()} // Start from current date
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </>
  );
};

export default ExpirationDatePicker;