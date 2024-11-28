import axios from 'axios';

const baseURL = import.meta.env.MODE === 'development' 
    ? 'http://localhost:8081'
    : 'https://final-ereport.onrender.com';

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
    console.log('Starting Request:', request.url);
    console.log('Request Headers:', request.headers);
    return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Response Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default api; 