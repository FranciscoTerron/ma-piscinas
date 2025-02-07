from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.gestion import schemas, services
from src.auth.dependencies import get_current_user
from typing import List

router = APIRouter()



# ============================================================
# Ruta para el registro 
# ============================================================

@router.post("/register", response_model=schemas.Usuario)
def register(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return services.registrar_usuario(db, usuario)

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

@router.put("/usuarios/{usuario_id}/datos-personales", response_model=schemas.Usuario)
def actualizar_datos_personales(
    usuario_id: int,
    datos_actualizados: schemas.UsuarioUpdate,
    db: Session = Depends(get_db),
):
    return services.actualizar_datos_personales(db, usuario_id, datos_actualizados)

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


# RUTAS PARA PRODUCTO
#-------------------------------------------------------------------------------------------

# ============================================================
# Ruta para crear producto
# ============================================================
@router.post("/productos", response_model=schemas.Producto, status_code=status.HTTP_201_CREATED)
def crear_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    return services.crear_producto(db, producto)

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
    producto_update: schemas.ProductoBase,
    db: Session = Depends(get_db),
):
    return services.actualizar_producto(db, producto_id, producto_update)

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