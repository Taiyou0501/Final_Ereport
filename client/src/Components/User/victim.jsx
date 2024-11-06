import '../CSS/user.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLogout from '../../UserLogout';

const VictimName = () => {
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
                navigate('/user/submission-success');
            }
        } else {
            setShowInput(true);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSkipClick = () => {
        navigate('/user/submission-success');
    };

    return (
        <div className="index-responder-body">
            <UserLogout />

            <div className="index-tabs-responder">
                <p className="et-question">WHO IS THE VICTIM?</p>
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
                            {submitted ? 'Submitted' : 'Specify Name'}
                        </button>
                    )}
                    <button className="idk-btn" onClick={handleSkipClick}>I Don't Know (Skip)</button>
                </div>
            </div>

            <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
        </div>
    );
};

export default VictimName;
