from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.gestion import schemas, services
from src.auth.dependencies import get_current_user
from typing import List

router = APIRouter()

# Rutas para Usuarios
@router.post("/register", response_model=schemas.Usuario)
def register(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return services.registrar_usuario(db, usuario)

@router.post("/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    token = services.autenticar_usuario(db, request.email, request.password)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/usuarios", response_model=List[schemas.Usuario])
def listar_usuarios(db: Session = Depends(get_db)):
    return services.listar_usuarios(db)

@router.put("/usuarios/{usuario_id}/datos-personales", response_model=schemas.Usuario)
def actualizar_datos_personales(
    usuario_id: int,
    datos_actualizados: schemas.UsuarioUpdate,
    db: Session = Depends(get_db),
):
    return services.actualizar_datos_personales(db, usuario_id, datos_actualizados)

@router.put("/usuarios/{usuario_id}/contrasena", response_model=schemas.Usuario)
def actualizar_contrasena(
    usuario_id: int,
    contrasena_actualizada: schemas.UsuarioUpdatePassword,
    db: Session = Depends(get_db),
):
    return services.actualizar_contrasena(db, usuario_id, contrasena_actualizada.nueva_contrasena)

@router.delete("/usuarios/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    services.eliminar_usuario(db, usuario_id)
    return None

# Ruta para ROLES
# -----------------------------------------------------------------------------------------
@router.get("/roles", response_model=List[schemas.ObtenerRol])
def listar_roles(db: Session = Depends(get_db)):
    return services.listar_roles(db)

@router.get("/roles/{rol_id}", response_model=schemas.ObtenerRol)
def obtener_rol(rol_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un rol específico por su ID.
    """
    rol = services.obtener_rol_por_id(db, rol_id)
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return rol

@router.put("/usuarios/{usuario_id}/rol", response_model=schemas.Usuario)
def actualizar_rol_usuario(usuario_id: int, nuevo_rol: schemas.RolUpdate, db: Session = Depends(get_db)):
    """
    Actualiza el rol de un usuario específico.
    """
    return services.actualizar_rol_usuario(db, usuario_id, nuevo_rol.rol_id)


# RUTAS PARA CATEGORIA
#-------------------------------------------------------------------------------------------
# Crear una nueva categoría
@router.post("/categorias", response_model=schemas.CategoriaProducto, status_code=status.HTTP_201_CREATED)
def crear_categoria(categoria: schemas.CategoriaProductoBase, db: Session = Depends(get_db)):
    return services.crear_categoria(db, categoria)

# Obtener todas las categorías
@router.get("/categorias", response_model=list[schemas.CategoriaProducto])
def listar_categorias(db: Session = Depends(get_db)):
    return services.listar_categorias(db)

# Obtener una categoría por ID
@router.get("/categorias/{categoria_id}", response_model=schemas.CategoriaProducto)
def obtener_categoria(categoria_id: int, db: Session = Depends(get_db)):
    return services.obtener_categoria_por_id(db, categoria_id)

# Actualizar una categoría
@router.put("/categorias/{categoria_id}", response_model=schemas.CategoriaProducto)
def actualizar_categoria(categoria_id: int, categoria_update: schemas.CategoriaProductoBase, db: Session = Depends(get_db)):
    return services.actualizar_categoria(db, categoria_id, categoria_update)

# Eliminar una categoría
@router.delete("/categorias/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    services.eliminar_categoria(db, categoria_id)
    return {"message": "Categoría eliminada correctamente"}


# RUTAS PARA PRODUCTO
#-------------------------------------------------------------------------------------------
# Crear un nuevo producto
@router.post("/productos", response_model=schemas.Producto, status_code=status.HTTP_201_CREATED)
def crear_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    return services.crear_producto(db, producto)

@router.get("/productos", response_model=List[schemas.Producto])
def listar_productos(db: Session = Depends(get_db)):
    return services.listar_productos(db)

@router.get("/productos/{producto_id}", response_model=schemas.Producto)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    return services.obtener_producto_por_id(db, producto_id)

@router.put("/productos/{producto_id}", response_model=schemas.Producto)
def actualizar_producto(
    producto_id: int,
    producto_update: schemas.ProductoBase,
    db: Session = Depends(get_db),
):
    return services.actualizar_producto(db, producto_id, producto_update)

@router.delete("/productos/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    services.eliminar_producto(db, producto_id)
    return None