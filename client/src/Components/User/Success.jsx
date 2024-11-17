import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import UserLogout from '../../UserLogout';

const UserIndex = () => {
  const navigate = useNavigate();
  const [imageId, setImageId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [filePath, setFilePath] = useState(''); // Store the original filePath
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [uploadedAt, setUploadedAt] = useState('');
  const [originalUploadedAt, setOriginalUploadedAt] = useState(''); // Store the original uploadedAt
  const [holdText, setHoldText] = useState("FINDING NEAREST RESPONDER...");
  const [clickCount, setClickCount] = useState(0);
  const [fadeClass, setFadeClass] = useState('');
  const [report, setReport] = useState(null);
  const [hasSaved, setHasSaved] = useState(false); // Track if save operation has been performed
  const [notification, setNotification] = useState(''); // State for notification message
  const [location, setLocation] = useState(''); // State to store the place name
  const [loading, setLoading] = useState(true); // State to manage loading
  const [closestResponderId, setClosestResponderId] = useState(''); // State for closest responder ID, default to empty string
  const [victimName, setVictimName] = useState(''); // State for victim name
  const [reporterId, setReporterId] = useState(''); // State for reporter ID
  
  const handleNextClick = () => {
    setFadeClass('fade-out');

    setTimeout(() => {
      setClickCount(prevCount => {
        const newCount = prevCount + 1;

        if (newCount === 1) {
          setHoldText("RESPONDER IS ON THE WAY. ETA: ");
        } else if (newCount === 2) {
          setHoldText("RESPONDER IS ON YOUR LOCATION");
        }

        return newCount;
      });

      setFadeClass('fade-in');
    }, 150);
  };

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (loc1, loc2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Dijkstra's algorithm implementation
  const dijkstra = (graph, startNode) => {
    const distances = {};
    const visited = {};
    const unvisited = new Set(Object.keys(graph));

    // Initialize distances
    for (const node of unvisited) {
      distances[node] = Infinity;
    }
    distances[startNode] = 0;

    while (unvisited.size > 0) {
      // Find the unvisited node with the smallest distance
      let currentNode = null;
      for (const node of unvisited) {
        if (currentNode === null || distances[node] < distances[currentNode]) {
          currentNode = node;
        }
      }

      // Mark the current node as visited
      unvisited.delete(currentNode);
      visited[currentNode] = true;

      // Update distances to neighboring nodes
      for (const neighbor in graph[currentNode]) {
        if (!visited[neighbor]) {
          const newDistance = distances[currentNode] + graph[currentNode][neighbor];
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
          }
        }
      }
    }

    return distances;
  };

  const handleSaveClick = async () => {
    try {
      // Determine the responder type based on the report type
      let responderType = '';
      if (report.type === 'Fire Emergency') {
        responderType = 'Firefighter';
      } else {
        responderType = 'Medical Professional';
      }
  
      // Fetch active responders with the specified responder type
      const respondersResponse = await axios.get('http://localhost:8081/api/responders/active', {
        params: { respondertype: responderType }
      });
      const responders = respondersResponse.data;
  
      console.log('Active responders:', responders); // Log active responders
  
      let closestResponder = 'No responder available';
  
      if (responders.length > 0) {
        // Create a graph with the incident location and responders
        const graph = {};
        const incidentNode = 'incident';
        graph[incidentNode] = {};
  
        responders.forEach(responder => {
          const responderNode = `responder_${responder.id}`;
          graph[responderNode] = {};
          const distance = calculateDistance(
            { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
            { latitude: parseFloat(responder.latitude), longitude: parseFloat(responder.longitude) }
          );
          graph[incidentNode][responderNode] = distance;
          graph[responderNode][incidentNode] = distance;
        });
  
        // Run Dijkstra's algorithm
        const distances = dijkstra(graph, incidentNode);
        console.log('Distances:', distances); // Log distances
  
        // Find the closest responder
        let minDistance = Infinity;
        for (const responderNode in distances) {
          if (responderNode !== incidentNode && distances[responderNode] < minDistance) {
            minDistance = distances[responderNode];
            closestResponder = responderNode;
          }
        }
  
        console.log('Closest responder:', closestResponder); // Log closest responder
      } else if (report.type === 'Fire Emergency') {
        closestResponder = 'No available Firefighter';
      }
  
      // Set the closest responder ID state
      setClosestResponderId(closestResponder);
      console.log('Closest Responder ID:', closestResponder); // Log closest responder ID
  
      // Parse the original uploadedAt date string to a Moment.js object
      const parsedDate = moment(uploadedAt, 'M/D/YYYY, h:mm:ss A');
  
      // Subtract 4 hours from the parsed date
      const adjustedUploadedAt = parsedDate.subtract(4, 'hours').toISOString();
  
      // Ensure closestResponderId is correctly set
      console.log('closestResponderId before setting fullReportData:', closestResponder);
  
      const fullReportData = {
        victim: victimName, // Use the victim name from state
        reporterId: reporterId, // Use the reporter ID from state
        type: report ? report.type : '[Accident Type]',
        latitude,
        longitude,
        location, // Include the location in the data sent to the backend
        description: report ? report.description : '[Insert Description]' + (closestResponder !== 'No responder available' ? '' : ' No responder available.'),
        uploadedAt: adjustedUploadedAt,
        imageUrl: filePath, // Use the original filePath
        status: 'active', // Set the status to 'active'
        closestResponderId: closestResponder // Use the formatted closest responder ID
      };
  
      console.log('Full report data before sending:', fullReportData); // Log full report data
  
      await axios.post('http://localhost:8081/api/full_report', fullReportData);
      console.log('Full report saved successfully');
  
      // Set notification message
      setNotification('Data saved successfully!');
  
      // Reformat the date back to its original format
      setUploadedAt(originalUploadedAt);
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

  const fetchPlaceName = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch place name');
      }
      const data = await response.json();
      if (data && data.display_name) {
        setLocation(data.display_name);
      } else {
        setLocation('Unknown location');
      }
    } catch (error) {
      console.error('Error fetching place name:', error);
      setLocation('Error fetching location');
    }
  };

  useEffect(() => {
    const fetchUploadId = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/user-upload-id', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch upload ID');
        }
        const data = await response.json();
        setImageId(data.uploadId);
      } catch (error) {
        console.error('Error fetching upload ID:', error);
      }
    };
  
    fetchUploadId();
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
          const originalDate = new Date(data.uploadedAt).toLocaleString();
          setUploadedAt(originalDate);
          setOriginalUploadedAt(originalDate); // Store the original uploadedAt
          fetchPlaceName(data.latitude, data.longitude); // Fetch place name based on coordinates
        } catch (error) {
          console.error('Error fetching image details:', error);
        } finally {
          setLoading(false); // Hide loading popup once data is fetched
        }
      }
    };
  
    fetchImageDetails();
  }, [imageId]);

  useEffect(() => {
    const fetchReportIdFromUserDetails = async () => {
      try {
        const userDetailsResponse = await axios.get('http://localhost:8081/api/user_details', { withCredentials: true });
        const reportId = userDetailsResponse.data.reportId;
  
        if (reportId) {
          const reportResponse = await axios.get(`http://localhost:8081/api/reports/${reportId}`);
          setReport(reportResponse.data);
          setVictimName(reportResponse.data.victim_name); // Set the victim name from the report
        }
      } catch (error) {
        console.error('Error fetching report ID from user details:', error);
      }
    };
  
    fetchReportIdFromUserDetails();
  }, []);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/checkSession', { withCredentials: true });
        console.log('Session data:', response.data); // Log the session data
        setReporterId(`user_${response.data.user.id}`);
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };
  
    fetchSessionData();
  }, []);

  const handleNotificationClose = () => {
    setNotification('');
  };

  return (
    <div className="index-responder-body" onClick={handleNotificationClose}>
      <UserLogout />

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
              <p className="d1">Victim: {victimName}</p>
              <p className="d2">Reporter ID: {reporterId || 'Loading...'}</p>
              <p className="d3">Type: {report ? report.type : '[Accident Type]'}</p>
              <p className="d4">Location: {location}</p>
              <p className="d4">Latitude: {latitude}, Longitude: {longitude}</p>
              <p className="d5">Description: {report ? report.description : '[Insert Description]'}</p>
              <p className="d6">Date/Time: {uploadedAt}</p>
              {hasSaved && (
                <p className="d6">Closest Responder ID: {closestResponderId}</p>
              )}
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
            <button className="menu-btn" onClick={() => navigate('/user/index')}>
              RETURN TO MAIN MENU
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-popup">
            <p>Loading...</p>
          </div>
        </div>
      )}

      {notification && (
        <div className="notification-overlay" onClick={handleNotificationClose}>
          <div className="notification-popup">
            <p>{notification}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIndex;