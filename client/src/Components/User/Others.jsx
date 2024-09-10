import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

const UserIndex = () => {
  const navigate = useNavigate();

    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSpecifyClick = () => {
        if (showInput) {
            // Handle submit logic here if inputValue is not empty
            if (inputValue) {
                console.log('Submitted:', inputValue);
                setSubmitted(true); // Set the submitted state to true
                setShowInput(false); // Hide the input field
                navigate('/submission-success');
            }
        } else {
            setShowInput(true);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleBackClick = () => {
        navigate('/user-emergency-type');
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