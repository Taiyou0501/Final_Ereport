import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import api from '../../config/axios';
import UserLogout from '../../UserLogout';

const Individual = () => {
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSpecifyClick = async () => {
    if (showInput) {
      if (inputValue) {
        try {
          const response = await api.post('/api/reports', {
            description: inputValue,
            type: 'Injured Individual'
          });
          console.log('Submitted:', inputValue);
          setSubmitted(true);
          setShowInput(false);
          navigate('/user/victim');
        } catch (error) {
          console.error('Error submitting report:', error);
        }
      }
    } else {
      setShowInput(true);
    }
  };
  
  const handleSkipClick = async () => {
    try {
      const response = await api.post('/api/reports', {
        description: 'Did not specify',
        type: 'Injured Individual'
      });
      console.log('Submitted: Did not specify');
      setSubmitted(true);
      navigate('/user/submission-success');
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="index-responder-body">
      <UserLogout />

      <div className="index-tabs-responder">
        <p className="et-question">WHAT KIND OF INJURY?</p>
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
              {submitted ? 'Submitted' : 'Specify Injury'}
            </button>
          )}
          <button className="idk-btn" onClick={handleSkipClick}>I Don't Know (Skip)</button>
        </div>
      </div>

      <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
    </div>
  );
};

export default Individual;