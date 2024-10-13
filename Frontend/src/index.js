// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Ensure you have your global styles imported here
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> {/* Wrap App with AuthProvider here */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
