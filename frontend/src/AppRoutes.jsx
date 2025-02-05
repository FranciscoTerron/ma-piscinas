import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../src/components/Register';
import Login from '../src/components/Login';
import ClienteProfile from '../src/components/cliente/ClienteProfile';
import AdminProfile from '../src/components/administrativo/AdminProfile';
import GestionUsuarios from '../src/components/administrativo/gestionUsuarios/GestionUsuarios';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/clienteProfile" 
        element={
          <PrivateRoute>
            <ClienteProfile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/adminProfile" 
        element={
          <PrivateRoute>
            <AdminProfile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/gestionUsuarios" 
        element={
          <PrivateRoute>
            <GestionUsuarios />
          </PrivateRoute>
        } 
      />
      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Componente PrivateRoute para proteger rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export default AppRoutes;
