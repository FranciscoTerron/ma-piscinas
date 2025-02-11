import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../src/components/Register';
import Login from '../src/components/Login';
import ClienteProfile from '../src/components/cliente/ClienteProfile';
import AdminProfile from '../src/components/administrativo/AdminProfile';
import GestionUsuarios from '../src/components/administrativo/gestionUsuarios/GestionUsuarios';
import GestionProductos from './components/administrativo/gestionProductos/GestionProductos';
import GestionPagos from './components/administrativo/gestionPagos/GestionPagos';
import MetodosDePago from './components/administrativo/gestionPagos/MetodosDePago';
import RegistroPagos from './components/administrativo/gestionPagos/RegistroPagos';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/perfil" 
        element={
          <PrivateRoute>
            <ClienteProfile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/panelAdministrativo" 
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
      <Route 
        path="/gestionProductos" 
        element={
          <PrivateRoute>
            <GestionProductos />
          </PrivateRoute>
        } 
      />
        <Route 
        path="/gestionPagos" 
        element={
          <PrivateRoute>
            <GestionPagos />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/registroPagos" 
        element={
          <PrivateRoute>
            <RegistroPagos />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/metodosPago" 
        element={
          <PrivateRoute>
            <MetodosDePago />
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
