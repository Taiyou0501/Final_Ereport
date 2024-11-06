import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Dashboard.css';
import logo from '../Assets/newbackground.jpg';
import ambulanceIcon from '../Assets/responder.png';
import fireIcon from '../Assets/fire1.png';
import injuredIcon from '../Assets/injured1.png';
import vehicularIcon from '../Assets/car crash.png';
import policeIcon from '../Assets/police1.png'; 
import barangayIcon from '../Assets/barangay hall.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFile, faUsers, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Logout from '../../Logout';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getRandomLatLng = (bounds) => {
  const latMin = bounds.getSouthWest().lat;
  const latMax = bounds.getNorthEast().lat;
  const lngMin = bounds.getSouthWest().lng;
  const lngMax = bounds.getNorthEast().lng;

  const lat = latMin + Math.random() * (latMax - latMin);
  const lng = lngMin + Math.random() * (lngMax - lngMin);

  return { lat, lng };
};

const markerTypes = [
  { type: 'Responder', label: 'Responder Location' },
  { type: 'Accident', label: 'Accident Location' },
  { type: 'Accident', label: 'Accident Location' },
  { type: 'Fire', label: 'Fire Location' },
  { type: 'Police', label: 'Police Location' },
  { type: 'Barangay', label: 'Barangay Location' },
  { type: 'Injured', label: 'Injured Individual Location' }
];

const LocationMarker = () => {
  const [positions, setPositions] = useState([]);

  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      const bounds = map.getBounds();
      const newPositions = markerTypes.map(marker => ({
        ...marker,
        position: getRandomLatLng(bounds)
      }));
      setPositions(newPositions);
    },
  });

  const customIcons = {
    Responder: L.icon({ iconUrl: ambulanceIcon, iconSize: [70, 70], iconAnchor: [20, 40] }), // Use the imported image
    Accident: L.icon({  iconUrl: vehicularIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
    Fire: L.icon({  iconUrl: fireIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
    Police: L.icon({  iconUrl: policeIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
    Barangay: L.icon({  iconUrl: barangayIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
    Injured: L.icon({  iconUrl: injuredIcon, iconSize: [80, 80], iconAnchor: [20, 40] }),
  };

  return (
    <>
      {positions.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={customIcons[marker.type]}>
          <Popup>{marker.label}</Popup>
        </Marker>
      ))}
    </>
  );
};

const legazpiBounds = [
  [13.1000, 123.7000], // Southwest coordinates
  [13.2000, 123.8000]  // Northeast coordinates
];

const center = [
  (legazpiBounds[0][0] + legazpiBounds[1][0]) / 2,
  (legazpiBounds[0][1] + legazpiBounds[1][1]) / 2
];

const AdminHome = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path, { replace: true });
  };

  return (
    <div className="body">
      <nav className="sidebar">
        <header className="header">
          <div className="image-text">
            <span className="image">
              <img src={logo} alt="logo" />
              <span className="title">Electronic</span>
              <span className="title">Response</span>
              <span className="title">Portal</span>
            </span>
          </div>
        </header>
        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="nav-link">
              <a onClick={() => handleNavigation('/admin/home')}>
                  <FontAwesomeIcon icon={faHouse} className="icon" />
                  <span className="text nav-text">Home</span>
                </a>
              </li>
              <li className="nav-link">
              <a onClick={() => handleNavigation('/admin/reports')}>
                  <FontAwesomeIcon icon={faFile} className="icon" />
                  <span className="text nav-text">Reports</span>
                </a>
              </li>
              <li className="nav-link">
                <a onClick={() => handleNavigation('/admin/accounts')}>
                  <FontAwesomeIcon icon={faUsers} className="icon" />
                  <span className="text nav-text">Accounts</span>
                </a>
              </li>
              <li className="nav-link">
                <a onClick={() => handleNavigation('/admin/profile')}>
                  <FontAwesomeIcon icon={faCircleUser} className="icon" />
                  <span className="text nav-text">Profile</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="bottom-content">
            <Logout />
          </div>
        </div>
      </nav>
      <section className="home">
        <div className="text">Dashboard</div>
        <div className="text">Welcome, Admin</div>
        <div className="tabs-admin">
          <div className="home-wrapper">
            <MapContainer
              center={center}
              zoom={17}
              minZoom={13}
              maxZoom={17}
              bounds={legazpiBounds}
              maxBounds={legazpiBounds}
              maxBoundsViscosity={1.0}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminHome;