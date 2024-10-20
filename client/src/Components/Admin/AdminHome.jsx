import React, { useState, useEffect } from 'react';
import '../CSS/Dashboard.css';
import logo from'../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
};

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const [accidentPositions, setAccidentPositions] = useState([]);
  const [closestAccident, setClosestAccident] = useState(null);

  const map = useMapEvents({
      click() {
          map.locate();
      },
      locationfound(e) {
          setPosition(e.latlng);
        

          // Generate 3 random accident locations within the map bounds
          const bounds = map.getBounds();
          const accidents = Array.from({ length: 3 }, () => getRandomLatLng(bounds));
          setAccidentPositions(accidents);

          // Calculate the closest accident
          let minDistance = Infinity;
          let closest = null;
          accidents.forEach(accident => {
              const distance = calculateDistance(e.latlng.lat, e.latlng.lng, accident.lat, accident.lng);
              if (distance < minDistance) {
                  minDistance = distance;
                  closest = accident;
              }
          });
          setClosestAccident(closest);
      },
  });

  const closestAccidentIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<div style="color: red; font-weight: bold;">Closest Location</div>',
    iconSize: [200, 40],
    iconAnchor: [50, 20]
});

  

  return (
      <>
          {position && (
              <Marker position={position}>
                  <Popup>You are here</Popup>
              </Marker>
          )}
          {accidentPositions.map((accident, index) => (
              <Marker key={index} position={accident}>
                  <Popup>Accident Location</Popup>
              </Marker>
          ))}
          {closestAccident && (
              <Marker position={closestAccident} icon={closestAccidentIcon}>
                  <Popup>Closest Accident Location</Popup>
              </Marker>
          )}
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
]
const AdminHome = () => {
  
  return (
    <div className="body">
      <nav className="sidebar">
        <header className="header">
          <div className="image-text">
            <span className = "image">
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
              <a href="a-home">
              <FontAwesomeIcon icon={faHouse} className="icon"/>    
                <span className="text nav-text">Home</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="a-reports">
              <FontAwesomeIcon icon={faFile} className="icon"/>  
                <span className="text nav-text">Reports</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="a-accounts">
              <FontAwesomeIcon icon={faUsers} className="icon"/> 
                <span className="text nav-text">Accounts</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="a-profile">
              <FontAwesomeIcon icon={faCircleUser} className="icon"/> 
                <span className="text nav-text">Profile</span>
              </a>
            </li>
            </ul>
          </div>
          <div className="bottom-content">
            <li className="nav-link">
              <a href="/">
              <FontAwesomeIcon icon={faRightToBracket} className="icon"/> 
                <span className="text nav-text">Logout</span>
              </a>
            </li>
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