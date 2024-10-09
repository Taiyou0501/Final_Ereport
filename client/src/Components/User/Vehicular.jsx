import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import axios from 'axios';

const UserIndex = () => {
  const navigate = useNavigate(); // Initialize navigate for routing

  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSpecifyClick = async () => {
    if (showInput) {
      if (inputValue) {
        try {
          await axios.post('http://localhost:8081/api/reports', {
            description: inputValue + ' vehicles involved',
            type: 'Vehicular Accident'
          });
          console.log('Submitted:', inputValue);
          setSubmitted(true);
          setShowInput(false);
          // Redirect to a different route, e.g., /submission-success
          navigate('/submission-success');
        } catch (error) {
          console.error('Error submitting report:', error);
        }
      }
    } else {
      setShowInput(true);
    }
  };

  const handleInputChange = (e) => {
    // Restrict input to numbers only using a regex
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleSkipClick = async () => {
    try {
      await axios.post('http://localhost:8081/api/reports', {
        description: 'Did not specify',
        type: 'Vehicular Accident'
      });
      console.log('Submitted: Did not specify');
      setSubmitted(true);
      navigate('/submission-success');
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="index-responder-body">
      <header className="index-responder-header">
        <div className="index-main-text">E-REPORT</div>
      </header>
      <header className="index-header-tab">
        <button className="index-menu-btn">
          <FontAwesomeIcon icon={faBars} />
          <span className="index-menu-text">HELLO, REPORTER</span>
        </button>
        <div className="index-responder-actions">
          <button className="index-profile-btn">
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className="index-logout-btn" onClick={() => navigate('/login')}>
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      </header>

      <div className="index-tabs-responder">
        <p className="et-question">HOW MANY VEHICLES ARE INVOLVED?</p>
        <div className="buttons-container">
          {showInput ? (
            <div className="input-container">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type numbers only..."
                pattern="\d*"
              />
              <button className="submit-btn" onClick={handleSpecifyClick}>
                Submit
              </button>
            </div>
          ) : (
            <button className="specify-ii-btn" onClick={handleSpecifyClick}>
              {submitted ? 'Submitted' : 'Specify'}
            </button>
          )}
          <button className="idk-btn" onClick={handleSkipClick}>I Don't Know (Skip)</button>
        </div>
      </div>

      <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
    </div>
  );
};

export default UserIndex;