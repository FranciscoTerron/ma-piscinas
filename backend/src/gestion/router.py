from fastapi import APIRouter, Depends, HTTPException, Query, status, Form, File, UploadFile
from sqlalchemy.orm import Session
from src.database import get_db
from src.gestion import schemas, services, models
from src.auth.dependencies import get_current_user
from typing import List, Optional
from datetime import datetime
from src.gestion.models import MetodoPagoEnum

router = APIRouter()



# ============================================================
# Ruta para el registro 
# ============================================================

@router.post("/registrar", response_model=schemas.Usuario)
def registrar(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):

    nuevo_usuario = services.registrar_usuario(db, usuario)

    services.registrar_actividad(db, schemas.ActividadCreate(
        tipo_evento="CREACION_USUARIO",
        descripcion=f"Se registro el usuario {nuevo_usuario.nombre}",
        referencia_id=nuevo_usuario.id,
        usuario_id=nuevo_usuario.id
    ))

    return nuevo_usuario

# ============================================================
# Ruta para el login
# ============================================================

@router.post("/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    token = services.autenticar_usuario(db, request.email, request.password)
    return {"access_token": token, "token_type": "bearer"}

# Ruta para USUARIO
# -----------------------------------------------------------------------------------------
# ============================================================
# Ruta para listar usuarios
# ============================================================

@router.get("/usuarios", response_model=List[schemas.Usuario])
def listar_usuarios(db: Session = Depends(get_db)):
    return services.listar_usuarios(db)

# ============================================================
# Ruta para actualizar usuario
# ============================================================

@router.put("/usuarios/datos-personales", response_model=schemas.Usuario)
def actualizar_datos_personales(
    datos_actualizados: schemas.UsuarioUpdate,
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return services.actualizar_datos_personales(db, current_user.id, datos_actualizados)

# ============================================================
# Ruta para actualizar contraseña de usuario
# ============================================================

@router.put("/usuarios/{usuario_id}/contrasena", response_model=schemas.Usuario)
def actualizar_contrasena(
    usuario_id: int,
    contrasena_actualizada: schemas.UsuarioUpdatePassword,
    db: Session = Depends(get_db),
):
    return services.actualizar_contrasena(db, usuario_id, contrasena_actualizada.nueva_contrasena)


# ============================================================
# Ruta para eliminar usuario
# ============================================================

@router.delete("/usuarios/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    services.eliminar_usuario(db, usuario_id)
    return None

# Ruta para ROLES
# -----------------------------------------------------------------------------------------
# ============================================================
# Ruta para listar roles
# ============================================================
@router.get("/roles", response_model=List[schemas.ObtenerRol])
def listar_roles(db: Session = Depends(get_db)):
    return services.listar_roles(db)


# ============================================================
# Ruta para obtener rol por ID
# ============================================================

@router.get("/roles/{rol_id}", response_model=schemas.ObtenerRol)
def obtener_rol(rol_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un rol específico por su ID.
    """
    rol = services.obtener_rol_por_id(db, rol_id)
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return rol

# ============================================================
# Ruta para actualizar rol de usuario
# ============================================================

@router.put("/usuarios/{usuario_id}/rol", response_model=schemas.Usuario)
def actualizar_rol_usuario(usuario_id: int, nuevo_rol: schemas.RolUpdate, db: Session = Depends(get_db)):
    """
    Actualiza el rol de un usuario específico.
    """
    return services.actualizar_rol_usuario(db, usuario_id, nuevo_rol.rol_id)


# RUTAS PARA CATEGORIA
#-------------------------------------------------------------------------------------------

# ============================================================
# Ruta para crear categorias
# ============================================================
@router.post("/categorias", response_model=schemas.CategoriaProducto, status_code=status.HTTP_201_CREATED)
def crear_categoria(categoria: schemas.CategoriaProductoBase, db: Session = Depends(get_db)):
    return services.crear_categoria(db, categoria)

# ============================================================
# Ruta para listar categorias
# ============================================================
@router.get("/categorias", response_model=list[schemas.CategoriaProducto])
def listar_categorias(db: Session = Depends(get_db)):
    return services.listar_categorias(db)

# ============================================================
# Ruta para obtener categoria por id
# ============================================================
@router.get("/categorias/{categoria_id}", response_model=schemas.CategoriaProducto)
def obtener_categoria(categoria_id: int, db: Session = Depends(get_db)):
    return services.obtener_categoria_por_id(db, categoria_id)

# ============================================================
# Ruta para actualizar categoria
# ============================================================
@router.put("/categorias/{categoria_id}", response_model=schemas.CategoriaProducto)
def actualizar_categoria(categoria_id: int, categoria_update: schemas.CategoriaProductoBase, db: Session = Depends(get_db)):
    return services.actualizar_categoria(db, categoria_id, categoria_update)


# ============================================================
# Ruta eliminar categoria
# ============================================================
@router.delete("/categorias/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    services.eliminar_categoria(db, categoria_id)
    return {"message": "Categoría eliminada correctamente"}

# ============================================================
# Ruta para crear una subcategoría
# ============================================================
@router.post("/subcategorias/{categoria_id}", response_model=schemas.SubCategoria, status_code=status.HTTP_201_CREATED)
def crear_subcategoria(categoria_id: int, subcategoria: schemas.SubCategoriaBase, db: Session = Depends(get_db)):
    return services.crear_subcategoria(db, subcategoria, categoria_id)

# ============================================================
# Ruta para listar subcategorías
# ============================================================
@router.get("/subcategorias", response_model=list[schemas.SubCategoria])
def listar_subcategorias(db: Session = Depends(get_db)):
    return services.listar_subcategorias(db)

# ============================================================
# Ruta para obtener una subcategoría por ID
# ============================================================
@router.get("/subcategorias/{subcategoria_id}", response_model=schemas.SubCategoria)
def obtener_subcategoria(subcategoria_id: int, db: Session = Depends(get_db)):
    return services.obtener_subcategoria_por_id(db, subcategoria_id)

# ============================================================
# Ruta para actualizar una subcategoría
# ============================================================
@router.put("/subcategorias/{subcategoria_id}", response_model=schemas.SubCategoria)
def actualizar_subcategoria(subcategoria_id: int, subcategoria_update: schemas.SubCategoriaBase, db: Session = Depends(get_db)):
    return services.actualizar_subcategoria(db, subcategoria_id, subcategoria_update)

# ============================================================
# Ruta para eliminar una subcategoría
# ============================================================
@router.delete("/subcategorias/{subcategoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_subcategoria(subcategoria_id: int, db: Session = Depends(get_db)):
    services.eliminar_subcategoria(db, subcategoria_id)
    return {"message": "Subcategoría eliminada correctamente"}

# RUTAS PARA PRODUCTO
#-------------------------------------------------------------------------------------------

# ============================================================
# Ruta para crear producto
# ============================================================
@router.post("/productos", response_model=schemas.Producto, status_code=status.HTTP_201_CREATED)
def crear_producto(
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...),
    stock: int = Form(...),
    categoria_id: int = Form(...),
    imagen: UploadFile = File(...),
    usuario_id: int = Form(...),  
    db: Session = Depends(get_db)
):
    nuevo_producto = services.crear_producto(db, nombre, descripcion, precio, stock, categoria_id, imagen)

    services.registrar_actividad(db, schemas.ActividadCreate(
        tipo_evento="CREACION_PRODUCTO",
        descripcion=f"Se creó el producto {nombre}",
        referencia_id=nuevo_producto.id,
        usuario_id=usuario_id
    ))

    return nuevo_producto

# ============================================================
# Ruta para listar productos
# ============================================================

@router.get("/productos", response_model=List[schemas.Producto])
def listar_productos(db: Session = Depends(get_db)):
    return services.listar_productos(db)

# ============================================================
# Ruta para obtener los productos por ID
# ============================================================

@router.get("/productos/{producto_id}", response_model=schemas.Producto)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    return services.obtener_producto_por_id(db, producto_id)

# ============================================================
# Ruta para actualizar productos
# ============================================================
@router.put("/productos/{producto_id}", response_model=schemas.Producto)
def actualizar_producto(
    producto_id: int,
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...),
    stock: int = Form(...),
    categoria_id: int = Form(...),
    imagen: Optional[UploadFile] = File(None),
    usuario_id: int = Form(...),
    db: Session = Depends(get_db),
):
    return services.actualizar_producto(db, producto_id, nombre, descripcion, precio, stock, categoria_id, imagen)

# ============================================================
# Ruta para eliminar productos
# ============================================================
@router.delete("/productos/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    services.eliminar_producto(db, producto_id)
    return None


# RUTAS PARA ENVIO
#-----------------------------------------------------------------------------------------------------

# ============================================================
# Ruta para crear envio
# ============================================================@router.post("/envios", response_model=schemas.Envio, status_code=status.HTTP_201_CREATED)
def crear_envio(envio: schemas.EnvioCreate, db: Session = Depends(get_db)):
    return services.crear_envio(db, envio)

# ============================================================
# Ruta para listar envios
# ============================================================
@router.get("/envios", response_model=List[schemas.Envio])
def listar_envios(db: Session = Depends(get_db)):
    return services.listar_envios(db)

# ============================================================
# Ruta para obtener los envios por ID
# ============================================================
@router.get("/envios/{envio_id}", response_model=schemas.Envio)
def obtener_envio(envio_id: int, db: Session = Depends(get_db)):
    return services.obtener_envio_por_id(db, envio_id)

# ============================================================
# Ruta para actualizar envio
# ============================================================
@router.put("/envios/{envio_id}", response_model=schemas.Envio)
def actualizar_envio(envio_id: int, envio_update: schemas.EnvioBase, db: Session = Depends(get_db)):
    return services.actualizar_envio(db, envio_id, envio_update)

# ============================================================
# Ruta para eliminar envios
# ============================================================
@router.delete("/envios/{envio_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_envio(envio_id: int, db: Session = Depends(get_db)):
    services.eliminar_envio(db, envio_id)
    return None

# ============================================================
# Crear una empresa
# ============================================================
@router.post("/empresas", response_model=schemas.Empresa, status_code=status.HTTP_201_CREATED)
def crear_empresa(
    nombre: str = Form(...),
    direccion: str = Form(...),
    telefono: int = Form(...),
    imagen: UploadFile = File(None),  
    db: Session = Depends(get_db)
):
    return services.crear_empresa(db, nombre, direccion, telefono, imagen)

# ============================================================
# Listar todas las empresas
# ============================================================
@router.get("/empresas", response_model=List[schemas.Empresa])
def listar_empresas(db: Session = Depends(get_db)):
    return services.listar_empresas(db)

# ============================================================
# Obtener una empresa por ID
# ============================================================
@router.get("/empresas/{empresa_id}", response_model=schemas.Empresa)
def obtener_empresa(empresa_id: int, db: Session = Depends(get_db)):
    return services.obtener_empresa_por_id(db, empresa_id)

# ============================================================
# Actualizar una empresa
# ============================================================
@router.put("/empresas/{empresa_id}", response_model=schemas.Empresa)
def actualizar_empresa(
    empresa_id: int, 
    nombre: str = Form(...),
    direccion: str = Form(...),
    telefono: int = Form(...),
    imagen: UploadFile = File(None), 
    db: Session = Depends(get_db)
    ):
    return services.actualizar_empresa(db, empresa_id, nombre, direccion, telefono, imagen)

# ============================================================
# Eliminar una empresa
# ============================================================
@router.delete("/empresas/{empresa_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    services.eliminar_empresa(db, empresa_id)
    return None

#PAGO
#-----------------------------------------------------------------------------
# Rutas para Pagos

# ============================================================
# Ruta para crear un pago
# ============================================================
@router.post("/pagos", response_model=schemas.Pago, status_code=status.HTTP_201_CREATED)
def crear_pago(pago: schemas.PagoBase, db: Session = Depends(get_db)):
    return services.crear_pago(db, pago)

# ============================================================
# Ruta para listar todos los pagos
# ============================================================
@router.get("/pagos", response_model=List[schemas.Pago])
def listar_pagos(db: Session = Depends(get_db)):
    return services.listar_pagos(db)

# ============================================================
# Ruta para obtener los pagos por ID
# ============================================================
@router.get("/pagos/{pago_id}", response_model=schemas.Pago)
def obtener_pago(pago_id: int, db: Session = Depends(get_db)):
    return services.obtener_pago(db, pago_id)

# ============================================================
# Ruta para eliminar pago
# ============================================================
@router.delete("/pagos/{pago_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pago(pago_id: int, db: Session = Depends(get_db)):
    services.eliminar_pago(db, pago_id)
    return None

#METODO DE PAGO
#-----------------------------------------------------------------------------
# Rutas para Metodo de pago

# ============================================================
# Ruta para crear un método de pago
# ============================================================
@router.post("/metodos-pago", response_model=schemas.MetodoPago, status_code=status.HTTP_201_CREATED)
def crear_metodo_pago(
    nombre: str = Form(...),
    tipo: models.MetodoPagoEnum = Form(...),  # Asegúrate de que el tipo sea parte del formulario
    imagen: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    return services.crear_metodo_pago(db, nombre, tipo, imagen)


# ============================================================
# Ruta para listar todos los métodos de pago
# ============================================================
@router.get("/metodos-pago", response_model=List[schemas.MetodoPago])
def listar_metodos_pago(db: Session = Depends(get_db)):
    return services.listar_metodos_pago(db)

# ============================================================
# Ruta para obtener un método de pago por ID
# ============================================================
@router.get("/metodos-pago/{metodo_pago_id}", response_model=schemas.MetodoPago)
def obtener_metodo_pago(metodo_pago_id: int, db: Session = Depends(get_db)):
    return services.obtener_metodo_pago(db, metodo_pago_id)

# ============================================================
# Ruta para eliminar un método de pago
# ============================================================
@router.delete("/metodos-pago/{metodo_pago_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_metodo_pago(metodo_pago_id: int, db: Session = Depends(get_db)):
    services.eliminar_metodo_pago(db, metodo_pago_id)
    return None

# ============================================================
# Ruta para actualizar un método de pago
# ============================================================
@router.put("/metodos-pago/{metodo_pago_id}", response_model=schemas.MetodoPago)
def actualizar_metodo_pago(
    metodo_pago_id: int, 
    nombre: str = Form(...),  
    tipo: models.MetodoPagoEnum = Form(...),  
    imagen: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    return services.actualizar_metodo_pago(db, metodo_pago_id, nombre, tipo, imagen)

#PEDIDO
#-----------------------------------------------------------------------------
# Rutas para Pedidos
# ============================================================
# Ruta para crear pedido
# ============================================================
@router.post("/pedidos", response_model=schemas.Pedido, status_code=status.HTTP_201_CREATED)
def crear_pedido(pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo pedido y lo guarda en la base de datos.
    """
    return services.crear_pedido(db, pedido)

# ============================================================
# Ruta para listar todos los pedidos
# ============================================================
@router.get("/pedidos", response_model=List[schemas.Pedido])
def listar_pedidos(db: Session = Depends(get_db)):
    """
    Retorna la lista de todos los pedidos.
    """
    return services.listar_pedidos(db)

# ============================================================
# Ruta para obtener un pedido por su ID
# ============================================================
@router.get("/pedidos/{pedido_id}", response_model=schemas.Pedido)
def obtener_pedido(pedido_id: int, db: Session = Depends(get_db)):
    """
    Retorna los detalles de un pedido en particular.
    """
    pedido = services.obtener_pedido_por_id(db, pedido_id)
    return pedido

# ============================================================
# Ruta obtener pedidos de un usuario
# ============================================================

@router.get("/pedidos/usuario/{usuario_id}", response_model=List[schemas.Pedido])
def obtener_pedidos_por_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """
    Retorna la lista de pedidos asociados a un usuario.
    """
    pedidos = services.obtener_pedidos_por_usuario(db, usuario_id)
    return pedidos

# ============================================================
# Ruta para actualizar un pedido existente
# ============================================================

@router.put("/pedidos/{pedido_id}", response_model=schemas.Pedido)
def actualizar_pedido(pedido_id: int, pedido_update: schemas.PedidoUpdate, db: Session = Depends(get_db)):
    """
    Actualiza la información de un pedido existente.
    """
    return services.actualizar_pedido(db, pedido_id, pedido_update)

# ============================================================
# Ruta para eliminar un pedido
# ============================================================
@router.delete("/pedidos/{pedido_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    """
    Elimina un pedido de la base de datos.
    """
    services.eliminar_pedido(db, pedido_id)
    return None

# ============================================================
# Ruta para cancelar el pedido
# ============================================================

@router.put("/pedidos/{pedido_id}/cancelar", response_model=schemas.Pedido)
def cancelar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    """
    Cambia el estado del pedido a 'cancelado'.
    """
    pedido = services.cancelar_pedido(db, pedido_id)
    return pedido


# ============================================================
# Ruta para actualizar el estado del pedido
# ============================================================

@router.put("/pedidos/{pedido_id}/estado", response_model=schemas.Pedido)
def actualizar_estado_pedido(pedido_id: int, estado_update: schemas.PedidoEstadoUpdate, db: Session = Depends(get_db)):
    """
    Actualiza el estado de un pedido.
    """
    pedido = services.actualizar_estado_pedido(db, pedido_id, estado_update.estado)
    return pedido

#DETALLE PEDIDO
#-----------------------------------------------------------------------------------------
# ============================================================
# Ruta para crear detalle pedido
# ============================================================
@router.post("/pedido-detalles", response_model=schemas.PedidoDetalle, status_code=status.HTTP_201_CREATED)
def crear_pedido_detalle(detalle: schemas.PedidoDetalleCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo detalle de pedido.
    """
    return services.crear_pedido_detalle(db, detalle)

# ============================================================
# Ruta para listar detalles de pedidos
# ============================================================

@router.get("/pedido-detalles", response_model=List[schemas.PedidoDetalle])
def listar_pedido_detalles(db: Session = Depends(get_db)):
    """
    Retorna una lista de todos los detalles de pedido.
    """
    return services.listar_pedido_detalles(db)

# ============================================================
# Ruta para obtener detalles por ID
# ============================================================

@router.get("/pedido-detalles/{detalle_id}", response_model=schemas.PedidoDetalle)
def obtener_pedido_detalle(detalle_id: int, db: Session = Depends(get_db)):
    """
    Retorna el detalle de pedido correspondiente al ID proporcionado.
    """
    return services.obtener_pedido_detalle_por_id(db, detalle_id)

# ============================================================
# Ruta para actualizar un detalle existente
# ============================================================

@router.put("/pedido-detalles/{detalle_id}", response_model=schemas.PedidoDetalle)
def actualizar_pedido_detalle(detalle_id: int, detalle_update: schemas.PedidoDetalleBase, db: Session = Depends(get_db)):
    """
    Actualiza un detalle de pedido existente.
    """
    return services.actualizar_pedido_detalle(db, detalle_id, detalle_update)

# ============================================================
# Ruta para eliminar detalles de pedidos
# ============================================================

@router.delete("/pedido-detalles/{detalle_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pedido_detalle(detalle_id: int, db: Session = Depends(get_db)):
    """
    Elimina el detalle de pedido con el ID especificado.
    """
    services.eliminar_pedido_detalle(db, detalle_id)
    return None


# ============================================================
# Obtener todos los detalles de un pedido especifico
# ============================================================

@router.get("/pedidos/{pedido_id}/detalles", response_model=List[schemas.PedidoDetalle])
def obtener_detalles_por_pedido(pedido_id: int, db: Session = Depends(get_db)):
    """
    Retorna todos los detalles asociados a un pedido.
    """
    detalles = services.obtener_detalles_por_pedido(db, pedido_id)
    return detalles


# ============================================================
# Agregar un detalle a un pedido 
# ============================================================

@router.post("/pedidos/{pedido_id}/detalles", response_model=schemas.PedidoDetalle, status_code=status.HTTP_201_CREATED)
def agregar_detalle_a_pedido(pedido_id: int, detalle: schemas.PedidoDetalleBase, producto_id: int, db: Session = Depends(get_db)):
    """
    Agrega un nuevo detalle a un pedido existente.
    Se asume que el producto se identifica mediante 'producto_id' enviado como query o parámetro adicional.
    """
    return services.agregar_detalle_a_pedido(db, pedido_id, producto_id, detalle)


#Carrito
# ============================================================
# Crear carrito
# ============================================================
@router.post("/carritos", response_model=schemas.Carrito, status_code=status.HTTP_201_CREATED)
def crear_carrito(
    carrito_data: schemas.CarritoBase,
    current_user: schemas.Usuario = Depends(get_current_user), #Con esto miramos el usuario actual
    db: Session = Depends(get_db)
):
    carrito = services.create_carrito(db, carrito_data, current_user.id)
    return carrito

# ============================================================
# Obtener todos los carritos
# ============================================================

@router.get("/carritos", response_model=List[schemas.Carrito])
def obtener_carritos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtiene la lista de todos los carritos."""
    return services.listar_carritos(db, skip, limit)


# ----------------------------------------------------
# Obtener el carrito del usuario autenticado
# ----------------------------------------------------
@router.get("/carritos/{usuario_id}", response_model=schemas.Carrito)
def obtener_carrito_usuario(
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    carrito = services.obtener_carrito_por_usuario(db, current_user.id)
    if not carrito:
        raise HTTPException(status_code=404, detail="Carrito no encontrado para el usuario")
    return carrito

# ----------------------------------------------------
# Agregar un producto al carrito
# ----------------------------------------------------
@router.post("/carritos/productos", response_model=schemas.CarritoDetalle, status_code=status.HTTP_201_CREATED)
def agregar_producto_al_carrito(
    detalle_data: schemas.CarritoDetalleBase,
    producto_id: int = Query(..., description="ID del producto a agregar"),
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Obtener el carrito activo del usuario; si no existe, se puede crear uno.
    carrito = services.obtener_carrito_por_usuario(db, current_user.id)
    if not carrito:
        # Si no existe carrito, se crea uno nuevo usando valores por defecto.
        carrito = services.create_carrito(db, schemas.CarritoBase(), current_user.id)
    detalle = services.agregar_producto_al_carrito(db, carrito.id, producto_id, detalle_data)
    return detalle

# ----------------------------------------------------
# Actualizar la cantidad de un producto en el carrito
# ----------------------------------------------------
@router.put("/carritos/productos", response_model=schemas.CarritoDetalle)
def actualizar_cantidad_producto(
    producto_id: int = Query(..., description="ID del producto a actualizar"),
    nueva_cantidad: int = Query(..., description="Nueva cantidad para el producto"),
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    carrito = services.obtener_carrito_por_usuario(db, current_user.id)
    if not carrito:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")
    detalle = services.actualizar_cantidad_producto(db, carrito.id, producto_id, nueva_cantidad)
    return detalle

# ----------------------------------------------------
# Eliminar un producto del carrito
# ----------------------------------------------------
@router.delete("/carritos/productos", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto_del_carrito(
    producto_id: int = Query(..., description="ID del producto a eliminar"),
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    carrito = services.obtener_carrito_por_usuario(db, current_user.id)
    if not carrito:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")
    services.eliminar_producto_del_carrito(db, carrito.id, producto_id)
    return {"detail": "Producto eliminado del carrito"}


# DETALLE CARRITO
#----------------------------------------------------------------------------

# ============================================================
# Ruta para crear detalle 
# ============================================================

@router.post("/carritosdetalles/", response_model=schemas.CarritoDetalle, status_code=status.HTTP_201_CREATED)
def crear_detalle_carrito(
    carrito_id: int,
    detalle_data: schemas.CarritoDetalleBase,
    producto_id: int = Query(..., description="ID del producto a agregar al carrito"),
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo detalle para el carrito indicado.  
    Se espera recibir el ID del producto como parámetro de query.
    """
    detalle = services.crear_detalle(db, detalle_data, carrito_id, producto_id)
    return detalle

# ============================================================
# Listar los detalles de un carrito en particular
# ============================================================

@router.get("/carritosdetalles/", response_model=List[schemas.CarritoDetalle])
def listar_detalles(
    carrito_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Lista los detalles del carrito indicado."""
    return services.listar_detalles(db, carrito_id, skip, limit)

# ============================================================
# Obtener un detalle de un carrito puntual
# ============================================================

@router.get("/carritosdetalles/{detalle_id}", response_model=schemas.CarritoDetalle)
def obtener_detalle(carrito_id: int, detalle_id: int, db: Session = Depends(get_db)):
    """Obtiene un detalle específico del carrito."""
    detalle = services.obtener_detalle(db, detalle_id)
    if not detalle or detalle.carrito_id != carrito_id:
        raise HTTPException(status_code=404, detail="Detalle del carrito no encontrado")
    return detalle  

#ACTIVIDADES
#----------------------------------------------------------------------------
# ============================================================
# Registrar una nueva actividad
# ============================================================
@router.post("/actividades", response_model=schemas.Actividad, status_code=status.HTTP_201_CREATED)
def registrar_actividad_api(
    actividad_data: schemas.ActividadCreate,
    db: Session = Depends(get_db)
):
    return services.registrar_actividad(db, actividad_data)
# ============================================================
# Obtener actividades recientes
# ============================================================
@router.get("/actividades", response_model=List[schemas.Actividad])
def listar_actividades(db: Session = Depends(get_db)):
    return services.listar_actividades(db)

# ============================================================
# Obtener Reportes
# ============================================================
@router.get("/reportes/usuario_mas_activo", response_model=dict)
def obtener_usuario_mas_activo(db: Session = Depends(get_db)):
    return services.obtener_usuario_mas_activo(db)
