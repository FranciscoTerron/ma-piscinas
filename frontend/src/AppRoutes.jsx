import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../src/components/PrivateRoute';  
import Error403 from '../src/components/Error403';
import Login from '../src/components/Login';
import PerfilUsuario from '../src/components/perfilPersonal/PerfilCompleto';
import ClienteProfile from '../src/components/cliente/ClienteProfile';
import AdminProfile from '../src/components/administrativo/AdminProfile';
import GestionUsuarios from '../src/components/administrativo/gestionUsuarios/GestionUsuarios';
import GestionPagos from '../src/components/administrativo/gestionPagos/GestionPagos';
import MetodosDePago from '../src/components/administrativo/gestionPagos/gestionMetodosDePago/MetodosDePago';
import RegistroPagos from '../src/components/administrativo/gestionPagos/RegistroPagos';
import AdministracionProductos from '../src/components/administrativo/gestionProductos/AdministracionProductos';
import GestionProductos from '../src/components/administrativo/gestionProductos/gestionProductos/GestionProductos';
import AdministracionCategorias from '../src/components/administrativo/gestionProductos/gestionCategorias/AdministracionCategorias';
import GestionCategorias from '../src/components/administrativo/gestionProductos/gestionCategorias/gestionCategorias/GestionCategorias';
import GestionPedidos from '../src/components/administrativo/gestionPedidos/GestionPedidos'
import GestionSubCate from '../src/components/administrativo/gestionProductos/gestionCategorias/gestionSubCategorias/GestionSubCate';
import ComoComprar from '../src/components/cliente/ComoComprar';
import QuienesSomos from '../src/components/cliente/QuienesSomos';
import PoliticasDevolucion from '../src/components/cliente/PoliticasDevolucion';
import Contacto from '../src/components/cliente/Contacto';
import Productos from '../src/components/cliente/Productos';
import Inicio from './components/cliente/Inicio';
import GestionEnvios from './components/administrativo/gestionEnvios/GestionEnvios';
import RegistroEnvios from '../src/components/administrativo/gestionEnvios/RegistroEnvios';
import MetodosEnvios from '../src/components/administrativo/gestionEnvios/gestionMetodoEnvios/MetodosEnvios';
import Registrar from '../src/components/Registrar';
import Reportes from './components/administrativo/reportes/Reportes';
import Producto from '../src/components/cliente/Producto';
import GestionDescuentos from '../src/components/administrativo/gestionProductos/gestionDescuentos/GestionDescuentos'
import ListaActividades from '../src/components/administrativo/actividadesRecientes/ListaActividades';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/registrar" element={<Registrar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/error403" element={<Error403 />} />
      <Route path="/comoComprar" element={<ComoComprar />} />
      <Route path="/quienesSomos" element={<QuienesSomos />} />
      <Route path="/politicasDeDevolucion" element={<PoliticasDevolucion />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/productos" element= {<Productos/>} />
      <Route path="/producto/:id" element={<Producto />} />
      <Route path="/inicio" element= {<Inicio/>} />

      {/* Rutas protegidas */}
      <Route 
        path="/perfilUsuario" 
        element={
          <PrivateRoute allowedRoles={["cliente", "administrador"]}>
            <PerfilUsuario />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/inicio" 
        element={
          <PrivateRoute allowedRoles={["cliente", "administrador"]}>
            <Inicio />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/perfil" 
        element={
          <PrivateRoute allowedRoles={["cliente", "administrador"]}>
            <ClienteProfile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/panelAdministrativo" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <AdminProfile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/gestionUsuarios" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <GestionUsuarios />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/gestionProductos" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <GestionProductos />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/gestionPagos" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <GestionPagos />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/registroPagos" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <RegistroPagos />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/metodosPago" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <MetodosDePago />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/administracionDeProductos" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <AdministracionProductos />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/administracionDeCategorias" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <AdministracionCategorias />
          </PrivateRoute>
        } 
      />
      <Route
        path="/gestionCategorias"
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <GestionCategorias />
          </PrivateRoute>
        }
      />
      <Route
        path="/gestionSubcategorias"
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <GestionSubCate />
          </PrivateRoute>
        }
      />

      <Route
        path="/gestionEnvios"
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <GestionEnvios />
          </PrivateRoute>
        }
      />
      <Route
        path="/gestionDescuentos"
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <GestionDescuentos />
          </PrivateRoute>
        }
      />
     
     <Route
        path="/registroEnvios"
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <RegistroEnvios />
          </PrivateRoute>
        }
      />
       <Route 
        path="/metodosEnvios" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <MetodosEnvios />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/reportes" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <Reportes />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/pedidos" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <GestionPedidos />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/historialDeActividades" 
        element={
          <PrivateRoute allowedRoles={["administrador"]}>
            <ListaActividades/>
          </PrivateRoute>
        } 
      />
      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;