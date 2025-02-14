import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../src/components/Register';
import Login from '../src/components/Login';
import PerfilUsuario from '../src/components/perfilPersonal/PerfilUsuario';
import ClienteProfile from '../src/components/cliente/ClienteProfile';
import AdminProfile from '../src/components/administrativo/AdminProfile';
import GestionUsuarios from '../src/components/administrativo/gestionUsuarios/GestionUsuarios';
import GestionPagos from '../src/components/administrativo/gestionPagos/GestionPagos';
import MetodosDePago from '../src/components/administrativo/gestionPagos/gestionMetodosDePago/MetodosDePago';
import RegistroPagos from '../src/components/administrativo/gestionPagos/RegistroPagos';
import AdministracionProductos from '../src/components/administrativo/gestionProductos/AdministracionProductos';
import GestionProductos from '../src/components/administrativo/gestionProductos/gestionProductos/GestionProductos';
import AdministracionCategorias from '../src/components/administrativo/gestionProductos/gestionCategorias/AdministracionCategorias';
import GestionCategorias from '../src/components/administrativo/gestionProductos/gestionCategorias/gestionCategorias/GestionCategorias'
import GestionSubCate from '../src/components/administrativo/gestionProductos/gestionCategorias/gestionSubCategorias/GestionSubCate';
import ComoComprar from '../src/components/cliente/ComoComprar';
import QuienesSomos from '../src/components/cliente/QuienesSomos';
import PoliticasDevolucion from '../src/components/cliente/PoliticasDevolucion';
import Contacto from '../src/components/cliente/Contacto';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/perfilUsuario" 
        element={
          <PrivateRoute>
            <PerfilUsuario />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/comoComprar" 
        element={
          <PrivateRoute>
            <ComoComprar />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/quienesSomos" 
        element={
          <PrivateRoute>
            <QuienesSomos />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/politicasDeDevolucion" 
        element={
          <PrivateRoute>
            <PoliticasDevolucion />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/contacto" 
        element={
          <PrivateRoute>
            <Contacto />
          </PrivateRoute>
        } 
      />
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
      <Route 
        path="/administracionDeProductos" 
        element={
          <PrivateRoute>
            <AdministracionProductos />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/administracionDeCategorias" 
        element={
          <PrivateRoute>
            <AdministracionCategorias />
          </PrivateRoute>
        } 
      />
      <Route
        path="/gestionCategorias"
        element={
          <PrivateRoute>
            <GestionCategorias />
          </PrivateRoute>
        }
      />
      <Route
        path="/gestionSubcategorias"
        element={
          <PrivateRoute>
            <GestionSubCate />
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
