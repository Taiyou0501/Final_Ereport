import '../CSS/responder.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import samplepic from '../Assets/sampleaccident.png';
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
    const navigate = useNavigate();
    const [buttonClicked, setButtonClicked] = useState(false);

    const handleRespondClick = () => {
        setButtonClicked(true);
    };

    return (
        <div className="index-responder-body">
            <UserLogout />

            <div className="index-tabs-responder">
                <div className="parent-container">
                    <div id="map" className="map-container" alt="map">
                    <MapContainer 
                    bounds={legazpiBounds}
                    maxBounds={legazpiBounds}
                    maxBoundsViscosity={1.0}
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

                <div className="report-container">
                    <p className='report-header-text'>Emergency Report Details</p>
                    <div className='report-parent-container'>
                        <div className="report-details-container">
                            <p className="d1">Victim: [Insert Victim Name]</p>
                            <p className="d2">Reporter ID: [Insert Reporter ID]</p>
                            <p className="d3" id="distance">Distance: [Distance]</p>
                            <p className="d4">Location: [Insert Location]</p>
                            <p className="d5">Description: [Insert Description]</p>
                            <p className="d6">Date/Time: [Insert Date/Time]</p>
                        </div>
                        <div className="notif-picture-container">
                            <img src={samplepic} alt="Scene Photo" className="scene-picture" />
                        </div>
                    </div>
                </div>

                <div className='respond-btn-container'>
                    <button
                        id="respond-btn"
                        className={`respond-btn ${buttonClicked ? 'button-hidden' : ''}`}
                        onClick={handleRespondClick}>
                        RESPOND
                    </button>
                    <p id="respond-text" className={`respond-text ${buttonClicked ? 'text-visible' : 'text-hidden'}`}>
                        Responding to the scene...
                    </p>
                </div>
                <button onClick={() => navigate('/responder/final')}>Next</button> {/* temporary */}
            </div>
        </div>
    );
};

export default Dashboard;