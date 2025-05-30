from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional, Dict
from datetime import datetime, date
from enum import Enum
import re

# ============================================================
# Estado Carrito
# ============================================================
class EstadoCarritoEnum(str, Enum):
    CONFIRMADO = "CONFIRMADO"
    PENDIENTE = "CONFIRMADO"

# ============================================================
# Estado De Envio
# ============================================================
class EstadoEnvioEnum(str, Enum):
    PREPARADO = "PREPARADO"
    EN_CAMINO = "EN_CAMINO"
    ENTREGADO = "ENTREGADO"

# ============================================================
# Estado pedido
# ============================================================
class EstadoPedidoEnum(str, Enum):
    PENDIENTE = "PENDIENTE"
    ENVIADO = "ENVIADO"
    ENTREGADO = "ENTREGADO"
    CANCELADO = "CANCELADO"

# ============================================================
# Estado para pago
# ============================================================
class EstadoPagoEnum(str, Enum):
    PENDIENTE = "PENDIENTE"
    APROBADO = "APROBADO"
    RECHAZADO = "RECHAZADO"

# ============================================================
# Metodo de pago
# ============================================================
class MetodoPagoEnum(str, Enum):
    EFECTIVO = "EFECTIVO"
    TARJETA = "TARJETA"
    TRANSFERENCIA = "TRANSFERENCIA"

# ============================================================
# Tipo de Actividad
# ============================================================
class TipoActividadEnum(str, Enum):
    CREACION_USUARIO = "CREACION_USUARIO"
    CREACION_PRODUCTO = "CREACION_PRODUCTO"
    CREACION_ENVIO = "CREACION_ENVIO"
    CREACION_PAGO = "CREACION_PAGO"
    CREACION_PEDIDO = "CREACION_PEDIDO"
    
# ============================================================
# Esquema base para evitar repetir codigo
# ============================================================

# ROL 
#--------------------------------------------------------------------------

class RolBase(BaseModel):
    nombre: str = Field(..., min_length=3, example="administrador")
    descripcion: Optional[str] = Field(None, example="Rol con acceso total")

# ============================================================
# Esquema para crear un rol (hereda de RolBase)
# ============================================================
class RolCreate(RolBase):
    pass

# ============================================================
# Esquema para actualizar un rol (todos los campos opcionales)
# ============================================================
class RolUpdate(BaseModel):
    rol_id: int = Field(..., example=2)  # ID del nuevo rol a asignar

# ============================================================
# Esquema para devolver rol
# ============================================================
class ObtenerRol(RolBase):
    id: int

    class Config:
        from_attributes = True  # Para mapear con SQLAlchemy

#USUARIO

#---------------------------------------------------------------------------------
# ============================================================
# Esquema usuario
# ============================================================
class UsuarioBase(BaseModel):
    nombre: str = Field(..., example="Juan")
    nombreUsuario: str = Field(..., example="juan123")
    email: EmailStr = Field(..., example="juan.perez@example.com")
    telefono: int = Field(..., example=123456789)
    apellido: str = Field(..., example="Pérez")


# ============================================================
# Esquema para crear un usuario 
# ============================================================
class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8, example="password123")

    @validator('password')
    def validar_password(cls, value):
        if not re.search(r'[A-Z]', value):
            raise ValueError('La contraseña debe contener al menos una letra mayúscula')
        if not re.search(r'[0-9]', value):
            raise ValueError('La contraseña debe contener al menos un número')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise ValueError('La contraseña debe contener al menos un carácter especial')
        return value
    
class Usuario(UsuarioBase):
    id: int = Field(..., example=1)
    fecha_creacion: datetime = Field(..., example="2023-10-01T12:00:00Z")
    rol_id: int
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    nombreUsuario: str = Field(..., example="juan123") 
    password: str = Field(..., example="password123")
    
# ============================================================
# Esquema para actualizar un usuario 
# ============================================================
class UsuarioUpdate(BaseModel):
    nombre: str | None = None
    apellido: str | None = None
    email: EmailStr | None = None
    telefono: int | None = None
    direccion: str | None = None

    @validator('telefono')
    def validar_telefono(cls, value):
        if value is not None and len(str(value)) < 8:
            raise ValueError('El teléfono debe tener al menos 8 dígitos')
        return value

    @validator('email')
    def validar_email(cls, value):
        if value is not None and not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', value):
            raise ValueError('El email no tiene un formato válido')
        return value
    
# ============================================================
# Esquema para actualizar contraseña
# ============================================================
class UsuarioUpdatePassword(BaseModel):
    nueva_contrasena: str = Field(..., min_length=8, example="nueva_password123")

class UsuarioRespuesta(Usuario):
    rol_id: int

class Token(BaseModel):
    access_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="bearer", example="bearer")



# ============================================================
# Tipo de Descuento
# ============================================================
class TipoDescuentoEnum(str, Enum):
    PORCENTAJE = "PORCENTAJE"
    MONTO_FIJO = "MONTO_FIJO"
    CUOTAS_SIN_INTERES = "CUOTAS_SIN_INTERES"

# ============================================================
# Esquema base para Descuento
# ============================================================
class Descuento(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    tipo: TipoDescuentoEnum
    valor: float
    fecha_inicio: datetime
    fecha_fin: Optional[datetime] = None
    condiciones: Optional[str] = None
    activo: bool = True
    producto_id: Optional[int] = None
    metodo_pago_id: Optional[int] = None

class DescuentoCreate(Descuento):
    pass

class DescuentoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    tipo: Optional[TipoDescuentoEnum] = None
    valor: Optional[float] = None
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None
    activo: Optional[bool] = None
    producto_id: Optional[int] = None
    
#PRODUCTO
#----------------------------------------------------------------------------------------------------

# ============================================================
# Esquema base para Producto
# ============================================================# En tu archivo de schemas.py
class ProductoBase(BaseModel):
    nombre: str = Field(..., example="Laptop Gamer")
    descripcion: str = Field(..., example="Laptop con procesador i7 y 16GB RAM")
    precio: float = Field(..., example=1200.50)
    stock: int = Field(..., example=10)
    imagen: Optional[str] = Field(None, example="imagen_producto.jpg")
    costo_compra: Optional[float] = Field(None, example=800.00)  # Nuevo campo
    subcategoria_id: Optional[int] = Field(None, example=1)  # Nuevo campo opcional
    peso: Optional[float] = Field(None, example=1.5)  # Nuevo campo para peso
    volumen: Optional[float] = Field(None, example=0.01)  # Nuevo campo para volumen
    costo_envio: Optional[float] = Field(None, example=50.0)
    

class ProductoCreate(ProductoBase):
    categoria_id: int = Field(..., example=1)
    descuento_id: Optional[int] = Field(None, example=2, description="ID del descuento a aplicar, opcional")


class Producto(ProductoBase):
    id: int = Field(..., example=1)
    codigo: str = Field(..., example="PROD-001")
    categoria_id: int

    class Config:
        from_attributes = True
        
# ============================================================
# Esquema de salida para Producto que incluye el descuento
# ============================================================
class ProductoOut(Producto):
    descuento: Optional[Descuento] = None

    class Config:
        orm_mode = True
        
# ============================================================
# Esquema para respuesta con paginación (lista de productos)
# ============================================================
class ProductoListResponse(BaseModel):
    total: int
    productos: List[ProductoOut]
    
#Categoria
#-------------------------------------------------------------------------------------
# ============================================================
# Esquema para Categoria Base
# ============================================================
class CategoriaProductoBase(BaseModel):
    nombre: str = Field(..., example="Electrónica")
    descripcion: str = Field(..., example="Productos electrónicos y gadgets")
    imagen: Optional[str] = Field(None, example="imagen_producto.jpg")


# ============================================================
# Esquema para crear Categoria
# ============================================================
class CategoriaProducto(CategoriaProductoBase):
    id: int = Field(..., example=1)

    class Config:
        from_attributes = True

#SubCategoria
#-------------------------------------------------------------------------------------
# ============================================================
# Esquema para #SubCategoria Base
# ============================================================
class SubCategoriaBase(BaseModel):
    nombre: str = Field(..., example="Electrónica")

# ============================================================
# Esquema para crear SubCategoria
# ============================================================
class SubCategoria(SubCategoriaBase):
    id: int = Field(..., example=1)
    categoria_id: int
    class Config:
        from_attributes = True

#Carrito
#--------------------------------------------------------------------------------

# Esquema de Carrito Base
class CarritoBase(BaseModel):
    estado: EstadoCarritoEnum = Field(default=EstadoCarritoEnum.PENDIENTE)


class Carrito(CarritoBase):
    id: int
    usuario_id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

#CarritoDetalle
#------------------------------------------------------------------------------------------

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

# Pedido
#------------------------------------------------------------------------------------------
# ============================================================
# Esquema para Pedido BASE
# ============================================================
class PedidoBase(BaseModel):
    total: float = Field(..., example=5000.75)
    estado: EstadoPedidoEnum = Field(default=EstadoPedidoEnum.PENDIENTE)
    usuario_id: int
    
class Pedido(PedidoBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True
        
class PedidoEstadoUpdate(BaseModel):
    id: int
    estado: EstadoPedidoEnum
        
# ============================================================
# Esquema para crear un pedido
# ============================================================
class PedidoCreate(PedidoBase):
    pass
    
# ============================================================
# Esquema para actualizar pedido
# ============================================================    
class PedidoUpdate(BaseModel):
    total: Optional[float] = Field(None, example=5000.75)
    estado: Optional[EstadoPedidoEnum] = Field(None, example="enviado")
    
    
# Detalle pedido
#-------------------------------------------------------------------------------------    
    
    
# ============================================================
# Esquema para Detalle Pedido BASE
# ============================================================        
class PedidoDetalleBase(BaseModel):
    cantidad: int = Field(..., example=1)
    subtotal: float = Field(..., example=1200.50)
    precio_unitario: float = Field(..., example=1200.50)

    
# ============================================================
# Esquema para crear un detalle de pedido, que incluye las FK necesarias
# ============================================================    

class PedidoDetalleCreate(PedidoDetalleBase):
    pedido_id: int = Field(..., example=1)
    producto_id: int = Field(..., example=2)

    
# ============================================================
# Esquema para respuestas (incluye los IDs)
# ============================================================    
class PedidoDetalle(PedidoDetalleBase):
    id: int
    pedido_id: int
    producto_id: int

    class Config:
        from_attributes = True

# ENVIO
#---------------------------------------------------------------------------------
# ============================================================
# Esquema para envio BASE 
# ============================================================
class EnvioBase(BaseModel):
    direccion: str = Field(..., example="Avenida Siempre Viva 123")
    empresa_id: int = Field(..., example="DHL")
    codigoSeguimiento: str = Field(..., example="ABC123XYZ")
    estado: EstadoEnvioEnum = Field(default=EstadoEnvioEnum.PREPARADO)

class Envio(EnvioBase):
    id: int
    pedido_id: int

    class Config:
        from_attributes = True

# ============================================================
# Esquema para crear un envio
# ============================================================
class EnvioCreate(EnvioBase):
    envio_id: int = Field(..., example=1)


# ============================================================
# Esquema Base de Empresa (atributos basicos)
# ============================================================
class EmpresaBase  (BaseModel):
    nombre: str = Field(..., example="Andreani")
    direccion: Optional[str] = Field(None, example="Avenida Siempre Viva 123")
    telefono: Optional[int] = Field(None, example=5491112345678)
    imagen: Optional[str] = Field(None, example="imagen_producto.jpg")


# ============================================================
# Esquema para la creación de una empresa
# ============================================================
class EmpresaCreate(EmpresaBase):
    pass  # Se hereda directamente del BaseModel sin cambios

# ============================================================
# Esquema para representar una empresa con ID (respuesta de la API)
# ============================================================
class Empresa(EmpresaBase): 
    id: int

    class Config:
        from_attributes = True
#PAGO
#--------------------------------------------------------------------------------------------
# ============================================================
# Esquema pago BASE
# ============================================================
# Esquema base para crear un pago
class PagoBase(BaseModel):
    monto: float = Field(..., example=5000.75)
    estado: EstadoPagoEnum = Field(default=EstadoPagoEnum.PENDIENTE)

# Esquema para devolver un pago (incluye campos adicionales como `id`)
class Pago(PagoBase):
    id: int
    pedido_id: int
    metodoPago_id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True  # Permite la conversión desde un objeto SQLAlchemy
#METODO PAGO
#-----------------------------------------------------------------------------------------

# ============================================================
# Esquema para Metodo Pago BASE
# ============================================================


class MetodoPagoBase(BaseModel):
    nombre: str = Field(..., example="Visa")
    tipo: MetodoPagoEnum = Field(default=MetodoPagoEnum.TARJETA)
    imagen: Optional[str] = Field(None, example="imagen_producto.jpg")

class MetodoPago(MetodoPagoBase):
    id: int 

    class Config:
        from_attributes = True
        
class MetodoPagoCreate(MetodoPagoBase):
    pass  # Se hereda directamente del BaseModel sin cambios

#ACTIVIDADES
# ============================================================
# Esquema para Metodo Pago BASE
# ============================================================# Esquema de respuesta corregido
class ActividadBase(BaseModel):
    tipo_evento: str
    descripcion: str
    referencia_id: Optional[int] = None
    usuario_id: int

class ActividadCreate(ActividadBase):
    pass

class Actividad(ActividadBase):
    id: int
    fecha: datetime

    class Config:
        orm_mode = True
        
#Reportes
# ============================================================
# Esquema para Reportes
# ============================================================

class UsuarioReporteSchema(BaseModel):
    nombre: str
    compras: int

class ProductoReporteSchema(BaseModel):
    nombre: str
    ventas: int

class IngresoMensualSchema(BaseModel):
    mes: str
    ingresos: float

class MetodoPagoSchema(BaseModel):
    nombre: str
    usos: int

class ReporteSchema(BaseModel):
    usuarios_mas_activos: List[UsuarioReporteSchema]
    productos_mas_vendidos: List[ProductoReporteSchema]
    ingresos_mensuales: List[IngresoMensualSchema]
    metodos_pago_usados: List[MetodoPagoSchema]
    
class ReporteVentasPeriodo(BaseModel):
    periodo: str
    total_ventas: float
    cantidad_pedidos: int

class ProductoEstacionalidad(BaseModel):
    producto_id: int
    nombre_producto: str
    ventas_por_mes: Dict[str, int]  # {"01": 150, "02": 200, ...}

class CostoGananciaResponse(BaseModel):
    producto_id: int
    nombre: str
    costo_total: float
    ganancia_total: float
    margen_ganancia: float

class PedidosCanceladosResponse(BaseModel):
    total_pedidos: int
    pedidos_cancelados: int
    porcentaje_cancelados: float
    ultimos_3_meses: Dict[str, float]  # {"2023-10": 15.2, ...}
    



# ============================================================
# Esquema base para DireccionEnvio
# ============================================================
class DireccionEnvioBase(BaseModel):
    ciudad: str = Field(..., example="Buenos Aires")
    codigo_postal: str = Field(..., example="1234")
    provincia: str = Field(..., example="Buenos Aires")
    direccion: str = Field(..., example="Calle Falsa 123")


# ============================================================
# Esquema para crear una dirección de envío
# ============================================================
class DireccionEnvioCreate(DireccionEnvioBase):
    usuario_id: int = Field(..., example=1)

# ============================================================
# Esquema para actualizar una dirección de envío
# ============================================================
class DireccionEnvioUpdate(BaseModel):
    ciudad: Optional[str] = Field(None, example="Córdoba")
    codigo_postal: Optional[str] = Field(None, example="5000")
    provincia: Optional[str] = Field(None, example="Córdoba")
    direccion: Optional[str] = Field(None, example="direccion Falsa")

# ============================================================
# Esquema para devolver una dirección de envío (respuesta)
# ============================================================
class DireccionEnvio(DireccionEnvioBase):
    id: int = Field(..., example=1)
    usuario_id: int = Field(..., example=1)
    fecha_creacion: datetime = Field(..., example="2023-10-01T12:00:00Z")

    class Config:
        from_attributes = True  
        
        

# ============================================================
# Esquema base para Comentario
# ============================================================
class ComentarioBase(BaseModel):
    texto: str
    calificacion: int = Field(..., ge=1, le=5)
    producto_id: int


# ============================================================
# Esquema Creacion
# ============================================================
class ComentarioCreate(ComentarioBase):
    pass


# ============================================================
# Esquema respuesta
# ============================================================
class ComentarioOut(ComentarioBase):
    id: int
    fecha_creacion: datetime
    usuario_id: int

    class Config:
        orm_mode = True
        
# Modelos para la solicitud y la respuesta
class DetallesPaquete(BaseModel):
    weight: float
    volume: float
    declaredValue: float

class SolicitudEnvio(BaseModel):
    zipCode: str
    packageDetails: DetallesPaquete

class CotizacionEnvio(BaseModel):
    service: str
    cost: float
    deliveryDays: int
    serviceType: str
    contract: str

class RespuestaEnvio(BaseModel):
    quotes: list[CotizacionEnvio]
        