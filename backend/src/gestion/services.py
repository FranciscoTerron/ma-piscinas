from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from src.gestion.models import Usuario, Rol
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