import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: API_URL,
});


// Interceptores para manejar tokens de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Intenta refrescar el token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
          const { token } = response.data;
          localStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (error) {
          // Si el refresh token falla, redirige al login
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


// Servicios para Usuarios-------------------------------------------
export const registrar = async (userData) => {
  const response = await api.post("/registrar", userData);
  return response.data;
};

export const obtenerUsuarioPorId = async (usuarioId) => {
  try {
    const response = await api.get(`/usuarios/${usuarioId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const login = async (nombreUsuario, password) => {
  const response = await axios.post(
    'http://127.0.0.1:8000/login',
    { nombreUsuario, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  localStorage.setItem('token', response.data.access_token); 
  return response;
};

export const listarUsuarios = async (paginaActual, usuariosPorPagina) => {
  const response = await api.get("/usuarios", {
    params: {
      pagina: paginaActual,
      tamanio: usuariosPorPagina
    }
  });
  return response.data;
};

export const actualizarDatosPersonales = async (usuarioId, datosActualizados) => {
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

export const listarProductos = async (paginaActual, subProductosPorPagina) => {
    const response = await api.get("/productos", {
      params: {
        pagina: paginaActual,
        tamanio: subProductosPorPagina
      }
    });
    return response.data;
  };



export const obtenerProductosDescuento = async (paginaActual, productosPorPagina) => {
    const response = await api.get("/productos/descuento", {
      params: {
        pagina: paginaActual,
        tamanio: productosPorPagina
      }
    });
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

export const verificarNombreProducto = async (nombre) => {
  try {
    const response = await api.get("/productos/verificar-nombre", {
      params: { nombre }
    });
    return response.data.existe;
  } catch (error) {
    console.error("Error en verificarNombreProducto:", error.response?.data || error.message);
    throw error;
  }
};
// Servicios para categoria
//---------------------------------------------------------------------
export const listarCategorias = async (paginaActual, categoriasPorPagina) => {
  const response = await api.get("/categorias", {
    params: {
      pagina: paginaActual,
      tamanio: categoriasPorPagina
    }
  });
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

// Listar todas las subcategorías con filtro opcional por categoria_id
export const listarSubcategorias = async (paginaActual, subCategoriasPorPagina, categoriaId = null) => {
  const response = await api.get("/subcategorias", {
    params: {
      pagina: paginaActual,
      tamanio: subCategoriasPorPagina,
      categoria_id: categoriaId, // Añadimos el filtro por categoría
    },
  });
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
export const listarPagos = async (paginaActual, porPagina) => {
  const response = await api.get("/pagos", {
    params: {
      pagina: paginaActual,
      tamanio: porPagina
    }
  });
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
export const listarMetodosPago = async (paginaActual, porPagina) => {
  const response = await api.get("/metodos-pago", {
    params: {
      pagina: paginaActual,
      tamanio: porPagina
    }
  });
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
export const listarEnvios = async (paginaActual, porPagina) => {
  const response = await api.get("/envios", {
    params: {
      pagina: paginaActual,
      tamanio: porPagina
    }
  });
  return response.data;
};

// Listar empresas
export const listarMetodosEnvio = async (paginaActual, porPagina) => {
  const response = await api.get("/empresas", {
    params: {
      pagina: paginaActual,
      tamanio: porPagina
    }
  });
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

export const listarActividadesRecientes = async (paginaActual, actividadesPorPagina) => {
  const response = await api.get("/actividades", {
    params: {
      pagina: paginaActual,
      tamanio: actividadesPorPagina
    }
  });
  return response.data;
};

export const obtenerTopUsuariosMasActivos = async () => {
  try {
    const response = await axios.get('http://localhost:8000/reportes/usuarios_mas_activos');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo top usuarios más activos', error);
    return [];
  }
};

// Servicios para Pedidos
// ---------------------------------------------------------------------
export const listarPedidos = async (paginaActual, pedidosPorPagina) => {
  const response = await api.get("/pedidos", {
    params: {
      pagina: paginaActual,
      tamanio: pedidosPorPagina
    }
  });
  return response.data;
};

export const listarPedidoDetalles = async (pedidoId) => {
  const response = await api.get(`/pedidos/${pedidoId}/detalles`);
  return response.data;
};

export const obtenerPedidosUsuario = async (usuarioId) => {
  const response = await api.get(`/pedidos/usuario/${usuarioId}`);
  return response.data;
}

export const cancelarPedido = async (pedidoId) => {
  await api.put(`/pedidos/${pedidoId}/cancelar`);
};

export const crearPedido = async (pedidoData) => {
  const response = await api.post("/pedidos", pedidoData);
  return response.data;
};

export const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
  const response = await api.put(`/pedidos/${pedidoId}/estado`, { id: pedidoId, estado: nuevoEstado });
  return response.data;
}

// Servicios para Carrito
//---------------------------------------------------------------------
// Obtener el carrito del usuario autenticado (o crearlo si no existe)
export const obtenerCarrito = async () => {
  const response = await api.get("/carritos");
  return response.data;
};

// Agregar un producto al carrito
export const agregarProductoAlCarrito = async (productoId, detalleData) => {
  const response = await api.post(`/carritos/productos?producto_id=${productoId}`, detalleData);
  return response.data;
};

// Actualizar la cantidad de un producto en el carrito
export const actualizarCantidadProducto = async (productoId, nuevaCantidad) => {
  const response = await api.patch(`/carritos/productos/${productoId}`, null, {
    params: { nueva_cantidad: nuevaCantidad }
  });
  return response.data;
};

// Eliminar un producto del carrito
export const eliminarProductoDelCarrito = async (productoId) => {
  await api.delete(`/carritos/productos/${productoId}`);
};

// Listar detalles del carrito
export const listarDetallesCarrito = async () => {
  const response = await api.get("/carritos/detalles");
  return response.data;
};

// Vaciar el carrito
export const vaciarCarrito = async () => {
  await api.delete("/carritos/vaciar");
};

// Servicios para Reportes
// ---------------------------------------------------------------------

/**
 * Obtiene las ventas agrupadas por período (diario, semanal, mensual)
 */
export const obtenerVentasPorPeriodo = async (tipoPeriodo, fechaInicio, fechaFin) => {
  try {
    const response = await api.get("/reportes/ventas-periodo", {
      params: {
        tipo_periodo: tipoPeriodo,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo ventas por período:", error);
    return [];
  }
};

/**
 * Obtiene la estacionalidad de los productos (ventas mensuales por producto)
 */
export const obtenerEstacionalidadProductos = async (anio) => {
  try {
    const response = await api.get("/reportes/estacionalidad-productos", {
      params: { anio },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo estacionalidad de productos:", error);
    return [];
  }
};

/**
 * Obtiene el análisis de costos vs ganancias
 */
export const obtenerCostosGanancias = async (productoId = null, categoriaId = null) => {
  try {
    const response = await api.get("/reportes/costos-ganancias", {
      params: { producto_id: productoId, categoria_id: categoriaId },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo costos vs ganancias:", error);
    return [];
  }
};

/**
 * Obtiene el porcentaje de pedidos cancelados y su evolución histórica
 */
export const obtenerMetricasCancelaciones = async (mesesHistorial) => {
  try {
    const response = await api.get("/reportes/pedidos-cancelados", {
      params: { meses_historial: mesesHistorial },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo métricas de cancelaciones:", error);
    return {
      total_pedidos: 0,
      pedidos_cancelados: 0,
      porcentaje_cancelados: 0,
      ultimos_3_meses: {},
    };
  }
};
// Crear un descuento
export const crearDescuento = async (descuentoData) => {
  const response = await api.post("/descuentos/", descuentoData);
  return response.data;
};

// Listar descuentos
export const listarDescuentos = async (paginaActual, descuentosPorPagina) => {
  const response = await api.get("/descuentos", {
    params: {
      pagina: paginaActual,
      tamanio: descuentosPorPagina
    }
  });
  return response.data;
};


// Obtener un descuento por ID
export const obtenerDescuentoPorId = async (descuentoId) => {
  const response = await api.get(`/descuentos/${descuentoId}`);
  return response.data;
};

// Actualizar descuento
export const actualizarDescuento = async (descuentoId, descuentoData) => {
  const response = await api.put(`/descuentos/${descuentoId}`, descuentoData);
  return response.data;
};

// Eliminar descuento
export const eliminarDescuento = async (descuentoId) => {
  await api.delete(`/descuentos/${descuentoId}`);
};

// Crear una dirección de envío
export const crearDireccionEnvio = async (direccionData) => {
  const formData = new FormData();
  formData.append("ciudad", direccionData.ciudad);
  formData.append("codigo_postal", direccionData.codigo_postal);
  formData.append("provincia", direccionData.provincia);
  formData.append("direccion", direccionData.direccion);
  formData.append("usuario_id", direccionData.usuario_id);

  const response = await api.post("/direcciones-envio", formData, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
  return response.data;
};

// Obtener todas las direcciones de envío de un usuario
export const obtenerDireccionesEnvioUsuario = async (usuarioId) => {
  const response = await api.get(`/direcciones-envio/usuario/${usuarioId}`);
  return response.data;
};

// Actualizar una dirección de envío
export const actualizarDireccionEnvio = async (direccionId, direccionData) => {
  const formData = new FormData();
  formData.append("ciudad", direccionData.ciudad);
  formData.append("codigo_postal", direccionData.codigo_postal);
  formData.append("provincia", direccionData.provincia);
  formData.append("direccion", direccionData.direccion);
  formData.append("usuario_id", direccionData.usuario_id);

  const response = await api.put(`/direcciones-envio/${direccionId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
  return response.data;
};

// Eliminar una dirección de envío
export const eliminarDireccionEnvio = async (direccionId) => {
  await api.delete(`/direcciones-envio/${direccionId}`);
};

// Obtener una dirección de envío por ID
export const obtenerDireccionEnvioPorId = async (direccionId) => {
  const response = await api.get(`/direcciones-envio/${direccionId}`);
  return response.data;
};

export const crearComentario = async (comentario) => {
  const response = await api.post(`/productos/${comentario.producto_id}/comentarios`, comentario);
  return response.data;
};

export const obtenerComentariosProducto = async (productoId) => {
  const response = await api.get(`/productos/${productoId}/comentarios`);
  return response.data;
};


export const eliminarComentario = async (comentario) => {
  await api.delete(`/comentarios/${comentario}`);
};