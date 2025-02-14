import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, userRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verifica si el rol del usuario está permitido
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/error403" replace />;
    }

    return children; // Si está autenticado y tiene el rol correcto, muestra el contenido
};

export default PrivateRoute;