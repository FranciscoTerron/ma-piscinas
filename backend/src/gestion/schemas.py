from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from datetime import datetime, date

# Schemas para Usuario
class UsuarioBase(BaseModel):
    nombre: str = Field(..., example="Juan Pérez")
    email: EmailStr = Field(..., example="juan.perez@example.com")

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8, example="password123")

class Usuario(UsuarioBase):
    id: int = Field(..., example=1)

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str = Field(..., example="juan.perez@example.com")
    password: str = Field(..., example="password123")

class Token(BaseModel):
    access_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="bearer", example="bearer")

