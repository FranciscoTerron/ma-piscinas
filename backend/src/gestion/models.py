from typing import List, Optional
from sqlalchemy import Column, Integer, Boolean, String, DateTime, Float, ForeignKey, Enum as SQLAlchemyEnum,DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, UTC
from src.models import BaseModel
from passlib.context import CryptContext
from enum import Enum
from src.utils.time import now

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class EstadoCarrito(Enum):
    CONFIRMADO = "CONFIRMADO"
    PENDIENTE = "PENDIENTE"

class EstadoEnvio(Enum):
    PREPARADO = "PREPARADO"
    EN_CAMINO = "EN_CAMINO"
    ENTREGADO = "ENTREGADO"

class EstadoPedido(Enum):
    PENDIENTE = "PENDIENTE"
    ENVIADO = "ENVIADO"
    ENTREGADO = "ENTREGADO"
    CANCELADO = "CANCELADO"
    

class EstadoPago(Enum):
    PENDIENTE = "PENDIENTE"
    APROBADO = "APROBADO"
    RECHAZADO = "RECHAZADO"


class MetodoPagoEnum(Enum):
    TARJETA = "TARJETA"
    TRANSFERENCIA = "TRANSFERENCIA"
    EFECTIVO = "EFECTIVO"

class TipoActividad(Enum):
    CREACION_USUARIO = "CREACION_USUARIO"
    CREACION_PRODUCTO = "CREACION_PRODUCTO"
    CREACION_ENVIO = "CREACION_ENVIO"
    CREACION_PAGO = "CREACION_PAGO"
    CREACION_PEDIDO = "CREACION_PEDIDO"
    
class TipoDescuento(Enum):
    PORCENTAJE = "PORCENTAJE"
    MONTO_FIJO = "MONTO_FIJO"
    CUOTAS_SIN_INTERES = "CUOTAS_SIN_INTERES"

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    apellido: Mapped[str] = mapped_column(String, index=True)
    nombreUsuario: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    telefono: Mapped[int] = mapped_column(Integer)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=now)
    rol_id = Column(Integer, ForeignKey("roles.id"))
    rol = relationship("Rol", backref="usuarios")
    carrito = relationship("Carrito", back_populates="usuario")
    pedido = relationship("Pedido", back_populates="usuario" )
    # Relación inversa
    actividades = relationship("Actividad", back_populates="usuario")
    direcciones_envio = relationship("DireccionEnvio", back_populates="usuario")
    comentarios = relationship("Comentario", back_populates="usuario")
    
    def set_password(self, password: str):
        self.hashed_password = pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

class DireccionEnvio(BaseModel):
    __tablename__ = "direcciones_envio"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ciudad: Mapped[str] = mapped_column(String)
    codigo_postal: Mapped[str] = mapped_column(String)
    provincia: Mapped[str] = mapped_column(String)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    usuario = relationship("Usuario", back_populates="direcciones_envio")
    direccion: Mapped[str] = mapped_column(String)


class Rol(BaseModel):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    
    usuario = relationship("Usuario", back_populates="rol")
    
class Carrito(BaseModel):
    __tablename__ = "carritos"
     
    id = Column(Integer, primary_key=True, index=True)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=now)
    estado: Mapped[EstadoCarrito] = mapped_column(SQLAlchemyEnum(EstadoCarrito), default=EstadoCarrito.PENDIENTE)
    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)  # Clave foránea a Usuario
    usuario = relationship("Usuario", back_populates="carrito")  # Relación bidireccional
    carritoDetalle = relationship("CarritoDetalle", back_populates="carrito")
    
class CarritoDetalle(BaseModel): 
    __tablename__ = "carritodetalles"
        
    id = Column(Integer, primary_key=True, index=True)
    cantidad: Mapped[int] = mapped_column(Integer)
    subtotal: Mapped[float] = mapped_column(Float)
    
    carrito_id = Column(Integer, ForeignKey("carritos.id"), nullable=False)  # Clave foránea a Usuario
    carrito = relationship("Carrito", back_populates="carritoDetalle")  # Relación bidireccional
  
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)  # Clave foránea a Usuario
    producto = relationship("Producto", back_populates="carritoDetalle")  # Relación bidireccional

class Producto(BaseModel):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, index=True, nullable=False)  # Nuevo campo único
    nombre: Mapped[str] = mapped_column(String, index=True)
    descripcion: Mapped[str] = mapped_column(String, index=True)
    precio: Mapped[float] = mapped_column(Float, index=True)
    stock: Mapped[int] = mapped_column(Integer, index=True)
    imagen: Mapped[str] = mapped_column(String, index=True)
    costo_compra: Mapped[float] = mapped_column(Float, nullable=True, default=None)  # Nuevo campo
    peso: Mapped[float] = mapped_column(Float, nullable=True, default=None)  # Nuevo campo para peso
    volumen: Mapped[float] = mapped_column(Float, nullable=True, default=None)  # Nuevo campo para volumen
    costo_envio: Mapped[float] = mapped_column(Float, nullable=True, default=None)
    subcategoria_id = Column(Integer, ForeignKey("subcategorias.id"), nullable=True)  # Añadimos esto
    descuento_id = Column(Integer, ForeignKey("descuentos.id"), nullable=True)

    comentarios = relationship("Comentario", back_populates="producto")  # Asegúrate de usar back_populates
    carritoDetalle = relationship("CarritoDetalle", back_populates="producto")
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    categoria = relationship("CategoriaProducto", back_populates="productos")
    pedidoDetalle = relationship("PedidoDetalle", back_populates="producto")
    descuento = relationship(
        "Descuento",
        foreign_keys=[descuento_id],
        back_populates="productos"
    )
    subcategoria = relationship("SubCategoria", back_populates="productos")  # Relación bidireccional    
class CategoriaProducto(BaseModel):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    descripcion: Mapped[str] = mapped_column(String, index=True)
    imagen: Mapped[str] = mapped_column(String, index=True)


    productos = relationship("Producto", back_populates="categoria")
    subcategorias = relationship("SubCategoria", back_populates="categoria")

class SubCategoria(BaseModel):
    __tablename__ = "subcategorias"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    categoria = relationship("CategoriaProducto", back_populates="subcategorias")
    productos = relationship("Producto", back_populates="subcategoria")  # Relación inversa

# MODELO EMPRESA
class Empresa(BaseModel):
    __tablename__ = "empresas"  # Nombre correcto de la tabla

    id = Column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    direccion: Mapped[str] = mapped_column(String, index=True)
    telefono: Mapped[int] = mapped_column(Integer)
    imagen: Mapped[str] = mapped_column(String, index=True)


    envios = relationship("Envio", back_populates="empresa")  # Relación con Envio

# MODELO ENVIO
class Envio(BaseModel):
    __tablename__ = "envios"

    id = Column(Integer, primary_key=True, index=True)
    direccion: Mapped[str] = mapped_column(String, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False) 
    empresa = relationship("Empresa", back_populates="envios")  # Relación con Empresa

    codigoSeguimiento: Mapped[str] = mapped_column(String, index=True)
    estado: Mapped[EstadoEnvio] = mapped_column(SQLAlchemyEnum(EstadoEnvio), default=EstadoEnvio.PREPARADO)

    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    pedido = relationship("Pedido", back_populates="envio")  # Relación bidireccional con Pedido
    
class Pedido(BaseModel):
    __tablename__ = "pedidos"
    
    id = Column(Integer, primary_key=True, index=True)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=now)
    total: Mapped[float] = mapped_column(Float)
    estado: Mapped[EstadoPedido] = mapped_column(SQLAlchemyEnum(EstadoPedido), default=EstadoPedido.PENDIENTE)
    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)  # Clave foránea a Usuario
    usuario = relationship("Usuario", back_populates="pedido")  # Relación bidireccional
    
    envio = relationship("Envio", back_populates="pedido" )
    pago = relationship("Pago", back_populates="pedido" )
    pedidoDetalle = relationship("PedidoDetalle", back_populates="pedido")
    
class PedidoDetalle(BaseModel): 
    __tablename__ = "pedidodetalles"
        
    id = Column(Integer, primary_key=True, index=True)
    cantidad: Mapped[int] = mapped_column(Integer)
    subtotal: Mapped[float] = mapped_column(Float)
    precio_unitario: Mapped[float] = mapped_column(Float)
    
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)  # Clave foránea a Usuario
    pedido = relationship("Pedido", back_populates="pedidoDetalle")  # Relación bidireccional
  
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)  # Clave foránea a Usuario
    producto = relationship("Producto", back_populates="pedidoDetalle")  # Relación bidireccional


class Pago(BaseModel):
    __tablename__ = "pagos"

    id = Column(Integer, primary_key=True, index=True)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=now)
    monto: Mapped[float] = mapped_column(Float)
    estado: Mapped[EstadoPago] = mapped_column(SQLAlchemyEnum(EstadoPago), default=EstadoPago.PENDIENTE)

    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    pedido = relationship("Pedido", back_populates="pago")

    metodoPago_id = Column(Integer, ForeignKey("metodospagos.id"), nullable=False)
    metodoPago = relationship("MetodoPago", back_populates="pago")
    

class MetodoPago(BaseModel):
    __tablename__ = "metodospagos"

    id = Column(Integer, primary_key=True, index=True)
    tipo: Mapped[MetodoPagoEnum] = mapped_column(SQLAlchemyEnum(MetodoPagoEnum), default=MetodoPagoEnum.TARJETA)
    nombre: Mapped[str] = mapped_column(String, index=True)
    imagen: Mapped[str] = mapped_column(String, index=True)

    pago = relationship("Pago", back_populates="metodoPago")
    descuentos = relationship("Descuento", back_populates="metodo_pago") 
    
class Actividad(BaseModel):
    __tablename__ = "actividades"

    id = Column(Integer, primary_key=True, index=True)
    tipo_evento: Mapped[TipoActividad] = mapped_column(SQLAlchemyEnum(TipoActividad), index=True)
    descripcion: Mapped[str] = mapped_column(String, nullable=False)
    referencia_id: Mapped[Optional[int]] = mapped_column(Integer, index=True)  
    fecha: Mapped[datetime] = mapped_column(DateTime, default=now)

    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    usuario = relationship("Usuario", back_populates="actividades")


class Descuento(BaseModel):
    __tablename__ = "descuentos"

    id = Column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, nullable=False) 
    descripcion: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    tipo: Mapped[TipoDescuento] = mapped_column(SQLAlchemyEnum(TipoDescuento), default=TipoDescuento.PORCENTAJE)
    valor: Mapped[float] = mapped_column(Float, nullable=False)
    fecha_inicio: Mapped[datetime] = mapped_column(DateTime, default=now)
    fecha_fin: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    condiciones: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True) 

    # Relaciones
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=True)
    productos = relationship(
        "Producto",
        foreign_keys="[Producto.descuento_id]",
        back_populates="descuento"
    )
    metodo_pago_id = Column(Integer, ForeignKey("metodospagos.id"), nullable=True)
    metodo_pago = relationship("MetodoPago", back_populates="descuentos")

# En modelos.py
class Comentario(BaseModel):
    __tablename__ = "comentarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(500))
    calificacion: Mapped[int] = mapped_column(Integer)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=now)
    
    # Relaciones
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    usuario = relationship("Usuario", back_populates="comentarios")
    
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    producto = relationship("Producto", back_populates="comentarios")  # Usamos back_populates