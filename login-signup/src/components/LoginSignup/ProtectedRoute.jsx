import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('token'); 
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage

    return isAuthenticated ? <Component userId={userId} {...rest} /> : <Navigate to="/loginSignup" />;
};

export default ProtectedRoute;
