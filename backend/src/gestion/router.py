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

# Ruta para roles
@router.get("/roles", response_model=List[schemas.Rol])
def listar_roles(db: Session = Depends(get_db)):
    return services.listar_roles(db)