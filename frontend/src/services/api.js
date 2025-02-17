import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: API_URL,
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
export const registrar = async (userData) => {
  const response = await api.post("/registrar", userData);
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
  console.log("Usuario", datosActualizados);
  const response = await api.put(`/usuarios/datos-personales`, datosActualizados);
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

// Servicios para categoria
//---------------------------------------------------------------------
export const listarCategorias = async () => {
  const response = await api.get("/categorias");
  return response.data;
};

// Crear categoría
export const crearCategoria = async (categoriaData) => {
  const response = await api.post("/categorias", categoriaData);
  return response.data;
};

// Obtener una categoría por ID
export const obtenerCategoria = async (categoriaId) => {
  const response = await api.get(`/categorias/${categoriaId}`);
  return response.data;
};

// Actualizar categoría
export const actualizarCategoria = async (categoriaId, categoriaData) => {
  const response = await api.put(`/categorias/${categoriaId}`, categoriaData);
  return response.data;
};

// Eliminar categoría
export const eliminarCategoria = async (categoriaId) => {
  await api.delete(`/categorias/${categoriaId}`);
};

// Servicios para subcategorías
//---------------------------------------------------------------------

// Listar todas las subcategorías
export const listarSubcategorias = async () => {
  const response = await api.get("/subcategorias");
  return response.data;
};

// Crear una subcategoría asociada a una categoría
export const crearSubcategoria = async (subcategoriaData) => {
  const response = await api.post(`/subcategorias/${subcategoriaData.categoriaId}`, subcategoriaData);
  return response.data;
};

// Obtener una subcategoría por ID
export const obtenerSubcategoria = async (subcategoriaId) => {
  const response = await api.get(`/subcategorias/${subcategoriaId}`);
  return response.data;
};

// Actualizar una subcategoría
export const actualizarSubcategoria = async (subcategoriaId, subcategoriaData) => {
  const response = await api.put(`/subcategorias/${subcategoriaId}`, subcategoriaData);
  return response.data;
};

// Eliminar una subcategoría
export const eliminarSubcategoria = async (subcategoriaId) => {
  await api.delete(`/subcategorias/${subcategoriaId}`);
};

// Servicios para PAGO Y METODO DE PAGO
// ---------------------------------------------------------------------
// Listar Pagos
export const listarPagos = async () => {
  const response = await api.get("/pagos");
  return response.data;
};

// Eliminar pago
export const eliminarPago = async (pagoId) => {
  await api.delete(`/pagos/${pagoId}`);
};

// Obtener Pagos
export const obtenerPagos = async (pagoId) => {
  const response = await api.get(`/pagos/${pagoId}`);
  return response.data;
};



// Listar Métodos de Pago
export const listarMetodosPago = async () => {
  const response = await api.get("/metodos-pago");
  return response.data;
};

// Eliminar Método de Pago
export const eliminarMetodoPago = async (metodoId) => {
  await api.delete(`/metodos-pago/${metodoId}`);
};

// Crear Método de Pago
export const agregarMetodoPago = async (metodoData) => {
  const response = await api.post("/metodos-pago", metodoData);
  return response.data;
};

// Actualizar Método de Pago
export const actualizarMetodoPago = async (metodoId, metodoData) => {
  const response = await api.put(`/metodos-pago/${metodoId}`, metodoData);
  return response.data;
} 

// Obtener Metodos de pago
export const obtenerMetodosPago = async () => {
  const response = await api.get(`/metodos-pago/`);
  return response.data;
};


// Listar Envios
export const listarEnvios = async () => {
  const response = await api.get("/envios");
  return response.data;
};

// Listar empresas
export const listarMetodosEnvio = async () => {
  const response = await api.get("/empresas");
  return response.data;
};

// Obtener Envios
export const obtenerEnvios = async () => {
  const response = await api.get(`/envios/`);
  return response.data;
};

// Eliminar Envio
export const eliminarEnvio = async (envioId) => {
  await api.delete(`/envios/${envioId}`);
};

// Crear Método de envio
export const agregarMetodoEnvio = async (metodoData) => {
  const response = await api.post("/empresas", metodoData);
  return response.data;
};

// Actualizar Método de Envio
export const actualizarMetodoEnvio = async (metodoId, metodoData) => {
  const response = await api.put(`/empresas/${metodoId}`, metodoData);
  return response.data;
}

// Eliminar Método de Envio
export const eliminarMetodoEnvio = async (metodoId) => {
  await api.delete(`/empresas/${metodoId}`);
};

// Listar Métodos de Envio
export const listarMetodosEnvios = async () => {
  const response = await api.get("/empresas");
  return response.data;
};



export const listarActividadesRecientes = async () => {
  const response = await api.get("/actividades");
  return response.data; 
};