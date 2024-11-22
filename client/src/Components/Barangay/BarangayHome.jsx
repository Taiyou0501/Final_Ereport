import '../CSS/responder.css';
import { useNavigate } from 'react-router-dom';
import ambulanceIcon from '../Assets/responder.png';
import fireIcon from '../Assets/fire1.png';
import injuredIcon from '../Assets/injured1.png';
import vehicularIcon from '../Assets/car crash.png';
import policeIcon from '../Assets/Police1.png'; 
import barangayIcon from '../Assets/barangay hall.png';
import othersIcon from '../Assets/others1.png'; // Import the custom icon for Others
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import UserLogout from '../../UserLogout';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ setCurrentLocation }) => {
    const [reportLocations, setReportLocations] = useState([]);
    const [currentLocation, setLocalCurrentLocation] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8081/api/full_reports/locations')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched report locations:', data);
                setReportLocations(data);
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
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
            {currentLocation && (
                <Marker position={currentLocation} icon={customIcons.Barangay}>
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
    const [barangayId, setBarangayId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate(); // Ensure navigate is declared before useEffect

    const updateStatus = (status, latitude, longitude) => {
        fetch('http://localhost:8081/api/account/status', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, latitude, longitude }),
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
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
            }, 20000); // Update location every 20 seconds
        }
        return () => clearInterval(interval);
    }, [isActive, currentLocation]);

    useEffect(() => {
        // Fetch the authenticated barangay ID
        fetch('http://localhost:8081/checkSession', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                setBarangayId(data.user.id);
            }
        })
        .catch(error => console.error('Error fetching session data:', error));
    }, []);

    useEffect(() => {
        let interval;
        if (isActive && barangayId) {
            interval = setInterval(() => {
                fetch('http://localhost:8081/api/full_reports/closestBarangay', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ barangayId }),
                    credentials: 'include',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.match) {
                        setShowModal(true);
                        // Update the barangay situation to 'ongoing' and save the reportId
                        fetch(`http://localhost:8081/api/barangays/${barangayId}/situation`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ situation: 'ongoing' }),
                            credentials: 'include',
                        })
                        .then(response => response.json())
                        .then(() => {
                            // Save the reportId to the barangay_details
                            fetch(`http://localhost:8081/api/barangays/${barangayId}/report`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ reportId: data.reportId }),
                                credentials: 'include',
                            })
                            .then(response => response.json())
                            .then(() => {
                                navigate('/barangay/notification');
                            })
                            .catch(error => console.error('Error updating barangay reportId:', error));
                        })
                        .catch(error => console.error('Error updating barangay situation:', error));
                    }
                })
                .catch(error => console.error('Error checking for reports:', error));
            }, 5000); // Check every 5 seconds
        }
        return () => clearInterval(interval);
    }, [isActive, barangayId, navigate]);

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
                        <button onClick={() => navigate('/barangay/notification')}>Next</button>
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