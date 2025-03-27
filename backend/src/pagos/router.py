import os
import mercadopago
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.gestion.models import Usuario, Carrito, CarritoDetalle

router = APIRouter()

# Configuración del SDK de Mercado Pago
ACCESS_TOKEN =os.getenv("MERCADOPAGO_ACCESS_TOKEN")
sdk = mercadopago.SDK(ACCESS_TOKEN)

@router.post("/crear_preferencia/{usuario_id}")
def crear_preferencia(usuario_id: int, db: Session = Depends(get_db)):
    # Obtener el carrito y verificar que existe
    carrito = db.query(Carrito).filter(Carrito.usuario_id == usuario_id).first()
    if not carrito:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")

    # Obtener los productos dentro del carrito
    detalles = db.query(CarritoDetalle).filter(CarritoDetalle.carrito_id == carrito.id).all()

    if not detalles:
        raise HTTPException(status_code=400, detail="El carrito está vacío")

    # Calcular el subtotal de la compra sumando los subtotales de los productos
    total_compra = sum(detalle.subtotal for detalle in detalles)

    # Calcular el costo total de envío.
    # Se asume que CarritoDetalle tiene una relación con el modelo Producto
    total_envio = sum(
        detalle.producto.costo_envio * detalle.cantidad
        for detalle in detalles
        if detalle.producto and detalle.producto.costo_envio is not None
    )
    

    # Sumar el subtotal y el costo de envío para obtener el total final
    total_final = total_compra + total_envio

    # Obtener el usuario para armar el título del ítem
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Construir un único ítem para Mercado Pago con el total final
    items = [{
        "title": f"Compra de {usuario.nombre} {usuario.apellido}",
        "quantity": 1,
        "unit_price": float(total_final),
        "currency_id": "ARS"
    }]

    preference_data = {
        "items": items,
        "back_urls": {
            "success": "http://localhost:5173/GraciasPorSuCompra",
            "failure": "http://localhost:5173/productos",
            "pending": "http://localhost:5173/FormularioEnvio"
        },
        "auto_return": "approved"
    }

    try:
        preference_response = sdk.preference().create(preference_data)
        return {"preference_id": preference_response["response"]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
