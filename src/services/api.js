import axios from 'axios';

const api = axios.create({
  baseURL: 'https://crave-backend-api-pglo.onrender.com/api',
  withCredentials: true, // Critical: Sends cookies to backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;