from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from src.gestion.models import Usuario
from src.gestion import schemas, exceptions
from src.utils.jwt import create_access_token
from passlib.context import CryptContext
from datetime import datetime, UTC, timedelta
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CRUD para Usuario
def registrar_usuario(db: Session, usuario: schemas.UsuarioCreate) -> Usuario:
    db_usuario = Usuario.get(db, email=usuario.email)
    if db_usuario:
        raise exceptions.EmailYaRegistrado()
    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email
    )
    nuevo_usuario.set_password(usuario.password)
    return nuevo_usuario.save(db)

def autenticar_usuario(db: Session, email: str, password: str):
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user or not user.verify_password(password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "name": user.nombre}, expires_delta=access_token_expires
    )
    return access_token

