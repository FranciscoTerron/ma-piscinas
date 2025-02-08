from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from src.gestion.models import Usuario, Rol, CategoriaProducto, Producto, Envio, Pago, Pedido, PedidoDetalle, Carrito, CarritoDetalle
from src.gestion import schemas, exceptions
from src.utils.jwt import create_access_token
from passlib.context import CryptContext
from datetime import datetime, UTC, timedelta
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CRUD para Usuario
def registrar_usuario(db: Session, usuario: schemas.UsuarioCreate) -> Usuario:
    # Verificar si el email ya está registrado
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise exceptions.EmailYaRegistrado()
    rol_cliente = db.query(Rol).filter(Rol.nombre == "cliente").first()
    if not rol_cliente:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="El rol de cliente no está configurado en la base de datos",
        )
    
    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        telefono=usuario.telefono,
        direccion=usuario.direccion,
        rol_id=rol_cliente.id  # Asignar el rol de "cliente", cuando recien se registra
    )
    nuevo_usuario.set_password(usuario.password)
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

def autenticar_usuario(db: Session, nombre: str, password: str):
    user = db.query(Usuario).filter(Usuario.nombre == nombre).first()
    if not user or not user.verify_password(password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    rol = db.query(Rol).filter(Rol.id == user.rol_id).first()
    
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "name": user.nombre, "rol": rol.nombre}, expires_delta=access_token_expires
    )
    return access_token

def listar_usuarios(db: Session) -> list[schemas.UsuarioRespuesta]:
    return db.query(Usuario).all()

def obtener_usuario_por_id(db: Session, usuario_id: int) -> Usuario:
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise exceptions.UsuarioNoEncontrado()
    return usuario

def actualizar_datos_personales(
    db: Session, usuario_id: int, datos_actualizados: schemas.UsuarioBase
) -> Usuario:
    usuario = obtener_usuario_por_id(db, usuario_id)
    for key, value in datos_actualizados.dict().items():
        setattr(usuario, key, value)
    db.commit()
    db.refresh(usuario)
    return usuario

def actualizar_contrasena(
    db: Session, usuario_id: int, nueva_contrasena: str
) -> Usuario:
    usuario = obtener_usuario_por_id(db, usuario_id)
    usuario.set_password(nueva_contrasena)
    db.commit()
    db.refresh(usuario)
    return usuario

def eliminar_usuario(db: Session, usuario_id: int) -> None:
    usuario = obtener_usuario_por_id(db, usuario_id)
    db.delete(usuario)
    db.commit()
    
# ROLES     
# ----------------------------------------------------------------------------------------------
def listar_roles(db: Session) -> list[schemas.ObtenerRol]:
    return db.query(Rol).all()

def obtener_rol_por_id(db: Session, rol_id: int) -> Rol:
    rol = db.query(Rol).filter(Rol.id == rol_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return rol

def actualizar_rol_usuario(db: Session, usuario_id: int, nuevo_rol_id: int):
    """
    Actualiza el rol de un usuario en la base de datos.
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    rol = db.query(Rol).filter(Rol.id == nuevo_rol_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    usuario.rol_id = nuevo_rol_id
    db.commit()
    db.refresh(usuario)
    return usuario



#CATEGORIAS
#------------------------------------------------------------------------------------------------
# Crear una nueva categoría
def crear_categoria(db: Session, categoria: schemas.CategoriaProductoBase) -> CategoriaProducto:
    db_categoria = CategoriaProducto(
        nombre=categoria.nombre,
        descripcion=categoria.descripcion
    )
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

# Listar todas las categorías
def listar_categorias(db: Session):
    return db.query(CategoriaProducto).all()

# Obtener una categoría por ID
def obtener_categoria_por_id(db: Session, categoria_id: int) -> CategoriaProducto:
    categoria = db.query(CategoriaProducto).filter(CategoriaProducto.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

# Actualizar una categoría existente
def actualizar_categoria(db: Session, categoria_id: int, categoria_update: schemas.CategoriaProductoBase) -> CategoriaProducto:
    categoria = obtener_categoria_por_id(db, categoria_id)
    categoria.nombre = categoria_update.nombre
    categoria.descripcion = categoria_update.descripcion
    db.commit()
    db.refresh(categoria)
    return categoria

# Eliminar una categoría
def eliminar_categoria(db: Session, categoria_id: int):
    categoria = obtener_categoria_por_id(db, categoria_id)
    db.delete(categoria)
    db.commit()


#PRODUCTOS
#------------------------------------------------------------------------------------------------
# Crear un nuevo producto
def crear_producto(db: Session, producto: schemas.ProductoCreate) -> Producto:
    # Verificar si la categoría existe
    categoria = db.query(CategoriaProducto).filter(CategoriaProducto.id == producto.categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")

    db_producto = Producto(
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio=producto.precio,
        stock=producto.stock,
        imagen=producto.imagen,
        categoria_id=producto.categoria_id
    )
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

# Listar todos los productos
def listar_productos(db: Session) -> list[schemas.Producto]:
    return db.query(Producto).all()

# Obtener un producto por ID
def obtener_producto_por_id(db: Session, producto_id: int) -> Producto:
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto

# Actualizar un producto
def actualizar_producto(db: Session, producto_id: int, producto_update: schemas.ProductoBase) -> Producto:
    producto = obtener_producto_por_id(db, producto_id)
    for key, value in producto_update.dict().items():
        setattr(producto, key, value)
    db.commit()
    db.refresh(producto)
    return producto

# Eliminar un producto
def eliminar_producto(db: Session, producto_id: int):
    producto = obtener_producto_por_id(db, producto_id)
    db.delete(producto)
    db.commit()
    
   
#ENVIO
#---------------------------------------------------------------------------------------------------------
#Crear un envio
 
def crear_envio(db: Session,  envio: schemas.EnvioCreate) -> Envio:
    nuevo_envio = Envio(**envio.dict())
    db.add(nuevo_envio)
    db.commit()
    db.refresh(nuevo_envio)
    return nuevo_envio

#Listar envios
def listar_envios(db: Session) -> List[Envio]:
    return db.query(Envio).all()

#Obtener envios por id
def obtener_envio_por_id(db: Session, envio_id: int) -> Envio:
    envio = db.query(Envio).filter(Envio.id == envio_id).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")
    return envio

#Actualizar envios
def actualizar_envio(db: Session, envio_id: int, envio_update: schemas.EnvioBase) -> Envio:
    envio = obtener_envio_por_id(db, envio_id)
    for key, value in envio_update.dict(exclude_unset=True).items():
        setattr(envio, key, value)
    db.commit()
    db.refresh(envio)
    return envio

#Eliminar envios
def eliminar_envio(db: Session, envio_id: int) -> None:
    envio = obtener_envio_por_id(db, envio_id)
    db.delete(envio)
    db.commit()
    
#PAGO
#-------------------------------------------------------------------------------------
#Crear Pago
def crear_pago(db: Session, pago: schemas.PagoBase):
    nuevo_pago = Pago(**pago.dict())
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    return nuevo_pago

#Listar Pago
def listar_pagos(db: Session):
    return db.query(schemas.Pago).all()

#Obtener Pago
def obtener_pago(db: Session, pago_id: int):
    pago = db.query(Pago).filter(Pago.id == pago_id).first()
    if not pago:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pago no encontrado")
    return pago

#Eliminar Pago
def eliminar_pago(db: Session, pago_id: int):
    pago = obtener_pago(db, pago_id)
    if not pago:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pago no encontrado")
    db.delete(pago)
    db.commit()
    return None


#PEDIDO
#--------------------------------------------------------------------------------------
# Crear Pedido

def crear_pedido(db: Session, pedido: schemas.PedidoCreate) -> Pedido:
    """
    Crea y guarda un nuevo pedido en la base de datos.
    """
    # Se asume que los campos `fecha_creacion` y `estado` se configuran automáticamente
    nuevo_pedido = Pedido(
        total=pedido.total,
        usuario_id=pedido.usuario_id
    )
    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)
    return nuevo_pedido

#Listar pedidos

def listar_pedidos(db: Session):
    """
    Retorna una lista con todos los pedidos existentes.
    """
    return db.query(Pedido).all()

#Obtener pedido por ID

def obtener_pedido_por_id(db: Session, pedido_id: int) -> Pedido:
    """
    Busca un pedido por su ID. Si no se encuentra, lanza una excepción HTTP 404.
    """
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    return pedido

#Actualizar pedido

def actualizar_pedido(db: Session, pedido_id: int, pedido_update: schemas.PedidoUpdate) -> Pedido:
    """
    Actualiza los datos de un pedido existente.
    """
    pedido = obtener_pedido_por_id(db, pedido_id)
    # Se actualizan únicamente los campos enviados en la solicitud
    update_data = pedido_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(pedido, key, value)
    db.commit()
    db.refresh(pedido)
    return pedido

#Eliminar pedido

def eliminar_pedido(db: Session, pedido_id: int) -> None:
    """
    Elimina un pedido de la base de datos.
    """
    pedido = obtener_pedido_por_id(db, pedido_id)
    db.delete(pedido)
    db.commit()
    
#Obtener pedidos de un usuario

def obtener_pedidos_por_usuario(db: Session, usuario_id: int):
    """
    Retorna todos los pedidos asociados a un usuario.
    """
    return db.query(Pedido).filter(Pedido.usuario_id == usuario_id).all()

#Actualizar el estado de un pedido

def actualizar_estado_pedido(db: Session, pedido_id: int, nuevo_estado: schemas.EstadoPedidoEnum) -> Pedido:
    """
    Actualiza únicamente el estado de un pedido.
    """
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    
    pedido.estado = nuevo_estado
    db.commit()
    db.refresh(pedido)
    return pedido

# Cancelar pedido

def cancelar_pedido(db: Session, pedido_id: int) -> Pedido:
    """
    Cambia el estado de un pedido a 'cancelado'.
    """
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    
    # Se pueden agregar reglas adicionales, por ejemplo:
    # if pedido.estado != schemas.EstadoPedidoEnum.PENDIENTE:
    #     raise HTTPException(status_code=400, detail="Solo se pueden cancelar pedidos pendientes")
    
    pedido.estado = schemas.EstadoPedidoEnum.CANCELADO
    db.commit()
    db.refresh(pedido)
    return pedido
    

#DETALLE PEDIDO
#--------------------------------------------------------------------------------------
# Crear detalle de pedido
def crear_pedido_detalle(db: Session, detalle: schemas.PedidoDetalleCreate) -> PedidoDetalle:
    """
    Crea y guarda un nuevo detalle de pedido en la base de datos.
    """
    nuevo_detalle = PedidoDetalle(
        cantidad=detalle.cantidad,
        subtotal=detalle.subtotal,
        precio_unitario=detalle.precio_unitario,
        pedido_id=detalle.pedido_id,
        producto_id=detalle.producto_id
    )
    db.add(nuevo_detalle)
    db.commit()
    db.refresh(nuevo_detalle)
    return nuevo_detalle

# Listar detalles 

def listar_pedido_detalles(db: Session):
    """
    Retorna una lista con todos los detalles de pedido existentes.
    """
    return db.query(PedidoDetalle).all()

# Obtener detalle pedido por ID

def obtener_pedido_detalle_por_id(db: Session, detalle_id: int) -> PedidoDetalle:
    """
    Retorna el detalle de pedido correspondiente al ID proporcionado.
    Si no se encuentra, lanza una excepción HTTP 404.
    """
    detalle = db.query(PedidoDetalle).filter(PedidoDetalle.id == detalle_id).first()
    if not detalle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Detalle de pedido no encontrado")
    return detalle

# Actualizar detalle del pedido

def actualizar_pedido_detalle(db: Session, detalle_id: int, detalle_update: schemas.PedidoDetalleBase) -> PedidoDetalle:
    """
    Actualiza los datos de un detalle de pedido existente.
    Solo actualiza los campos enviados en la solicitud.
    """
    detalle = obtener_pedido_detalle_por_id(db, detalle_id)
    update_data = detalle_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(detalle, key, value)
    db.commit()
    db.refresh(detalle)
    return detalle

# Eliminar detalle del pedido

def eliminar_pedido_detalle(db: Session, detalle_id: int) -> None:
    """
    Elimina el detalle de pedido de la base de datos.
    """
    detalle = obtener_pedido_detalle_por_id(db, detalle_id)
    db.delete(detalle)
    db.commit()
    
# Obtener detalles de un pedido

def obtener_detalles_por_pedido(db: Session, pedido_id: int):
    """
    Retorna todos los detalles asociados a un pedido específico.
    """
    detalles = db.query(PedidoDetalle).filter(PedidoDetalle.pedido_id == pedido_id).all()
    if not detalles:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron detalles para este pedido")
    return detalles

# Agregar detalles a un pedido

def agregar_detalle_a_pedido(db: Session, pedido_id: int, producto_id: int, detalle: schemas.PedidoDetalleBase) -> PedidoDetalle:
    """
    Crea un nuevo detalle asociado a un pedido.
    """
    nuevo_detalle = PedidoDetalle(
        cantidad=detalle.cantidad,
        subtotal=detalle.subtotal,
        precio_unitario=detalle.precio_unitario,
        pedido_id=pedido_id,
        producto_id=producto_id
    )
    db.add(nuevo_detalle)
    db.commit()
    db.refresh(nuevo_detalle)
    return nuevo_detalle

#CARRITO
#-----------------------------------------------------------------------------------

#Obtener Carrito por ID
def obtener_carrito(db: Session, carrito_id: int):
    """Obtiene un carrito por su ID."""
    return db.query(Carrito).filter(Carrito.id == carrito_id).first()

#Crear carrito 
def create_carrito(db: Session, carrito_data: schemas.CarritoBase, usuario_id: int):
    """Crea un nuevo carrito para un usuario dado."""
    new_carrito = Carrito(
        usuario_id=usuario_id,
        estado=carrito_data.estado,  # Por defecto debería ser EstadoCarritoEnum.PENDIENTE
        fecha_creacion=datetime.now()
    )
    db.add(new_carrito)
    db.commit()
    db.refresh(new_carrito)
    return new_carrito

#Listar Carritos
def listar_carritos(db: Session, skip: int = 0, limit: int = 100):
    """Lista todos los carritos con paginación."""
    return db.query(Carrito).offset(skip).limit(limit).all()

#Obtener carritos de un usuario en particular
def obtener_carrito_por_usuario(db: Session, usuario_id: int):
    """
    Obtiene el carrito activo (por ejemplo, con estado PENDIENTE) del usuario.
    Se asume que cada usuario tiene un único carrito activo.
    """
    return db.query(Carrito).filter(
        Carrito.usuario_id == usuario_id,
        Carrito.estado == schemas.EstadoCarritoEnum.PENDIENTE
    ).first()


# Detalle Carrito
#-----------------------------------------------------------------------------------------
# Obtener detalle por ID
def obtener_detalle(db: Session, detalle_id: int):
    """Obtiene un detalle de carrito por su ID."""
    return db.query(CarritoDetalle).filter(CarritoDetalle.id == detalle_id).first()

# Crear detalle 
def crear_detalle(db: Session, detalle_data: CarritoDetalle, carrito_id: int, producto_id: int):
    """Crea un nuevo detalle de carrito para un carrito y producto dados."""
    new_detalle = CarritoDetalle(
        carrito_id=carrito_id,
        producto_id=producto_id,
        cantidad=detalle_data.cantidad,
        subtotal=detalle_data.subtotal
    )
    db.add(new_detalle)
    db.commit()
    db.refresh(new_detalle)
    return new_detalle

# Listar detalles
def listar_detalles(db: Session, carrito_id: int, skip: int = 0, limit: int = 100):
    """Lista los detalles de un carrito específico con paginación."""
    return db.query(CarritoDetalle)\
             .filter(CarritoDetalle.carrito_id == carrito_id)\
             .offset(skip)\
             .limit(limit)\
             .all()
             
# Agregar producto al carrito 
def agregar_producto_al_carrito(db: Session, carrito_id: int, producto_id: int, detalle_data: schemas.CarritoDetalleBase):
    """
    Agrega un producto al carrito.
    Si el producto ya existe en el carrito, se suma la cantidad y se actualiza el subtotal.
    """
    # Buscar si ya existe un detalle para este producto
    detalle_existente = db.query(CarritoDetalle).filter(
        CarritoDetalle.carrito_id == carrito_id,
        CarritoDetalle.producto_id == producto_id
    ).first()
    
    if detalle_existente:
        detalle_existente.cantidad += detalle_data.cantidad
        detalle_existente.subtotal += detalle_data.subtotal
        db.commit()
        db.refresh(detalle_existente)
        return detalle_existente
    else:
        nuevo_detalle = CarritoDetalle(
            carrito_id=carrito_id,
            producto_id=producto_id,
            cantidad=detalle_data.cantidad,
            subtotal=detalle_data.subtotal
        )
        db.add(nuevo_detalle)
        db.commit()
        db.refresh(nuevo_detalle)
        return nuevo_detalle

#Actualizar la cantida del producto del carrito

def actualizar_cantidad_producto(db: Session, carrito_id: int, producto_id: int, nueva_cantidad: int):
    """
    Actualiza la cantidad de un producto en el carrito.
    Aquí se podría recalcular el subtotal según la lógica de negocio (por ejemplo, multiplicando por el precio unitario).
    """
    detalle = db.query(CarritoDetalle).filter(
        CarritoDetalle.carrito_id == carrito_id,
        CarritoDetalle.producto_id == producto_id
    ).first()
    
    if not detalle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado en el carrito")
    
    detalle.cantidad = nueva_cantidad
    # Aquí podrías recalcular el subtotal si tienes acceso al precio del producto. (REVISAR)
    db.commit()
    db.refresh(detalle)
    return detalle

#Eliminar producto del carrito

def eliminar_producto_del_carrito(db: Session, carrito_id: int, producto_id: int):
    """Elimina un producto del carrito."""
    detalle = db.query(CarritoDetalle).filter(
        CarritoDetalle.carrito_id == carrito_id,
        CarritoDetalle.producto_id == producto_id
    ).first()
    if not detalle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado en el carrito")
    
    db.delete(detalle)
    db.commit()
    return {"detail": "Producto eliminado del carrito"}
