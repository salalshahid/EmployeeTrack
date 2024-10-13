import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Create an instance of axios
const apiClient = axios.create({
  baseURL
});

// Function to set the Authorization token
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Initializing setAuthToken from localStorage if available
const initialToken = localStorage.getItem('accessToken');
setAuthToken(initialToken);

export default apiClient;