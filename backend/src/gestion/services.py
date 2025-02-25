from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, case
from sqlalchemy.exc import SQLAlchemyError
from src.gestion.models import Usuario, Rol, CategoriaProducto, Descuento,Producto, Envio, Pago, Pedido, PedidoDetalle, Carrito, CarritoDetalle, MetodoPago, Actividad, SubCategoria, Empresa, MetodoPagoEnum
from src.gestion import schemas, exceptions
from src.utils.jwt import create_access_token
from passlib.context import CryptContext
from datetime import datetime, UTC, timedelta
from fastapi import HTTPException, status, UploadFile
import cloudinary.uploader
from collections import defaultdict
from dateutil.relativedelta import relativedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Para que se creen los roles automaticamente, si es que no existen
ROLES_REQUERIDOS = ["cliente","administrador"] 
def verificar_y_crear_roles(db: Session):
    for rol_nombre in ROLES_REQUERIDOS:
        if not db.query(Rol).filter(Rol.nombre == rol_nombre).first():
            nuevo_rol = Rol(nombre=rol_nombre)
            db.add(nuevo_rol)
    db.commit()

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

def listar_usuarios(db: Session, pagina: int, tamanio: int) -> dict:
    total = db.query(Usuario).count()
    usuarios = (db.query(Usuario)
                .offset((pagina - 1) * tamanio)
                .limit(tamanio)
                .all())
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "usuarios": usuarios}


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
def crear_categoria( db: Session,
    nombre: str,
    descripcion: str,
    imagen: UploadFile = None
) -> CategoriaProducto:
   # Subir el imagen si se proporciona
    image_url = None
    if imagen:
        try:
            upload_result = cloudinary.uploader.upload(imagen.file, folder="empresas")
            image_url = upload_result.get("secure_url")
            if not image_url:
                raise Exception("No se obtuvo URL de la imagen")
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al subir la imagen a Cloudinary: {str(e)}")

    # Crear la categoria
    nueva_categoria = CategoriaProducto(
        nombre=nombre,
        descripcion=descripcion,
        imagen=image_url  # Guardar la URL del logo si se subió
    )
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria


# Listar todas las categorías
def listar_categorias(db: Session, pagina: int, tamanio: int) -> dict:
    total = db.query(CategoriaProducto).count()
    categorias = (db.query(CategoriaProducto)
                  .offset((pagina - 1) * tamanio)
                  .limit(tamanio)
                  .all())
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "categorias": categorias}

# Obtener una categoría por ID
def obtener_categoria_por_id(db: Session, categoria_id: int) -> CategoriaProducto:
    categoria = db.query(CategoriaProducto).filter(CategoriaProducto.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

# Actualizar una categoría existente
def actualizar_categoria(db: Session, 
    categoria_id: int, 
    nombre: str,
    descripcion: str,
    imagen: UploadFile = None) -> CategoriaProducto:
    
    categoria = obtener_categoria_por_id(db, categoria_id)
    categoria.nombre = nombre
    categoria.descripcion = descripcion
    
    # Si se envió un nuevo archivo de imagen, subirlo a Cloudinary
    if imagen:
        try:
            upload_result = cloudinary.uploader.upload(imagen.file, folder="categorias")  # Usar carpeta específica para métodos de pago
            image_url = upload_result.get("secure_url")
            if not image_url:
                raise Exception("No se obtuvo URL de la imagen")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al subir la imagen a Cloudinary: {str(e)}"
            )
        categoria.imagen = image_url  # Actualizar el atributo imagen con la URL

    # Guardar los cambios en la base de datos
    db.commit()
    db.refresh(categoria)
    
    return categoria
    



# Eliminar una categoría
def eliminar_categoria(db: Session, categoria_id: int):
    categoria = obtener_categoria_por_id(db, categoria_id)
    db.delete(categoria)
    db.commit()
    
#SUBCATEGORIAS
#------------------------------------------------------------------------------------------------
# Crear una nueva subcategoría
def crear_subcategoria(db: Session, subcategoria: schemas.SubCategoriaBase, categoria_id: int) -> SubCategoria:
    categoria = db.query(CategoriaProducto).filter(CategoriaProducto.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    db_subcategoria = SubCategoria(
        nombre=subcategoria.nombre,
        categoria_id=categoria_id
    )
    db.add(db_subcategoria)
    db.commit()
    db.refresh(db_subcategoria)
    return db_subcategoria

# Lista subcategorias 
def listar_subcategorias(db: Session, pagina: int, tamanio: int, categoria_id: Optional[int] = None) -> dict:
    query = db.query(SubCategoria)
    if categoria_id:
        query = query.filter(SubCategoria.categoria_id == categoria_id)
    total = query.count()
    subcategorias = query.offset((pagina - 1) * tamanio).limit(tamanio).all()
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "subcategorias": subcategorias}

# Obtener una subcategoría por ID
def obtener_subcategoria_por_id(db: Session, subcategoria_id: int) -> SubCategoria:
    subcategoria = db.query(SubCategoria).filter(SubCategoria.id == subcategoria_id).first()
    if not subcategoria:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    return subcategoria

# Actualizar una subcategoría existente
def actualizar_subcategoria(db: Session, subcategoria_id: int, subcategoria_update: schemas.SubCategoriaBase) -> SubCategoria:
    subcategoria = obtener_subcategoria_por_id(db, subcategoria_id)
    subcategoria.nombre = subcategoria_update.nombre
    db.commit()
    db.refresh(subcategoria)
    return subcategoria

# Eliminar una subcategoría
def eliminar_subcategoria(db: Session, subcategoria_id: int):
    subcategoria = obtener_subcategoria_por_id(db, subcategoria_id)
    db.delete(subcategoria)
    db.commit()

#PRODUCTOS
#------------------------------------------------------------------------------------------------
# Crear un nuevo producto
def crear_producto(
    db: Session,
    nombre: str,
    descripcion: str,
    precio: float,
    stock: int,
    categoria_id: int,
    costo_compra: Optional[float],
    imagen: UploadFile,
    subcategoria_id: Optional[int] = None  # Asegúrate de que esté aquí
) -> Producto:
    # Verificar que la categoría exista
    categoria = db.query(CategoriaProducto).filter(CategoriaProducto.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")

    # Verificar que la subcategoría exista y pertenezca a la categoría, si se proporciona
    if subcategoria_id:
        subcategoria = db.query(SubCategoria).filter(SubCategoria.id == subcategoria_id).first()
        if not subcategoria or subcategoria.categoria_id != categoria_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subcategoría no encontrada o no pertenece a la categoría")

    # Subir la imagen a Cloudinary
    try:
        upload_result = cloudinary.uploader.upload(imagen.file, folder="productos")
        image_url = upload_result.get("secure_url")
        if not image_url:
            raise Exception("No se obtuvo URL de la imagen")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al subir la imagen a Cloudinary: {str(e)}")

    # Generar un código único
    ultimo_producto = db.query(Producto).order_by(Producto.id.desc()).first()
    nuevo_numero = (ultimo_producto.id + 1) if ultimo_producto else 1
    codigo = f"PROD-{nuevo_numero:03d}"

    # Crear el producto
    try:
        db_producto = Producto(
            codigo=codigo,
            nombre=nombre,
            descripcion=descripcion,
            precio=precio,
            stock=stock,
            imagen=image_url,
            categoria_id=categoria_id,
            subcategoria_id=subcategoria_id,  # Asegúrate de que esté aquí
            costo_compra=costo_compra
        )
        db.add(db_producto)
        db.commit()
        db.refresh(db_producto)
        print(f"Producto creado con ID: {db_producto.id}, Subcategoría ID: {db_producto.subcategoria_id}")  # Agrega esto para depurar
        return db_producto
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al guardar el producto: {str(e)}")
def actualizar_producto(
    db: Session,
    producto_id: int,
    nombre: str,
    descripcion: str,
    precio: float,
    stock: int,
    categoria_id: int,
    costo_compra: Optional[float],
    imagen: Optional[UploadFile] = None,
    subcategoria_id: Optional[int] = None  # Nuevo parámetro opcional
) -> Producto:
    producto = obtener_producto_por_id(db, producto_id)
    
    try:
        producto.nombre = nombre
        producto.descripcion = descripcion
        producto.precio = precio
        producto.stock = stock
        producto.categoria_id = categoria_id
        producto.subcategoria_id = subcategoria_id  # Actualizar subcategoria_id
        producto.costo_compra = costo_compra

        if imagen:
            upload_result = cloudinary.uploader.upload(imagen.file, folder="productos")
            image_url = upload_result.get("secure_url")
            if not image_url:
                raise Exception("No se obtuvo URL de la imagen")
            producto.imagen = image_url

        db.commit()
        db.refresh(producto)
        return producto
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al actualizar el producto: {str(e)}")
def listar_productos(db: Session, pagina: int, tamanio: int, categoria_id: Optional[int] = None):
    query = db.query(Producto)
    if categoria_id:
        query = query.filter(Producto.categoria_id == categoria_id)
    total = query.count()
    productos = query.offset((pagina - 1) * tamanio).limit(tamanio).all()
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "productos": productos}

# Obtener un producto por ID
def obtener_producto_por_id(db: Session, producto_id: int) -> Producto:
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto


# Eliminar un producto
def eliminar_producto(db: Session, producto_id: int):
    producto = obtener_producto_por_id(db, producto_id)
    db.delete(producto)
    db.commit()
    
# Verifica nombre del producto
def verificar_nombre_producto(db: Session, nombre: str) -> bool:
    if not nombre or nombre.strip() == "":
        return False
    nombre = nombre.strip()
    producto = db.query(Producto).filter(Producto.nombre == nombre).first()
    return producto is not None
    
   
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
def listar_envios(db: Session, pagina: int, tamanio: int) -> dict:
    total = db.query(Envio).count()
    envios = (db.query(Envio)
                .offset((pagina - 1) * tamanio)
                .limit(tamanio)
                .all())
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "envios": envios}

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
    
# ============================================================
# Crear una nueva empresa
# ============================================================
def crear_empresa(
    db: Session,
    nombre: str,
    direccion: str,
    telefono: int,
    imagen: UploadFile = None
) -> Empresa:
    # Subir el imagen si se proporciona
    image_url = None
    if imagen:
        try:
            upload_result = cloudinary.uploader.upload(imagen.file, folder="empresas")
            image_url = upload_result.get("secure_url")
            if not image_url:
                raise Exception("No se obtuvo URL de la imagen")
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al subir la imagen a Cloudinary: {str(e)}")

    # Crear la empresa
    nueva_empresa = Empresa(
        nombre=nombre,
        direccion=direccion,
        telefono=telefono,
        imagen=image_url  # Guardar la URL del logo si se subió
    )
    db.add(nueva_empresa)
    db.commit()
    db.refresh(nueva_empresa)
    return nueva_empresa

# ============================================================
# Listar todas las empresas
# ============================================================
def listar_empresas(db: Session, pagina: int, tamanio: int) -> dict:
    total = db.query(Empresa).count()
    empresas = (db.query(Empresa)
                .offset((pagina - 1) * tamanio)
                .limit(tamanio)
                .all())
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "empresas": empresas}

# ============================================================
# Obtener una empresa por ID
# ============================================================
def obtener_empresa_por_id(db: Session, empresa_id: int):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    return empresa

# ============================================================
# Actualizar una empresa
# ============================================================
def actualizar_empresa(
    db: Session, 
    empresa_id: int, 
    nombre: str,
    direccion: str,
    telefono: int,
    imagen: UploadFile = None
    ) -> Empresa:
    empresa = obtener_empresa_por_id(db, empresa_id)
    
    empresa.nombre = nombre
    empresa.direccion = direccion
    empresa.telefono = telefono
    # Si se envió un nuevo archivo de imagen, subirlo a Cloudinary
    if imagen:
        try:
            upload_result = cloudinary.uploader.upload(imagen.file, folder="empresas")
            image_url = upload_result.get("secure_url")
            if not image_url:
                raise Exception("No se obtuvo URL de la imagen")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al subir la imagen a Cloudinary: {str(e)}"
            )
        empresa.imagen = image_url

    db.commit()
    db.refresh(empresa)
    return empresa

# ============================================================
# Eliminar una empresa
# ============================================================
def eliminar_empresa(db: Session, empresa_id: int):
    empresa = obtener_empresa_por_id(db, empresa_id)
    db.delete(empresa)
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
def listar_pagos(db: Session, pagina: int, tamanio: int) -> dict:
    total = db.query(Pago).count()
    pagos = (db.query(Pago)
                .offset((pagina - 1) * tamanio)
                .limit(tamanio)
                .all())
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "pagos": pagos}

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

#METODO DE PAGO
#--------------------------------------------------------------------------------------
# Crear Método de Pago
# ============================================================

def crear_metodo_pago(
    db: Session,
    nombre: str,
    tipo: MetodoPagoEnum,
    imagen: UploadFile = None
) -> MetodoPago:
    # Subir la imagen si se proporciona
    image_url = None
    if imagen:
        try:
            upload_result = cloudinary.uploader.upload(imagen.file, folder="metodos-pago")
            image_url = upload_result.get("secure_url")
            if not image_url:
                raise Exception("No se obtuvo URL de la imagen")
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al subir la imagen a Cloudinary: {str(e)}")

    # Crear el método de pago
    nuevo_metodo_pago = MetodoPago(
        nombre=nombre,
        tipo=tipo.name,  
        imagen=image_url  # Guardar la URL de la imagen si se subió
    )
    db.add(nuevo_metodo_pago)
    db.commit()
    db.refresh(nuevo_metodo_pago)
    return nuevo_metodo_pago

# Actualizar Método de Pago
def actualizar_metodo_pago(
    db: Session, 
    metodo_pago_id: int, 
    nombre: str,
    tipo: MetodoPagoEnum,  
    imagen: UploadFile = None 
) -> MetodoPago:
    # Obtener el método de pago por ID
    metodo_pago = obtener_metodo_pago_por_id(db, metodo_pago_id)
    
    # Actualizar los campos 'nombre' y 'tipo'
    metodo_pago.nombre = nombre
    metodo_pago.tipo = tipo
    
    # Si se envió un nuevo archivo de imagen, subirlo a Cloudinary
    if imagen:
        try:
            upload_result = cloudinary.uploader.upload(imagen.file, folder="metodos-pago")  # Usar carpeta específica para métodos de pago
            image_url = upload_result.get("secure_url")
            if not image_url:
                raise Exception("No se obtuvo URL de la imagen")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al subir la imagen a Cloudinary: {str(e)}"
            )
        metodo_pago.imagen = image_url  # Actualizar el atributo imagen con la URL

    # Guardar los cambios en la base de datos
    db.commit()
    db.refresh(metodo_pago)
    
    return metodo_pago


# Listar Métodos de Pago
def listar_metodos_pago(db: Session, pagina: int, tamanio: int) -> dict:
    total = db.query(MetodoPago).count()
    metodosPago = (db.query(MetodoPago)
                .offset((pagina - 1) * tamanio)
                .limit(tamanio)
                .all())
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "metodosPago": metodosPago}

# Obtener Método de Pago por ID
def obtener_metodo_pago(db: Session, metodo_pago_id: int):
    metodo_pago = db.query(MetodoPago).filter(MetodoPago.id == metodo_pago_id).first()
    if not metodo_pago:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Método de pago no encontrado")
    return metodo_pago

# Eliminar Método de Pago
def eliminar_metodo_pago(db: Session, metodo_pago_id: int):
    metodo_pago = obtener_metodo_pago(db, metodo_pago_id)
    if not metodo_pago:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Método de pago no encontrado")
    db.delete(metodo_pago)
    db.commit()
    return None


#Obtener metodo de pago por id
def obtener_metodo_pago_por_id(db: Session, metodo_pago_id: int) -> MetodoPago:
    metodo_pago = db.query(MetodoPago).filter(MetodoPago.id == metodo_pago_id).first()
    if not metodo_pago:
        raise HTTPException(status_code=404, detail="metodo pago no encontrado")
    return metodo_pago



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

def listar_pedidos(db: Session, pagina: int, tamanio: int) -> dict:
    total = db.query(Pedido).count()
    pedidos = (db.query(Pedido)
                .offset((pagina - 1) * tamanio)
                .limit(tamanio)
                .all())
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "pedidos": pedidos}


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

# ============================================================
# Función auxiliar para obtener o crear el carrito automáticamente
# ============================================================
def obtener_carrito_o_crear(db: Session, usuario_id: int):
    carrito = obtener_carrito_por_usuario(db, usuario_id)
    if not carrito:
        carrito = create_carrito(db, schemas.CarritoBase(), usuario_id)
    return carrito

def vaciar_carrito(db: Session, carrito_id: int):
    """Elimina todos los productos de un carrito sin eliminar el carrito."""
    db.query(CarritoDetalle).filter(CarritoDetalle.carrito_id == carrito_id).delete()
    db.commit()

#ACTIVIDADES
#------------------------------------------------------------------------------------------------------------
def listar_actividades(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Actividad).order_by(Actividad.fecha.desc()).offset(skip).limit(limit).all()

def registrar_actividad(db: Session, actividad_data: schemas.ActividadCreate):
    nueva_actividad = Actividad(
        tipo_evento=actividad_data.tipo_evento,
        descripcion=actividad_data.descripcion,
        referencia_id=actividad_data.referencia_id,
        usuario_id=actividad_data.usuario_id
    )
    db.add(nueva_actividad)
    db.commit()
    db.refresh(nueva_actividad)
    return nueva_actividad

#REPORTES
#---------------------------------------------------------------------------------------------
def obtener_top_usuarios_mas_activos(db: Session):
    top_usuarios = (
        db.query(
            Usuario.nombre, func.count(Pedido.id).label("compras")
        )
        .join(Pedido, Usuario.id == Pedido.usuario_id)
        .group_by(Usuario.nombre)
        .order_by(func.count(Pedido.id).desc())
        .limit(5)
        .all()
    )

    return [{"nombre": usuario[0], "compras": usuario[1]} for usuario in top_usuarios]

def generar_reporte_ventas_por_periodo(db: Session, tipo_periodo: str, fecha_inicio: datetime, fecha_fin: datetime):
    """
    Genera un reporte de ventas agrupadas por día, semana o mes.
    """

    # Determinar el motor de base de datos
    dialect_name = db.bind.dialect.name

    if dialect_name == "sqlite":
        TRUNC_MAPPING = {
            "diario": lambda x: func.date(x),
            "semanal": lambda x: func.strftime('%Y-%W', x),  # Agrupar por semana
            "mensual": lambda x: func.strftime('%Y-%m', x)  # Agrupar por mes
        }
    else:  # PostgreSQL u otros motores compatibles
        TRUNC_MAPPING = {
            "diario": lambda x: func.date(x),
            "semanal": lambda x: func.date_trunc('week', x),
            "mensual": lambda x: func.date_trunc('month', x)
        }

    trunc_func = TRUNC_MAPPING.get(tipo_periodo)

    if not trunc_func:
        raise ValueError("Tipo de período no válido")

    # Consulta optimizada
    query = db.query(
        trunc_func(Pedido.fecha_creacion).label("periodo"),
        func.sum(Pedido.total).label("total_ventas"),
        func.count(Pedido.id).label("cantidad_pedidos")
    ).filter(
        Pedido.fecha_creacion.between(fecha_inicio, fecha_fin),
        Pedido.estado == "ENTREGADO"
    ).group_by("periodo").order_by("periodo")

    resultados = query.all()

    return [
        {
            "periodo": res.periodo,
            "total_ventas": res.total_ventas,
            "cantidad_pedidos": res.cantidad_pedidos
        }
        for res in resultados
    ]


def calcular_estacionalidad_productos(db: Session, anio: int):
    subquery = db.query(
        PedidoDetalle.producto_id,
        func.extract('month', Pedido.fecha_creacion).label("mes"),
        func.sum(PedidoDetalle.cantidad).label("ventas")
    ).join(Pedido).filter(
        func.extract('year', Pedido.fecha_creacion) == anio,
        Pedido.estado == "ENTREGADO"
    ).group_by(PedidoDetalle.producto_id, "mes").subquery()

    productos = db.query(
        Producto.id,
        Producto.nombre,
        func.coalesce(subquery.c.mes, "00").label("mes"),
        func.coalesce(subquery.c.ventas, 0).label("ventas")
    ).outerjoin(subquery, Producto.id == subquery.c.producto_id).all()

    # Estructurar los resultados
    reporte = {}
    for p in productos:
        if p.id not in reporte:
            reporte[p.id] = {
                "producto_id": p.id,
                "nombre_producto": p.nombre,
                "ventas_por_mes": defaultdict(int)
            }
        reporte[p.id]["ventas_por_mes"][f"{int(p.mes):02d}"] = p.ventas
    
    return list(reporte.values())

def calcular_costos_ganancias(db: Session, producto_id: Optional[int], categoria_id: Optional[int]):
    query = db.query(
        Producto.id,
        Producto.nombre,
        Producto.precio,
        Producto.costo_compra,
        func.sum(PedidoDetalle.cantidad).label("unidades_vendidas")
    ).join(PedidoDetalle).join(Pedido).filter(
        Pedido.estado == "ENTREGADO"
    )

    if producto_id:
        query = query.filter(Producto.id == producto_id)
    if categoria_id:
        query = query.filter(Producto.categoria_id == categoria_id)

    resultados = query.group_by(Producto.id).all()

    return [{
        "producto_id": res.id,
        "nombre": res.nombre,
        "costo_total": res.costo_compra * res.unidades_vendidas,
        "ganancia_total": (res.precio - res.costo_compra) * res.unidades_vendidas,
        "margen_ganancia": ((res.precio - res.costo_compra) / res.precio * 100) if res.precio > 0 else 0
    } for res in resultados]

def calcular_metricas_cancelaciones(db: Session, meses_historial: int = 3):
    """
    Calcula el porcentaje de pedidos cancelados y su evolución histórica en los últimos `meses_historial` meses.
    """
    try:
        # Obtener el total de pedidos y cancelaciones
        total_pedidos = db.query(func.count(Pedido.id)).scalar() or 0
        cancelados = db.query(func.count(Pedido.id)).filter(Pedido.estado == "CANCELADO").scalar() or 0
        
        # Calcular fecha límite
        fecha_limite = datetime.utcnow() - relativedelta(months=meses_historial)

        # Consultar historial de cancelaciones
        resultados = (
            db.query(
                func.strftime('%Y-%m', Pedido.fecha_creacion).label("mes"),  # Compatible con SQLite
                func.count(Pedido.id).label("total"),
                func.sum(case((Pedido.estado == "CANCELADO", 1), else_=0)).label("cancelados")
            )
            .filter(Pedido.fecha_creacion >= fecha_limite)
            .group_by("mes")
            .order_by("mes")
            .all()
        )

        # Formatear historial
        historial = {
            res.mes: round((res.cancelados / res.total * 100), 2) if res.total > 0 else 0
            for res in resultados
        }
        
        return {
            "total_pedidos": total_pedidos,
            "pedidos_cancelados": cancelados,
            "porcentaje_cancelados": round((cancelados / total_pedidos * 100), 2) if total_pedidos > 0 else 0,
            "ultimos_3_meses": historial,
        }
    except SQLAlchemyError as e:
        print(f"Error en calcular_metricas_cancelaciones: {e}")
        return {
            "total_pedidos": 0,
            "pedidos_cancelados": 0,
            "porcentaje_cancelados": 0,
            "ultimos_3_meses": {}
        }

#DESCUENTO
#----------------------------------------------------------------------------------
# Crear un nuevo descuento
def crear_descuento(
    db: Session,
    nombre: str,
    tipo: schemas.TipoDescuentoEnum,
    valor: float,
    fecha_inicio: datetime,
    fecha_fin: Optional[datetime] = None,
    descripcion: Optional[str] = None,
    condiciones: Optional[str] = None,
    activo: bool = True,
    producto_id: Optional[int] = None,
    metodo_pago_id: Optional[int] = None
) -> Descuento:
    try:
        print("Datos recibidos:", {
            "nombre": nombre,
            "tipo": tipo,
            "valor": valor,
            "fecha_inicio": fecha_inicio,
            "fecha_fin": fecha_fin,
            "condiciones": condiciones,
            "activo": activo,
            "producto_id": producto_id,
            "metodo_pago_id": metodo_pago_id
        })  # Depuración

        # Validación básica
        if valor <= 0:
            raise ValueError("El valor del descuento debe ser mayor a 0")
            
        if fecha_fin and fecha_fin < fecha_inicio:
            raise ValueError("La fecha de fin no puede ser anterior a la de inicio")

        # Verificar relaciones si existen
        if producto_id:
            producto = db.query(Producto).filter(Producto.id == producto_id).first()
            if not producto:
                raise HTTPException(status_code=404, detail="Producto no encontrado")

        if metodo_pago_id:
            metodo_pago = db.query(MetodoPago).filter(MetodoPago.id == metodo_pago_id).first()
            if not metodo_pago:
                raise HTTPException(status_code=404, detail="Método de pago no encontrado")

        # Crear el descuento
        nuevo_descuento = Descuento(
            nombre=nombre,
            descripcion=descripcion,
            tipo=tipo,
            valor=valor,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            condiciones=condiciones,
            activo=activo,
            producto_id=producto_id,
            metodo_pago_id=metodo_pago_id
        )

        db.add(nuevo_descuento)
        db.commit()
        db.refresh(nuevo_descuento)
        return nuevo_descuento

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error de base de datos: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Listar descuentos con paginación
def listar_descuentos(db: Session, pagina: int, tamanio: int) -> dict:
    total = db.query(Descuento).count()
    descuentos = db.query(Descuento).offset((pagina - 1) * tamanio).limit(tamanio).all()
    return {"total": total, "pagina": pagina, "tamanio": tamanio, "descuentos": descuentos}

# Obtener un descuento por ID
def obtener_descuento_por_id(db: Session, descuento_id: int) -> Descuento:
    descuento = db.query(Descuento).filter(Descuento.id == descuento_id).first()
    if not descuento:
        raise HTTPException(status_code=404, detail="Descuento no encontrado")
    return descuento

# Actualizar un descuento
def actualizar_descuento(db: Session, descuento_id: int, descuento_update: schemas.DescuentoUpdate) -> Descuento:
    descuento = obtener_descuento_por_id(db, descuento_id)
    for key, value in descuento_update.dict(exclude_unset=True).items():
        setattr(descuento, key, value)
    db.commit()
    db.refresh(descuento)
    return descuento

# Eliminar un descuento
def eliminar_descuento(db: Session, descuento_id: int):
    descuento = obtener_descuento_por_id(db, descuento_id)
    db.delete(descuento)
    db.commit()



