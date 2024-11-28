import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import UserLogout from '../../UserLogout';
import ambulanceIcon from '../Assets/responder.png';
import fireIcon from '../Assets/fire1.png';
import injuredIcon from '../Assets/injured1.png';
import vehicularIcon from '../Assets/car crash.png';
import policeIcon from '../Assets/police station.png'; 
import barangayIcon from '../Assets/barangay hall.png';
import othersIcon from '../Assets/others1.png'; // Import the custom icon for Others
import api from '../../config/axios';  // Add this import

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ setCurrentLocation }) => {
    const [reportLocations, setReportLocations] = useState([]);
    const [currentLocation, setLocalCurrentLocation] = useState(null);
    const [responderType, setResponderType] = useState(null);

    useEffect(() => {
        // Fetch the responder type from session
        api.get('/checkSession')
            .then(response => {
                if (response.data.isAuthenticated) {
                    setResponderType(response.data.user.respondertype);
                }
            })
            .catch(error => console.error('Error fetching session:', error));
    }, []);

    // Get the appropriate icon based on responder type
    const getResponderIcon = () => {
        switch(responderType) {
            case 'Medical Professional':
                return customIcons.Responder;
            case 'Police':
                return customIcons.Police;
            case 'Fire Fighter':
                return customIcons.Fire;
            default:
                return customIcons.Responder;
        }
    };

    useEffect(() => {
        api.get('/api/full_reports/locations')
            .then(response => {
                console.log('Fetched report locations:', response.data);
                setReportLocations(response.data);
            })
            .catch(error => console.error('Error fetching report locations:', error));
    }, []);

    const map = useMapEvents({
        click() {
            map.locate();
        },
        locationfound(e) {
            setLocalCurrentLocation(e.latlng);
            setCurrentLocation(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    const customIcons = {
        Responder: L.icon({ iconUrl: ambulanceIcon, iconSize: [70, 70], iconAnchor: [20, 40] }), // Use the imported image
        Accident: L.icon({  iconUrl: vehicularIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
        Fire: L.icon({  iconUrl: fireIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
        Police: L.icon({  iconUrl: policeIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
        Barangay: L.icon({  iconUrl: barangayIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
        Injured: L.icon({  iconUrl: injuredIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
        Others: L.icon({  iconUrl: othersIcon, iconSize: [80, 80], iconAnchor: [20, 40] }) // Add the custom icon for Others
    };

    return (
        <>
            {reportLocations.map((location, index) => {
                console.log('Rendering marker for location:', location);
                let icon;
                if (location.type === 'Injured Individual') {
                    icon = customIcons.Injured;
                } else if (location.type === 'Fire Emergency') {
                    icon = customIcons.Fire;
                } else if (location.type === 'Vehicular Accident') {
                    icon = customIcons.Accident;
                } else if (location.type === 'Others') {
                    icon = customIcons.Others;
                } else {
                    icon = customIcons[location.type];
                }
                const adjustedPosition = [location.latitude + 0.0003, location.longitude];
                return (
                    <Marker key={index} position={adjustedPosition} icon={icon}>
                        <Popup>
                            <div>
                                <p>{location.type}</p>
                                {location.imageUrl && <img src={`http://localhost:8081/${location.imageUrl}`} alt={location.type} style={{ width: '100px', height: '100px' }} />}
                                <p>status: {location.status}</p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
            {currentLocation && (
                <Marker position={currentLocation} icon={getResponderIcon()}>
                    <Popup>You are here</Popup>
                </Marker>
            )}
        </>
    );
};

const legazpiBounds = [
    [12.9000, 123.5000], // Southwest coordinates
    [13.4000, 124.0000]  // Northeast coordinates
];

const Dashboard = () => {
    const [isActive, setIsActive] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [responderId, setResponderId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const updateStatus = (status, latitude, longitude) => {
        api.put('/api/account/status', { status, latitude, longitude })
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };

    const handleActive = () => {
        if (currentLocation) {
            console.log('Activating with location:', currentLocation);
            setIsActive(true);
            updateStatus('active', currentLocation.lat, currentLocation.lng);
            const situationStatus = document.getElementById('situation-status');

            situationStatus.classList.add('fade-out');

            setTimeout(() => {
                situationStatus.textContent = "Active";
                situationStatus.style.color = "green";

                situationStatus.classList.remove('fade-out');
                situationStatus.classList.add('fade-in');
            }, 200);

            setTimeout(() => {
                situationStatus.classList.remove('fade-in');
            }, 200);
        } else {
            console.log('Current location is not set');
        }
    };

    const handleUnavailable = () => {
        setIsActive(false);
        updateStatus('unavailable', 0, 0);
        const situationStatus = document.getElementById('situation-status');

        situationStatus.classList.add('fade-out');

        setTimeout(() => {
            situationStatus.textContent = "Unavailable";
            situationStatus.style.color = "red";

            situationStatus.classList.remove('fade-out');
            situationStatus.classList.add('fade-in');
        }, 200);

        setTimeout(() => {
            situationStatus.classList.remove('fade-in');
        }, 200);
    };

    useEffect(() => {
        handleUnavailable();
    }, []);

    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                if (currentLocation) {
                    updateStatus('active', currentLocation.lat, currentLocation.lng);
                }
            }, 10000); // Update location every 10 seconds
        }
        return () => clearInterval(interval);
    }, [isActive, currentLocation]);

    useEffect(() => {
        // Fetch the authenticated responder's ID
        api.get('/checkSession')
            .then(response => {
                if (response.data.isAuthenticated) {
                    setResponderId(response.data.user.id);
                }
            })
            .catch(error => console.error('Error fetching session data:', error));
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (isActive && responderId) {
            interval = setInterval(() => {
                // First check for regular responder reports
                api.post('/api/full_reports/closestResponder', { responderId })
                    .then(response => {
                        if (response.data.match) {
                            handleReportMatch(response.data.reportId);
                        } else {
                            // If no regular report, check for police reports
                            return api.post('/api/full_reports/closestPolice', { policeId: responderId });
                        }
                    })
                    .then(response => {
                        if (response?.data?.match) {
                            handleReportMatch(response.data.reportId);
                        }
                    })
                    .catch(error => console.error('Error checking for reports:', error));
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isActive, responderId, navigate]);

    const handleReportMatch = async (reportId) => {
        setShowModal(true);
        try {
            // Update the responder situation to 'ongoing'
            await fetch(`http://localhost:8081/api/responders/${responderId}/situation`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ situation: 'ongoing' }),
                credentials: 'include',
            });

            // Save the reportId to the responder_details
            await fetch(`http://localhost:8081/api/responders/${responderId}/report`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reportId }),
                credentials: 'include',
            });

            navigate('/responder/report-received');
        } catch (error) {
            console.error('Error handling report match:', error);
        }
    };

    return (
        <div className="index-responder-body">
            <UserLogout />

            <div className="index-tabs-responder">
                <div className="parent-container">
                    <div id="map" className="map-container">
                        <MapContainer 
                            bounds={legazpiBounds}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker setCurrentLocation={setCurrentLocation} />
                        </MapContainer>
                    </div>
                </div>
                <div className="responder-situation">
                    <div className="situation-text-container">
                        <p className="situation-text">Situation: <span id="situation-status" className="status-text">Unavailable</span></p>
                    </div>
                    <div className="btn-container">
                        <button
                            id="active-btn"
                            className="active-btn"
                            onClick={handleActive}
                            disabled={isActive}
                        >
                            Active
                        </button>
                        <button
                            id="unavailable-btn"
                            className="unavailable-btn"
                            onClick={handleUnavailable}
                            disabled={!isActive}
                        >
                            Unavailable
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <p>Report received</p>
                    </div>
                </div>
            )}
            <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
        </div>
    );
};

export default Dashboard;