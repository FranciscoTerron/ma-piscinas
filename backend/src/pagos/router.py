import os
import mercadopago
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.gestion.models import Usuario, Carrito, CarritoDetalle

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

    # Calcular el total de la compra sumando los subtotales de los productos
    total_compra = sum(detalle.subtotal for detalle in detalles)

    # Obtener el nombre y apellido del usuario (asumiendo que tienes una tabla Usuario)
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Construir un solo ítem para Mercado Pago
    items = [{
        "title": f"Compra de {usuario.nombre} {usuario.apellido}",  # Nombre y apellido del cliente
        "quantity": 1,  # Cantidad 1 (representa una compra)
        "unit_price": float(total_compra),  # Precio total de la compra
        "currency_id": "ARS"
    }]

    preference_data = {
        "items": items,
        "back_urls": {
            "success": "https://youtube.com/",  # URL de éxito
            "failure": "https://youtube.com/",  # URL de fallo
            "pending": "https://youtube.com/"   # URL de pago pendiente
        },
        "auto_return": "approved"  # Redirigir automáticamente al usuario después del pago
    }

    try:
        preference_response = sdk.preference().create(preference_data)
        return {"preference_id": preference_response["response"]["id"]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
