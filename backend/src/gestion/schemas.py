from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from datetime import datetime, date
from enum import Enum


# Estado de Carrito
class EstadoCarritoEnum(str, Enum):
    CONFIRMADO = "confirmado"
    PENDIENTE = "pendiente"

# Estado de Envío
class EstadoEnvioEnum(str, Enum):
    PREPARADO = "preparado"
    EN_CAMINO = "en_camino"
    ENTREGADO = "entregado"

# Estado de Pedido
class EstadoPedidoEnum(str, Enum):
    PENDIENTE = "pendiente"
    ENVIADO = "enviado"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"

# Estado de Pago
class EstadoPagoEnum(str, Enum):
    PENDIENTE = "pendiente"
    APROBADO = "aprobado"
    RECHAZADO = "rechazado"

# Método de Pago
class MetodoPagoEnum(str, Enum):
    TARJETA = "tarjeta"
    TRANSFERENCIA = "transferencia"
    EFECTIVO = "efectivo"

# Esquema base para evitar repetir código
class RolBase(BaseModel):
    nombre: str = Field(..., min_length=3, example="administrador")
    descripcion: Optional[str] = Field(None, example="Rol con acceso total")

# Esquema para crear un rol (hereda de RolBase)
class RolCreate(RolBase):
    pass

# Esquema para actualizar un rol (todos los campos opcionales)
class RolUpdate(BaseModel):
    rol_id: int = Field(..., example=2)  # ID del nuevo rol a asignar

# Esquema para devolver un rol en respuestas
class ObtenerRol(RolBase):
    id: int

    class Config:
        from_attributes = True  # Para mapear con SQLAlchemy

# Schemas para Usuario
class UsuarioBase(BaseModel):
    nombre: str = Field(..., example="Juan Pérez")
    email: EmailStr = Field(..., example="juan.perez@example.com")
    telefono: int = Field(..., example=123456789)
    direccion: str = Field(..., example="Calle Falsa 123")

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8, example="password123")
    
class Usuario(UsuarioBase):
    id: int = Field(..., example=1)
    fecha_creacion: datetime = Field(..., example="2023-10-01T12:00:00Z")

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str = Field(..., example="juan.perez@example.com")
    password: str = Field(..., example="password123")
    
class UsuarioUpdate(BaseModel):
    nombre: str | None = None
    email: EmailStr | None = None
    telefono: int | None = None
    direccion: str | None = None

class UsuarioUpdatePassword(BaseModel):
    nueva_contrasena: str = Field(..., min_length=8, example="nueva_password123")

class UsuarioRespuesta(Usuario):
    rol_id: int

class Token(BaseModel):
    access_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="bearer", example="bearer")

# Esquema base para Producto
class ProductoBase(BaseModel):
    nombre: str = Field(..., example="Laptop Gamer")
    descripcion: str = Field(..., example="Laptop con procesador i7 y 16GB RAM")
    precio: float = Field(..., example=1200.50)
    stock: int = Field(..., example=10)
    imagen: str = Field(..., example="imagen_producto.jpg")

# Esquema para crear un producto
class ProductoCreate(ProductoBase):
    categoria_id: int = Field(..., example=1)

# Esquema para devolver un producto
class Producto(ProductoBase):
    id: int = Field(..., example=1)
    categoria_id: int

    class Config:
        from_attributes = True

# Esquema de Categoría de Producto
class CategoriaProductoBase(BaseModel):
    nombre: str = Field(..., example="Electrónica")
    descripcion: str = Field(..., example="Productos electrónicos y gadgets")

class CategoriaProducto(CategoriaProductoBase):
    id: int = Field(..., example=1)

    class Config:
        from_attributes = True

# Esquema de Carrito
class CarritoBase(BaseModel):
    estado: EstadoCarritoEnum = Field(default=EstadoCarritoEnum.PENDIENTE)

class Carrito(CarritoBase):
    id: int
    usuario_id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

# Esquema de CarritoDetalle
class CarritoDetalleBase(BaseModel):
    cantidad: int = Field(..., example=2)
    subtotal: float = Field(..., example=2400.99)

class CarritoDetalle(CarritoDetalleBase):
    id: int
    carrito_id: int
    producto_id: int

    class Config:
        from_attributes = True

# Esquema de Pedido
class PedidoBase(BaseModel):
    total: float = Field(..., example=5000.75)
    estado: EstadoPedidoEnum = Field(default=EstadoPedidoEnum.PENDIENTE)

class Pedido(PedidoBase):
    id: int
    usuario_id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

# Esquema de PedidoDetalle
class PedidoDetalleBase(BaseModel):
    cantidad: int = Field(..., example=1)
    subtotal: float = Field(..., example=1200.50)
    precio_unitario: float = Field(..., example=1200.50)

class PedidoDetalle(PedidoDetalleBase):
    id: int
    pedido_id: int
    producto_id: int

    class Config:
        from_attributes = True

# Esquema de Envío
class EnvioBase(BaseModel):
    direccion: str = Field(..., example="Avenida Siempre Viva 123")
    empresa: str = Field(..., example="DHL")
    codigoSeguimiento: str = Field(..., example="ABC123XYZ")
    estado: EstadoEnvioEnum = Field(default=EstadoEnvioEnum.PREPARADO)

class Envio(EnvioBase):
    id: int
    pedido_id: int

    class Config:
        from_attributes = True

class EnvioCreate(EnvioBase):
    envio_id: int = Field(..., example=1)

# Esquema de Pago
class PagoBase(BaseModel):
    monto: float = Field(..., example=5000.75)
    estado: EstadoPagoEnum = Field(default=EstadoPagoEnum.PENDIENTE)

class Pago(PagoBase):
    id: int
    pedido_id: int
    metodoPago_id: int

    class Config:
        from_attributes = True

# Esquema de Método de Pago
class MetodoPagoBase(BaseModel):
    estado: MetodoPagoEnum = Field(default=MetodoPagoEnum.TARJETA)

class MetodoPago(MetodoPagoBase):
    id: int

    class Config:
        from_attributes = True
