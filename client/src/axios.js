import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ereport-4.onrender.com',
    withCredentials: true
});

export default api;
