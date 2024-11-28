import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
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
  const [report, setReport] = useState(null);
  const [hasSaved, setHasSaved] = useState(false); // Track if save operation has been performed
  const [notification, setNotification] = useState(''); // State for notification message
  const [location, setLocation] = useState(''); // State to store the place name
  const [loading, setLoading] = useState(true); // State to manage loading
  const [closestResponderId, setClosestResponderId] = useState(''); // State for closest responder ID, default to empty string
  const [closestBarangayId, setClosestBarangayId] = useState(''); // State for closest barangay ID
  const [victimName, setVictimName] = useState(''); // State for victim name
  const [reporterId, setReporterId] = useState(''); // State for reporter ID
  const [closestPoliceId, setClosestPoliceId] = useState(''); // Add this state variable
  const [pollingTimeout, setPollingTimeout] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

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
        if (isPolling) return;
        setIsPolling(true);
        setNotification('Searching for available responders...');

        // Find closest responder based on type
        let responderType = '';
        if (report.type === 'Fire Emergency') {
            responderType = 'Firefighter';
        } else {
            responderType = 'Medical Professional';
        }

        // Get active responders
        const respondersResponse = await api.get('/api/responders/active', {
            params: { respondertype: responderType }
        });
        const responders = respondersResponse.data;
        let closestResponder = 'No responder available';

        // Find closest responder if any are available
        if (responders.length > 0) {
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

            const distances = dijkstra(graph, incidentNode);
            let minDistance = Infinity;
            
            for (const responderNode in distances) {
                if (responderNode !== incidentNode && distances[responderNode] < minDistance && distances[responderNode] <= 3) {
                    minDistance = distances[responderNode];
                    closestResponder = responderNode;
                }
            }
        } else if (report.type === 'Fire Emergency') {
            closestResponder = 'No available Firefighter';
        }

        // Get active barangays and find closest
        const barangaysResponse = await api.get('/api/barangays/active');
        const barangays = barangaysResponse.data;
        let closestBarangay = 'No barangay available';

        if (barangays.length > 0) {
            const graph = {};
            const incidentNode = 'incident';
            graph[incidentNode] = {};

            barangays.forEach(barangay => {
                const barangayNode = `barangay_${barangay.id}`;
                graph[barangayNode] = {};
                const distance = calculateDistance(
                    { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
                    { latitude: parseFloat(barangay.latitude), longitude: parseFloat(barangay.longitude) }
                );
                graph[incidentNode][barangayNode] = distance;
                graph[barangayNode][incidentNode] = distance;
            });

            const distances = dijkstra(graph, incidentNode);
            let minDistance = Infinity;
            
            for (const barangayNode in distances) {
                if (barangayNode !== incidentNode && distances[barangayNode] < minDistance && distances[barangayNode] <= 3) {
                    minDistance = distances[barangayNode];
                    closestBarangay = barangayNode;
                }
            }
        }

        // Get active police and find closest
        const policeResponse = await api.get('/api/responders/active', {
            params: { respondertype: 'Police' }
        });
        const policeResponders = policeResponse.data;
        let closestPolice = 'No police available';

        if (policeResponders.length > 0) {
            const graph = {};
            const incidentNode = 'incident';
            graph[incidentNode] = {};

            policeResponders.forEach(responder => {
                const responderNode = `responder_${responder.id}`;
                graph[responderNode] = {};
                const distance = calculateDistance(
                    { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
                    { latitude: parseFloat(responder.latitude), longitude: parseFloat(responder.longitude) }
                );
                graph[incidentNode][responderNode] = distance;
                graph[responderNode][incidentNode] = distance;
            });

            const distances = dijkstra(graph, incidentNode);
            let minDistance = Infinity;
            
            for (const policeNode in distances) {
                if (policeNode !== incidentNode && distances[policeNode] < minDistance && distances[policeNode] <= 3) {
                    minDistance = distances[policeNode];
                    closestPolice = policeNode;
                }
            }
        }

        // Update state with found responders
        setClosestResponderId(closestResponder);
        setClosestBarangayId(closestBarangay);
        setClosestPoliceId(closestPolice);

        // Prepare report data
        const parsedDate = moment(uploadedAt, 'M/D/YYYY, h:mm:ss A');
        const adjustedUploadedAt = parsedDate.format('YYYY-MM-DD HH:mm:ss');

        const fullReportData = {
            victim: victimName || '[N/A]',
            reporterId: reporterId,
            type: report ? report.type : '[Accident Type]',
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            location: location || 'Location not specified',
            description: report ? report.description : '[Insert Description]',
            uploadedAt: adjustedUploadedAt,
            imageUrl: filePath,
            status: 'active',
            closestResponderId: closestResponder,
            closestBarangayId: closestBarangay,
            closestPoliceId: closestPolice,
            eta: null,
            barangay_eta: null
        };

        // Save report to database
        const response = await api.post('/api/full_report', fullReportData);
        
        if (response.status === 200) {
            setHasSaved(true);
            setNotification(closestResponder === 'No responder available' ? 
                'No responder available. Please try calling this number 0977 772 3909-CDRRMO' : 
                'Report saved successfully with responder assigned!');
        }

    } catch (error) {
        console.error('Error saving report:', error);
        setNotification('Error saving report. Please try again.');
    } finally {
        setIsPolling(false);
    }
};

  const handleCombinedClick = async () => {
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
        const response = await api.get('/api/user-upload-id');
        const data = response.data;
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
          const response = await api.get(`/images/${imageId}`);
          const data = response.data;
          setImageUrl(`${api.defaults.baseURL}/${data.filePath}`);
          setFilePath(data.filePath);
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          const originalDate = moment(data.uploadedAt).format('M/D/YYYY, h:mm:ss A');
          setUploadedAt(originalDate);
          setOriginalUploadedAt(originalDate);
          fetchPlaceName(data.latitude, data.longitude);
        } catch (error) {
          console.error('Error fetching image details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchImageDetails();
  }, [imageId]);

  useEffect(() => {
    const fetchReportIdFromUserDetails = async () => {
      try {
        const userDetailsResponse = await api.get('/api/user_details');
        const reportId = userDetailsResponse.data.reportId;

        if (reportId) {
          const reportResponse = await api.get(`/api/reports/${reportId}`);
          setReport(reportResponse.data);
          setVictimName(reportResponse.data.victim_name); // Set the victim name from the report
          setClosestResponderId(reportResponse.data.closestResponderId); // Set the closest responder ID from the report
          setClosestBarangayId(reportResponse.data.closestBarangayId); // Set the closest barangay ID from the report
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
        const response = await api.get('/checkSession');
        console.log('Session data:', response.data); // Log the session data
        setReporterId(`user_${response.data.user.id}`);
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();
  }, []);

  useEffect(() => {
    return () => {
      if (pollingTimeout) {
        clearTimeout(pollingTimeout);
      }
    };
  }, [pollingTimeout]);

  const handleNotificationClose = () => {
    setNotification('');
  };

  return (
    <div className="index-responder-body" onClick={handleNotificationClose}>
      <UserLogout />

      <div className="index-tabs-responder">
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
                <>
                  <p className="d6">Closest Responder ID: {closestResponderId}</p>
                  <p className="d6">Closest Police ID: {closestPoliceId}</p>
                  <p className="d6">Closest Barangay ID: {closestBarangayId}</p>
                </>
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
          {!hasSaved && (
            <button className="menu-btn" onClick={handleCombinedClick}>Send and Save</button>
          )}

          {hasSaved && (
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