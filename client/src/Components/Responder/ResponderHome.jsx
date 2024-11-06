import '../CSS/responder.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
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

const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click() {
            map.locate();
        },
        locationfound(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
};

const legazpiBounds = [
    [13.1000, 123.7000], // Southwest coordinates
    [13.2000, 123.8000]  // Northeast coordinates
];

const Dashboard = () => {
    const [isActive, setIsActive] = useState(false);

    const handleActive = () => {
        setIsActive(true);
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
    };

    const handleUnavailable = () => {
        setIsActive(false);
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
        // Initially set the status to 'Unavailable'
        handleUnavailable();
    }, []);

    const navigate = useNavigate();

    return (
        <div className="index-responder-body">
            <UserLogout />

            <div className="index-tabs-responder">
                <div className="parent-container">
                    <div id="map" className="map-container">
                        <MapContainer 
                            bounds={legazpiBounds}
                            style={{ height: '100vh', width: '100vh' }}
                            scrollWheelZoom={true}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker />
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
                        <button onClick={() => navigate('/responder/report-received')}>Next</button>
                    </div>
                </div>
            </div>
            <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
        </div>
    );
};

export default Dashboard;