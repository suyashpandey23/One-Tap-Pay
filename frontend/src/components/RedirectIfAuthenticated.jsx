import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RedirectIfAuthenticated = ({ children }) => {
    const { currentUser } = useAuth();
    if (currentUser) return <Navigate to="/dashboard" />;
    return children;
};

export default RedirectIfAuthenticated;
