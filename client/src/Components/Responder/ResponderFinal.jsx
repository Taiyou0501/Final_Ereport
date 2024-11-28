import '../CSS/responder.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import UserLogout from '../../UserLogout';
import api from '../../config/axios';

const DashboardFinal = () => {
    const navigate = useNavigate();
    const [reportDetails, setReportDetails] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const response = await api.get('/api/responder/report');
                if (response.status === 200) {
                    setReportDetails(response.data);
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

    const handleBackToMainMenu = async () => {
        try {
            const response = await api.put('/api/responder/resetReport');
            if (response.status === 200) {
                console.log(response.data.message);
                localStorage.setItem('situationStatus', 'Unavailable');
                navigate('/responder/home');
            } else {
                console.error('Error resetting reportId:', response.data.message);
            }
        } catch (error) {
            console.error('Error resetting reportId:', error);
        }
    };

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

    const baseURL = api.defaults.baseURL;

    return (
        <div className="index-responder-body">
            <UserLogout />

            <div className="index-tabs-responder">
                <p className="final-text">You are now at the scene</p>
                <div className="final-layout-container">
                    
                    <div className="final-report-container">
                        <p className="freport-header-text">Emergency Report Details</p>
                        <div className="final-report-details-container">
                            {reportDetails ? (
                                <>
                                    <p className="fd1">ID: {reportDetails.id}</p>
                                    <p className="fd2">Type: {reportDetails.type}</p>
                                    <p className="fd3">Victim: {reportDetails.victim}</p>
                                    <p className="fd4">Reporter ID: {reportDetails.reporterId}</p>
                                    <p className="fd5">Distance: {distance ? `${distance} km` : 'Calculating...'}</p>
                                    <p className="fd6">Location: {reportDetails.location}</p>
                                    <p className="fd6">Latitude: {reportDetails.latitude}</p>
                                    <p className="fd6">Longitude: {reportDetails.longitude}</p>
                                    <p className="fd6">Description: {reportDetails.description}</p>
                                    <p className="fd6">Date/Time: {new Date(reportDetails.uploadedAt).toLocaleString()}</p>
                                </>
                            ) : (
                                <p>Loading report details...</p>
                            )}
                        </div>
                        <div className="picture-container">
                            {reportDetails && reportDetails.imageUrl && (
                                <img 
                                    src={`${baseURL}/${reportDetails.imageUrl}`} 
                                    alt="Scene Photo" 
                                    className="scene-picture" 
                                />
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="mmb-container">
                    <button className="main-menu-btn" onClick={handleBackToMainMenu}>
                        BACK TO MAIN MENU
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardFinal;