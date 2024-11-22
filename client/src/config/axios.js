import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' 
        ? 'http://localhost:8081'
        : 'https://ereport-4.onrender.com',
    withCredentials: true
});

export default api; 