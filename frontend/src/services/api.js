import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para manejar tokens de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Servicios para Usuarios-------------------------------------------
export const register = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(
    'http://127.0.0.1:8000/login',
    { email, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  localStorage.setItem('token', response.data.access_token); 
  return response;
};

export const listarUsuarios = async () => {
  const response = await api.get("/usuarios");
  return response.data;
};

export const actualizarDatosPersonales = async (usuarioId, datosActualizados) => {
  const response = await api.put(`/usuarios/${usuarioId}/datos-personales`, datosActualizados);
  return response.data;
};

export const actualizarContrasena = async (usuarioId, nuevaContrasena) => {
  const response = await api.put(`/usuarios/${usuarioId}/contrasena`, {
    nueva_contrasena: nuevaContrasena,
  });
  return response.data;
};

export const actualizarRol = async (usuarioId, nuevoRolId) => {
  const response = await api.put(`/usuarios/${usuarioId}/rol`, { rol_id: nuevoRolId });
  return response.data;
};

export const eliminarUsuario = async (usuarioId) => {
  await api.delete(`/usuarios/${usuarioId}`);
};

// Servicio para roles--------------------------------------
export const listarRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

// Servicios para productos------------------------------------------------
export const crearProducto = async (productoData) => {
  const response = await api.post("/productos", productoData);
  return response.data;
};

export const listarProductos = async () => {
  const response = await api.get("/productos");
  return response.data;
};

export const obtenerProducto = async (productoId) => {
  const response = await api.get(`/productos/${productoId}`);
  return response.data;
};

export const actualizarProducto = async (productoId, productoData) => {
  const response = await api.put(`/productos/${productoId}`, productoData);
  return response.data;
};

export const eliminarProducto = async (productoId) => {
  await api.delete(`/productos/${productoId}`);
};

