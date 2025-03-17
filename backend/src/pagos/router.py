import os
import mercadopago
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.gestion.models import Carrito, CarritoDetalle, Producto

router = APIRouter()

# Configuración del SDK de Mercado Pago
ACCESS_TOKEN = os.getenv("MERCADOPAGO_ACCESS_TOKEN")
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

    # Construir la lista de productos para Mercado Pago
    items = []
    for detalle in detalles:
        producto = db.query(Producto).filter(Producto.id == detalle.producto_id).first()
        if producto:
            items.append({
                "title": producto.nombre,
                "quantity": detalle.cantidad,
                "unit_price": float(detalle.subtotal),  # Usa el precio del producto
                "currency_id": "ARS"
            })

    preference_data = {
        "items": items,
        "back_urls": {
            "success": "https://tuweb.com/success",
            "failure": "https://tuweb.com/failure",
            "pending": "https://tuweb.com/pending"
        },
        "auto_return": "approved"
    }

    try:
        preference_response = sdk.preference().create(preference_data)
        return {"init_point": preference_response["response"]["init_point"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
