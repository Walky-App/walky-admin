import axios from 'axios';

const API = axios.create({
  baseURL: 'https://staging.walkyapp.com',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('token', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
    return config;
});

export default API;
