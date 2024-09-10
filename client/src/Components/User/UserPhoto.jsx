import '../CSS/user.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff, faCamera } from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

const UserIndex = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const navigate = useNavigate();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log('Location:', { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [webcamRef]);

  const retakePhoto = () => {
    setCapturedImage(null);
    setLocation({ latitude: null, longitude: null });
  };

  const acceptPhoto = () => {
    console.log('Photo accepted:', capturedImage);
    console.log('Location:', location);
    window.alert(`Photo accepted! Location: Latitude ${location.latitude}, Longitude ${location.longitude}`);
    window.location.href = '/user-emergency-type';
    // Handle the accepted photo (e.g., upload to server)
  };

  return (
    <div className="index-reporter-body">
      <header className="index-reporter-header">
        <div className="index-main-text">E-REPORT</div>
      </header>
      <header className="index-header-tab">
        <button className="index-menu-btn">
          <FontAwesomeIcon icon={faBars} />
          <span className="index-menu-text">HELLO, REPORTER</span>
        </button>
        <div className="index-reporter-actions">
          <button className="index-profile-btn">
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className="index-logout-btn" onClick={() => navigate('/login')}>
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      </header>

      <div className="index-tabs-reporter">
        {!capturedImage ? (
          <>
            <div className="camera-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                height="100%"
              />
            </div>
            <div className="capture-btn-container">
              <button className="capture-btn" onClick={capture}>
                <FontAwesomeIcon icon={faCamera} />
              </button>
              <p className="capture-text">CAPTURE THE EMERGENCY SCENE</p>
            </div>
          </>
        ) : (
          <div className="preview-container">
            <img src={capturedImage} alt="Captured" className="captured-image" />
            <div className="preview-btn-container">
              <button className="retake-btn" onClick={retakePhoto}>Retake</button>
              <button className="accept-btn" onClick={acceptPhoto}>Accept</button>
            </div>
            <div className="location-info">
              <p>Location Information:</p>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserIndex;