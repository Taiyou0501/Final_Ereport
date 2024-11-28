import axios from 'axios';

const baseURL = import.meta.env.MODE === 'development' 
    ? 'http://localhost:8081'
    : 'https://final-ereport.onrender.com';

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response || error);
        return Promise.reject(error);
    }
);

export default api; 