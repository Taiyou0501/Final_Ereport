import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserIndex = () => {
  const navigate = useNavigate();
  const [imageId, setImageId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [filePath, setFilePath] = useState(''); // Store the original filePath
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [uploadedAt, setUploadedAt] = useState('');
  const [holdText, setHoldText] = useState("FINDING NEAREST RESPONDER...");
  const [clickCount, setClickCount] = useState(0);
  const [fadeClass, setFadeClass] = useState('');
  const [report, setReport] = useState(null);
  const [hasSaved, setHasSaved] = useState(false); // Track if save operation has been performed
  const [notification, setNotification] = useState(''); // State for notification message

  const handleNextClick = () => {
    setFadeClass('fade-out');

    setTimeout(() => {
      setClickCount(prevCount => {
        const newCount = prevCount + 1;

        if (newCount === 1) {
          setHoldText("RESPONDER IS ON THE WAY. ETA: 5 MINUTES");
        } else if (newCount === 2) {
          setHoldText("RESPONDER IS ON YOUR LOCATION");
        }

        return newCount;
      });

      setFadeClass('fade-in');
    }, 150);
  };

  const handleSaveClick = async () => {
    try {
      // Format the uploadedAt date before sending it to the backend
      const formattedUploadedAt = new Date(uploadedAt).toISOString();

      const fullReportData = {
        victim: 'N/A', // Replace with actual victim data if available
        reporterId: '[Insert Reporter ID]', // Replace with actual reporter ID if available
        type: report ? report.type : '[Accident Type]',
        latitude,
        longitude,
        description: report ? report.description : '[Insert Description]',
        uploadedAt: formattedUploadedAt,
        imageUrl: filePath // Use the original filePath
      };

      await axios.post('http://localhost:8081/api/full_report', fullReportData);
      console.log('Full report saved successfully');

      // Set notification message
      setNotification('Data saved successfully!');

      // Reformat the date back to a human-readable format
      setUploadedAt(new Date(formattedUploadedAt).toLocaleString());
    } catch (error) {
      console.error('Error saving full report:', error);
      setNotification('Error saving data. Please try again.');
    }
  };

  const handleCombinedClick = async () => {
    handleNextClick();
    if (!hasSaved) {
      await handleSaveClick();
      setHasSaved(true);
    }
  };

  useEffect(() => {
    const fetchLatestImageId = async () => {
      try {
        const response = await fetch('http://localhost:8081/latest-image-id');
        if (!response.ok) {
          throw new Error('Failed to fetch latest image ID');
        }
        const data = await response.json();
        setImageId(data.id);
      } catch (error) {
        console.error('Error fetching latest image ID:', error);
      }
    };

    fetchLatestImageId();
  }, []);

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (imageId) {
        try {
          const response = await fetch(`http://localhost:8081/images/${imageId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch image details');
          }
          const data = await response.json();
          setImageUrl(`http://localhost:8081/${data.filePath}`);
          setFilePath(data.filePath); // Store the original filePath
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          setUploadedAt(new Date(data.uploadedAt).toLocaleString());
        } catch (error) {
          console.error('Error fetching image details:', error);
        }
      }
    };

    fetchImageDetails();
  }, [imageId]);

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/reports/latest');
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching latest report:', error);
      }
    };

    fetchLatestReport();
  }, []);

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
        <p
          className={`hold-text ${fadeClass}`}
          style={{ color: holdText === "RESPONDER IS ON YOUR LOCATION" ? 'green' : 'red' }}
        >
          {holdText}
        </p>
        <p className="submit-text">YOUR REPORT: </p>
        <div className="report-container">
          <div className='report-parent-container'>
            <div className="report-details-container">
              <p className="d1">Victim: N/A</p>
              <p className="d2">Reporter ID: [Insert Reporter ID]</p>
              <p className="d3">Type: {report ? report.type : '[Accident Type]'}</p>
              <p className="d4">Location: Latitude: {latitude}, Longitude: {longitude}</p>
              <p className="d5">Description: {report ? report.description : '[Insert Description]'}</p>
              <p className="d6">Date/Time: {uploadedAt}</p>
            </div>
            <div className="notif-picture-container">
              {imageUrl ? (
                <img src={imageUrl} alt="Scene Photo" className="scene-picture" />
              ) : (
                <p>Loading image...</p>
              )}
            </div>
          </div>
          {clickCount < 2 && (
            <button className="menu-btn" onClick={handleCombinedClick}>Send and Save</button>
          )}

          {holdText === "RESPONDER IS ON YOUR LOCATION" && (
            <button className="menu-btn" onClick={() => navigate('/user')}>
              RETURN TO MAIN MENU
            </button>
          )}
        </div>
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserIndex;