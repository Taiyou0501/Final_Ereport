import '../CSS/user.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLogout from '../../UserLogout';
import api from '../../config/axios';

const VictimName = () => {
    const navigate = useNavigate();

    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSpecifyClick = async () => {
        if (showInput) {
            if (inputValue) {
                try {
                    const response = await api.post('/api/update-victim-name', { victim_name: inputValue });
                    if (response.status === 200) {
                        console.log('Submitted:', inputValue);
                        setSubmitted(true);
                        setShowInput(false);
                        navigate('/user/submission-success');
                    }
                } catch (error) {
                    console.error('Error updating victim name:', error);
                }
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