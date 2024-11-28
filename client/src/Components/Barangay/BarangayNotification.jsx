import '../CSS/responder.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import UserLogout from '../../UserLogout';
import api from '../../config/axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 15); // Zoom level 15
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Incident Location</Popup>
        </Marker>
    );
};

const CurrentLocationMarker = ({ position }) => {
    return position === null ? null : (
        <Marker position={position}>
            <Popup>Your Current Location</Popup>
        </Marker>
    );
};

const legazpiBounds = [
    [12.9000, 123.5000], // Southwest coordinates
    [13.4000, 124.0000]  // Northeast coordinates
];

const BarangayNotification = () => {
    const navigate = useNavigate();
    const [buttonClicked, setButtonClicked] = useState(false);
    const [reportDetails, setReportDetails] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const [distance, setDistance] = useState(null);
    const [barangayEta, setBarangayEta] = useState(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const response = await api.get('/api/barangay/report');
                if (response.status === 200) {
                    setReportDetails(response.data);
                    console.log('Report Details Fetched:', response.data);
                } else {
                    console.error('Error fetching report details:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching report details:', error);
            }
        };

        fetchReportDetails();
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserPosition([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error('Error getting current position:', error);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (reportDetails && userPosition) {
            const distance = calculateDistance(
                userPosition[0],
                userPosition[1],
                reportDetails.latitude,
                reportDetails.longitude
            );
            setDistance(distance);
        }
    }, [reportDetails, userPosition]);

    const handleRespondClick = async () => {
        setButtonClicked(true);
        console.log('Button Clicked:', buttonClicked);
        startCheckingDistance();

        if (distance) {
            const averageSpeed = 60; // km/h
            const etaMinutes = (distance / averageSpeed) * 60;
            const roundedEta = Math.ceil(etaMinutes);
            setBarangayEta(roundedEta);

            try {
                // Get barangay ID from session
                const sessionResponse = await api.get('/checkSession');
                const sessionData = sessionResponse.data;

                // Update closestBarangayId to show (RESPONDING)
                await api.put(`/api/full_report/${reportDetails.id}/barangayStatus`, {
                    closestBarangayId: `barangay_${sessionData.user.id} (RESPONDING)`,
                    barangay_eta: roundedEta
                });
            } catch (error) {
                console.error('Error updating barangay status:', error);
            }
        }
    };

    const startCheckingDistance = () => {
        intervalRef.current = setInterval(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const newUserPosition = [position.coords.latitude, position.coords.longitude];
                        setUserPosition(newUserPosition);

                        if (reportDetails) {
                            const newDistance = calculateDistance(
                                newUserPosition[0],
                                newUserPosition[1],
                                reportDetails.latitude,
                                reportDetails.longitude
                            );
                            setDistance(newDistance);

                            if (newDistance <= 0.1) {
                                clearInterval(intervalRef.current);
                                
                                try {
                                    const sessionResponse = await api.get('/checkSession');
                                    const sessionData = sessionResponse.data;

                                    // Update closestBarangayId to show (RESPONDED)
                                    await api.put(`/api/full_report/${reportDetails.id}/barangayStatus`, {
                                        closestBarangayId: `barangay_${sessionData.user.id} (RESPONDED)`
                                    });
                                    navigate('/barangay/final');
                                } catch (error) {
                                    console.error('Error updating status:', error);
                                }
                            }
                        }
                    },
                    (error) => {
                        console.error('Error getting current position:', error);
                    }
                );
            }
        }, 5000);
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current); // Clear interval on component unmount
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance.toFixed(2); // Return distance with 2 decimal places
    };

    return (
        <div className="index-responder-body">
            <UserLogout />

            <div className="index-tabs-responder">
                <div className="parent-container">
                    <div id="map" className="map-container" alt="map">
                        <MapContainer 
                            bounds={legazpiBounds}
                            maxBoundsViscosity={1.0}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                            whenCreated={(map) => map.locate({ setView: true, maxZoom: 16 })}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {reportDetails && (
                                <LocationMarker position={[reportDetails.latitude, reportDetails.longitude]} />
                            )}
                            {userPosition && (
                                <CurrentLocationMarker position={userPosition} />
                            )}
                            <MapEvents setCurrentPosition={setCurrentPosition} />
                        </MapContainer>
                    </div>
                </div>

                <div className="report-container">
                    <p className='report-header-text'>Emergency Report Details</p>
                    <div className='report-parent-container'>
                        <div className="report-details-container">
                            {reportDetails ? (
                                <>
                                    <p className="d1">Victim: {reportDetails.victim}</p>
                                    <p className="d2">Reporter ID: {reportDetails.reporterId}</p>
                                    <p className="d3" id="distance">Distance: {distance} km</p>
                                    <p className="d4">Location: {reportDetails.location}</p>
                                    <p className="d5">Description: {reportDetails.description}</p>
                                    <p className="d6">Date/Time: {new Date(reportDetails.uploadedAt).toLocaleString()}</p>
                                    {barangayEta && <p className="d6">Estimated Time of Arrival: {barangayEta} minutes</p>}
                                </>
                            ) : (
                                <p>Loading report details...</p>
                            )}
                        </div>
                        <div className="notif-picture-container">
                            {reportDetails && reportDetails.imageUrl && (
                                <img 
                                    src={`${api.defaults.baseURL}/${reportDetails.imageUrl}`} 
                                    alt="Scene Photo" 
                                    className="scene-picture" 
                                />
                            )}
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
                <button onClick={() => navigate('/barangay/final')}>Next</button> {/* temporary */}
            </div>
        </div>
    );
};

const MapEvents = ({ setCurrentPosition }) => {
    useMapEvents({
        locationfound(e) {
            console.log('Location Found:', e.latlng);
            setCurrentPosition(e.latlng);
        },
        locationerror(e) {
            console.error('Location Error:', e.message);
        },
    });

    return null;
};

export default BarangayNotification;