import '../CSS/user.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff, faCamera } from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

const UserIndex = () => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [placeName, setPlaceName] = useState(''); // State to store the place name
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
          fetchPlaceName(latitude, longitude); // Fetch place name based on coordinates
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by this browser.');
    }
  }, [webcamRef]);

  const fetchPlaceName = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch place name');
      }
      const data = await response.json();
      if (data && data.display_name) {
        setPlaceName(data.display_name);
      } else {
        setPlaceName('Unknown location');
      }
    } catch (error) {
      console.error('Error fetching place name:', error);
      setPlaceName('Error fetching location');
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setLocation({ latitude: null, longitude: null });
    setPlaceName(''); // Reset place name
  };

  const uploadImage = async (image, location) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('latitude', location.latitude);
    formData.append('longitude', location.longitude);

    try {
      const response = await fetch('http://localhost:8081/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      console.log('Image uploaded successfully:', data);
      return data.filePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    }
  };

  const acceptPhoto = async () => {
    console.log('Photo accepted:', capturedImage);
    console.log('Location:', location);

    // Convert the base64 image to a Blob
    const byteString = atob(capturedImage.split(',')[1]);
    const mimeString = capturedImage.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // Upload the image
    const filePath = await uploadImage(blob, location);

    if (filePath) {
      window.alert(`Photo accepted! Location: ${placeName}`);
      window.location.href = '/user-emergency-type';
    }
  };

  const openMobileCamera = () => {
    fileInputRef.current.click();
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
              {isMobile ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setCapturedImage(reader.result);
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const { latitude, longitude } = position.coords;
                              setLocation({ latitude, longitude });
                              console.log('Location:', { latitude, longitude });
                              fetchPlaceName(latitude, longitude); // Fetch place name based on coordinates
                            },
                            (error) => {
                              console.error('Error getting location:', error);
                              alert('Error getting location: ' + error.message);
                            }
                          );
                        } else {
                          console.error('Geolocation is not supported by this browser.');
                          alert('Geolocation is not supported by this browser.');
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <button className="capture-btn" onClick={openMobileCamera}>
                    <FontAwesomeIcon icon={faCamera} />
                  </button>
                </>
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  height="100%"
                />
              )}
            </div>
            <div className="capture-btn-container">
              {!isMobile && (
                <button className="capture-btn" onClick={capture}>
                  <FontAwesomeIcon icon={faCamera} />
                </button>
              )}
              <p className="capture-text">CAPTURE THE EMERGENCY SCENE</p>
            </div>
          </>
        ) : (
          <div className="preview-container">
            <img src={capturedImage} alt="Captured" className="captured-image small-image" />
            <div className="preview-btn-container">
              <button className="btn retake-btn" onClick={retakePhoto}>Retake</button>
              <button className="btn accept-btn" onClick={acceptPhoto}>Accept</button>
            </div>
            <div className="location-info">
              <p>Location Information:</p>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
              <p>Place: {placeName}</p> {/* Display the place name */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserIndex;