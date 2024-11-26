import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import UserLogout from '../../UserLogout';

const UserIndex = () => {
  const navigate = useNavigate();

  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSpecifyClick = async () => {
    if (showInput) {
      if (inputValue) {
        try {
          const response = await axios.post('http://localhost:8081/api/reports', {
            description: inputValue,
            type: 'Others'
          }, {
            withCredentials: true // Include credentials in the request
          });
          console.log('Submitted:', inputValue);
          setSubmitted(true);
          setShowInput(false);
          navigate('/user/submission-success');
        } catch (error) {
          console.error('Error submitting report:', error);
        }
      }
    } else {
      setShowInput(true);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBackClick = () => {
    navigate('/user/emergency-type');
  };

  return (
    <div className="index-responder-body">
      <UserLogout />

      <div className="index-tabs-responder">
        <p className="et-question">WHAT KIND OF EMERGENCY?</p>
        <div className="buttons-container">
          {showInput ? (
            <div className="input-container">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type here..."
              />
              <button className="submit-btn" onClick={handleSpecifyClick}>
                Submit
              </button>
            </div>
          ) : (
            <button className="specify-ii-btn" onClick={handleSpecifyClick}>
              {submitted ? 'Submitted' : 'Specify Emergency'}
            </button>
          )}
          <button className="back-btn" onClick={handleBackClick}>Back</button>
        </div>
      </div>

      <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
    </div>
  );
};

export default UserIndex;