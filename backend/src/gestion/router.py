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
# Ruta para obtener usuario
# ============================================================
@router.get("/usuarios/{usuario_id}")
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return usuario


# ============================================================
# Ruta para listar usuarios
# ============================================================

@router.get("/usuarios")
def listar_usuarios(pagina: int = 1, tamanio: int = 10, db: Session = Depends(get_db)):
    return services.listar_usuarios(db, pagina, tamanio)

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
def crear_categoria(
    nombre: str = Form(...),
    descripcion: str = Form(...),
    imagen: UploadFile = File(None),  
    db: Session = Depends(get_db)
):
    return services.crear_categoria(db, nombre, descripcion, imagen)


# ============================================================
# Ruta para listar categorias
# ============================================================
@router.get("/categorias")
def listar_categorias(pagina: int = 1, tamanio: int = 3, db: Session = Depends(get_db)):
    
    return services.listar_categorias(db, pagina, tamanio)

# ============================================================
# Ruta para obtener categoria por id
# ============================================================
@router.get("/categorias/{categoria_id}", response_model=schemas.CategoriaProducto)
def obtener_categoria(categoria_id: int, db: Session = Depends(get_db)):
    return services.obtener_categoria_por_id(db, categoria_id)


# ============================================================
# Ruta para actualizar categoria con imagen opcional
# ============================================================
@router.put("/categorias/{categoria_id}", response_model=schemas.CategoriaProducto)
def actualizar_categoria(
    categoria_id: int,
    nombre: str = Form(...),
    descripcion: str = Form(...), 
    imagen: UploadFile = File(None),  # Recibimos el archivo de imagen si lo hay
    db: Session = Depends(get_db)
):
    return services.actualizar_categoria(db, categoria_id, nombre,descripcion, imagen)


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
@router.get("/subcategorias")
def listar_subcategorias(
    pagina: int = 1,
    tamanio: int = 10,
    categoria_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    return services.listar_subcategorias(db, pagina, tamanio, categoria_id)

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
    nombre: str = Form(..., description="Nombre del producto"),
    descripcion: str = Form(..., description="Descripción del producto"),
    precio: float = Form(..., description="Precio de venta"),
    stock: int = Form(..., description="Stock disponible"),
    categoria_id: int = Form(..., description="ID de la categoría"),
    imagen: UploadFile = File(..., description="Imagen del producto"),
    costo_compra: Optional[float] = Form(None, description="Costo de compra del producto"),
    subcategoria_id: Optional[int] = Form(None, description="ID de la subcategoría, opcional"),  # Nuevo campo
    usuario_id: int = Form(..., description="ID del usuario que crea"),
    db: Session = Depends(get_db)
):
    try:
        nuevo_producto = services.crear_producto(
            db, nombre, descripcion, precio, stock, categoria_id, costo_compra, imagen, subcategoria_id  # Añadido subcategoria_id
        )

        services.registrar_actividad(db, schemas.ActividadCreate(
            tipo_evento="CREACION_PRODUCTO",
            descripcion=f"Se creó el producto {nombre}",
            referencia_id=nuevo_producto.id,
            usuario_id=usuario_id
        ))

        return nuevo_producto
    except Exception as e:
        print.error(f"Error al procesar la creación: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# ============================================================
# Ruta para actualizar producto
# ============================================================
@router.put("/productos/{producto_id}", response_model=schemas.Producto)
def actualizar_producto(
    producto_id: int,
    nombre: str = Form(..., description="Nombre del producto"),
    descripcion: str = Form(..., description="Descripción del producto"),
    precio: float = Form(..., description="Precio de venta"),
    stock: int = Form(..., description="Stock disponible"),
    categoria_id: int = Form(..., description="ID de la categoría"),
    imagen: Optional[UploadFile] = File(None, description="Nueva imagen del producto"),
    costo_compra: Optional[float] = Form(None, description="Costo de compra del producto"),
    subcategoria_id: Optional[int] = Form(None, description="ID de la subcategoría, opcional"),  # Nuevo campo
    descuento_id: Optional[int] = Form(None, description="ID del descuento a aplicar, opcional"),
    usuario_id: int = Form(..., description="ID del usuario que actualiza"),
    db: Session = Depends(get_db),
):
    print(f"Recibiendo datos para actualizar producto {producto_id}: nombre={nombre}, precio={precio}, costo_compra={costo_compra}, usuario_id={usuario_id}, subcategoria_id={subcategoria_id}, imagen.type={type(imagen) if imagen else None}")
    try:
        return services.actualizar_producto(
            db, producto_id, nombre, descripcion, precio, stock, categoria_id, costo_compra, imagen, subcategoria_id, descuento_id  # Añadido subcategoria_id
        )
    except Exception as e:
        print.error(f"Error al procesar la actualización: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# ============================================================
# Ruta para listar productos
# ============================================================

@router.get("/productos")
def listar_productos(pagina: int = 1, tamanio: int = 10, categoria_id:Optional[int] = None, db: Session = Depends(get_db)):
    return services.listar_productos(db, pagina, tamanio, categoria_id)


# ============================================================
# Ruta para verificar si un nombre de producto ya existe
# ============================================================
@router.get("/productos/verificar-nombre")
def verificar_nombre_producto(
    nombre: str = Query(..., description="Nombre del producto a verificar"),
    db: Session = Depends(get_db)
):
    existe = services.verificar_nombre_producto(db, nombre)
    return {"existe": existe}
# ============================================================
# Ruta para obtener los productos por ID
# ============================================================

@router.get("/productos/{producto_id}", response_model=schemas.Producto)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    return services.obtener_producto_por_id(db, producto_id)

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
# ============================================================
@router.post("/envios", response_model=schemas.Envio, status_code=status.HTTP_201_CREATED)
def crear_envio(usuario_id: int, envio: schemas.EnvioCreate, db: Session = Depends(get_db)):
    nuevo_envio = services.crear_envio(db, envio)

    services.registrar_actividad(db, schemas.ActividadCreate(
        tipo_evento="CREACION_ENVIO",
        descripcion=f"Se registro envio con direccion: {nuevo_envio.direccion}",
        referencia_id=nuevo_envio.id,
        usuario_id=usuario_id
    ))

    return nuevo_envio

# ============================================================
# Ruta para listar envios
# ============================================================
@router.get("/envios")
def listar_envios(pagina: int = 1, tamanio: int = 10, db: Session = Depends(get_db)):
    return services.listar_envios(db, pagina, tamanio)

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
@router.get("/empresas")
def listar_empresas(pagina: int = 1, tamanio: int = 10, db: Session = Depends(get_db)):
    return services.listar_empresas(db, pagina, tamanio)

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
def crear_pago(usuario_id: int ,pago: schemas.PagoBase, db: Session = Depends(get_db)):
    nuevo_pago = services.crear_pago(db, pago)

    services.registrar_actividad(db, schemas.ActividadCreate(
        tipo_evento="CREACION_PAGO",
        descripcion=f"Se registro pago asociado al pedido identificado con el numero: {nuevo_pago.pedido_id}",
        referencia_id=nuevo_pago.id,
        usuario_id=usuario_id
    ))

    return nuevo_pago

# ============================================================
# Ruta para listar todos los pagos
# ============================================================
@router.get("/pagos")
def listar_pagos(pagina: int = 1, tamanio: int = 10,db: Session = Depends(get_db)):
    return services.listar_pagos(db, pagina, tamanio)

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
@router.get("/metodos-pago")
def listar_metodos_pago(pagina: int = 1, tamanio: int = 10, db: Session = Depends(get_db)):
    return services.listar_metodos_pago(db, pagina, tamanio)

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
def crear_pedido(usuario_id: int, pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    nuevo_pedido = services.crear_pedido(db, pedido)

    services.registrar_actividad(db, schemas.ActividadCreate(
        tipo_evento="CREACION_PEDIDO",
        descripcion=f"Se registro pedido asociado al usuari identificado con el numero: {nuevo_pedido.usuario_id}",
        referencia_id=nuevo_pedido.id,
        usuario_id=usuario_id
    ))

    return nuevo_pedido

# ============================================================
# Ruta para listar todos los pedidos
# ============================================================
@router.get("/pedidos")
def listar_pedidos(pagina: int = 1, tamanio: int = 3, db: Session = Depends(get_db)):
    """
    Retorna la lista de todos los pedidos.
    """
    return services.listar_pedidos(db, pagina, tamanio)

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
# Obtener el carrito del usuario autenticado (o crearlo si no existe)
# ============================================================
@router.get("/carritos", response_model=schemas.Carrito)
def obtener_carrito(
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return services.obtener_carrito_o_crear(db, current_user.id)

# ============================================================
# Agregar un producto al carrito (fusionando carritos de sesión si es necesario)
# ============================================================
@router.post("/carritos/productos", response_model=schemas.CarritoDetalle, status_code=status.HTTP_201_CREATED)
def agregar_producto_al_carrito(
    detalle_data: schemas.CarritoDetalleBase,
    producto_id: int = Query(..., description="ID del producto a agregar"),
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    carrito = services.obtener_carrito_o_crear(db, current_user.id)
    detalle = services.agregar_producto_al_carrito(db, carrito.id, producto_id, detalle_data)
    return detalle

# ============================================================
# Actualizar cantidad de un producto en el carrito
# ============================================================
@router.patch("/carritos/productos/{producto_id}", response_model=schemas.CarritoDetalle)
def actualizar_cantidad_producto(
    producto_id: int,
    nueva_cantidad: int = Query(..., description="Nueva cantidad para el producto"),
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    carrito = services.obtener_carrito_o_crear(db, current_user.id)
    detalle = services.actualizar_cantidad_producto(db, carrito.id, producto_id, nueva_cantidad)
    return detalle

# ============================================================
# Eliminar un producto del carrito
# ============================================================
@router.delete("/carritos/productos/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto_del_carrito(
    producto_id: int,
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    carrito = services.obtener_carrito_o_crear(db, current_user.id)
    services.eliminar_producto_del_carrito(db, carrito.id, producto_id)
    return {"detail": "Producto eliminado del carrito"}

# ============================================================
# Listar detalles del carrito del usuario autenticado
# ============================================================
@router.get("/carritos/detalles", response_model=List[schemas.CarritoDetalle])
def listar_detalles(
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    carrito = services.obtener_carrito_o_crear(db, current_user.id)
    return services.listar_detalles(db, carrito.id)

# ----------------------------------------------------
# Vaciar Carrito
# ----------------------------------------------------
@router.delete("/carritos/vaciar", status_code=status.HTTP_204_NO_CONTENT)
def vaciar_carrito(
    current_user: schemas.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    carrito = services.obtener_carrito_por_usuario(db, current_user.id)
    if not carrito:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")
    services.vaciar_carrito(db, carrito.id)
    return {"detail": "Carrito vaciado"}

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
@router.get("/actividades")
def listar_actividades(pagina: int = 1, tamanio: int = 10, db: Session = Depends(get_db)):
    return services.listar_actividades(db, pagina, tamanio)

# ============================================================
# Obtener Reportes
# ============================================================
@router.get("/reportes/usuarios_mas_activos", response_model=list)
def obtener_usuarios_mas_activos(db: Session = Depends(get_db)):
    return services.obtener_top_usuarios_mas_activos(db)

# ============================================================
# Reporte de ventas por período
# ============================================================
@router.get("/reportes/ventas-periodo", response_model=List[schemas.ReporteVentasPeriodo])
def obtener_ventas_por_periodo(
    tipo_periodo: str = Query("diario", enum=["diario", "semanal", "mensual"]),
    fecha_inicio: datetime = Query(...),
    fecha_fin: datetime = Query(...),
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    """
    Genera un reporte de ventas agrupado por período temporal.
    """
    # Validar que fecha_inicio < fecha_fin
    if fecha_inicio >= fecha_fin:
        raise HTTPException(status_code=400, detail="fecha_inicio debe ser menor que fecha_fin")

    return services.generar_reporte_ventas_por_periodo(db, tipo_periodo, fecha_inicio, fecha_fin)


# ============================================================
# Estacionalidad de productos
# ============================================================
@router.get("/reportes/estacionalidad-productos", response_model=List[schemas.ProductoEstacionalidad])
def obtener_estacionalidad_productos(
    anio: int = Query(...),
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    """
    Muestra las ventas mensuales de cada producto para un año específico
    """
    return services.calcular_estacionalidad_productos(db, anio)

# ============================================================
# Costos vs Ganancias
# ============================================================
@router.get("/reportes/costos-ganancias", response_model=List[schemas.CostoGananciaResponse])
def obtener_costos_ganancias(
    producto_id: Optional[int] = None,
    categoria_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    """
    Calcula costos y ganancias, filtrable por producto o categoría
    """
    return services.calcular_costos_ganancias(db, producto_id, categoria_id)

# ============================================================
# Porcentaje de pedidos cancelados
# ============================================================
@router.get("/reportes/pedidos-cancelados", response_model=schemas.PedidosCanceladosResponse)
def obtener_metricas_cancelaciones(
    meses_historial: int = Query(3, ge=1, le=12),
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    """
    Calcula el porcentaje de pedidos cancelados y su evolución histórica
    """
    return services.calcular_metricas_cancelaciones(db, meses_historial)



# ============================================================
# Crear Descuento
# ============================================================
@router.post("/descuentos/")
def crear_descuento(
    nombre: str = Form(...),
    descripcion: Optional[str] = Form(None),
    tipo: schemas.TipoDescuentoEnum = Form(...),
    valor: float = Form(...),
    fecha_inicio: datetime = Form(...),
    fecha_fin: Optional[datetime] = Form(None),
    condiciones: Optional[str] = Form(None),
    activo: bool = Form(True),
    producto_id: Optional[int] = Form(None),
    metodo_pago_id: Optional[int] = Form(None), 
    db: Session = Depends(get_db)
):
    
    try:
        nuevo_descuento = services.crear_descuento(
            db=db,
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
        return nuevo_descuento
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
# ============================================================
# Listar Descuentos
# ============================================================
@router.get("/descuentos")
def listar_descuentos(pagina: int = 1, tamanio: int = 10, db: Session = Depends(get_db)):
    return services.listar_descuentos(db=db, pagina=pagina, tamanio=tamanio)



# ============================================================
# Obtener descuento por ID
# ============================================================

@router.get("/descuentos/{descuento_id}", response_model=schemas.Descuento)
def obtener_descuento_por_id(descuento_id: int, db: Session = Depends(get_db)):
    return services.obtener_descuento_por_id(db=db, descuento_id=descuento_id)

def convertir_fecha(fecha_str: Optional[str]) -> Optional[datetime]:
    """Convierte una fecha en string a datetime, si es válida."""
    if not fecha_str:
        return None  # Evita errores si la fecha es None

    try:
        return datetime.fromisoformat(fecha_str.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Formato de fecha inválido: {fecha_str}. Se espera ISO 8601.")

@router.put("/descuentos/{descuento_id}", response_model=schemas.Descuento)
def actualizar_descuento(
    descuento_id: int,
    nombre: str = Form(...),
    descripcion: Optional[str] = Form(None),
    tipo: str = Form(...),
    valor: float = Form(...),
    fecha_inicio: str = Form(...),
    fecha_fin: Optional[str] = Form(None),
    condiciones: Optional[str] = Form(None),
    activo: bool = Form(...),
    producto_id: Optional[int] = Form(None),
    metodo_pago_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
):
    """
    Ruta que recibe los datos como FormData para actualizar un descuento.
    """

    # 🔹 Convertimos las fechas a datetime
    fecha_inicio_dt = convertir_fecha(fecha_inicio)
    fecha_fin_dt = convertir_fecha(fecha_fin)

    return services.actualizar_descuento(
        db=db,
        descuento_id=descuento_id,
        nombre=nombre,
        descripcion=descripcion,
        tipo=tipo,
        valor=valor,
        fecha_inicio=fecha_inicio_dt,  # Pasamos el datetime en lugar del string
        fecha_fin=fecha_fin_dt,        # Lo mismo aquí
        condiciones=condiciones,
        activo=activo,
        producto_id=producto_id,
        metodo_pago_id=metodo_pago_id,
    )

# ============================================================
# Eliminar Descuento
# ============================================================

@router.delete("/descuentos/{descuento_id}")
def eliminar_descuento(descuento_id: int, db: Session = Depends(get_db)):
    services.eliminar_descuento(db=db, descuento_id=descuento_id)
    return {"message": "Descuento eliminado con éxito"}


