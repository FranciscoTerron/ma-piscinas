from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from src.gestion.models import Usuario, Rol, CategoriaProducto, Producto, Envio, Pago
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

def listar_usuarios(db: Session) -> list[schemas.Usuario]:
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
