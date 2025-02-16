from datetime import datetime
import pytz

# Definir la zona horaria de Argentina
ARGENTINA_TIMEZONE = pytz.timezone('America/Argentina/Buenos_Aires')

def now() -> datetime:
    """Obtiene la fecha y hora actual en la zona horaria de Argentina."""
    return datetime.now(ARGENTINA_TIMEZONE)

def from_utc_to_arg_time(utc_time: datetime) -> datetime:
    """Convierte una fecha y hora UTC a la zona horaria de Argentina."""
    if utc_time.tzinfo is None:
        utc_time = pytz.utc.localize(utc_time)  # Asignar UTC si no tiene tzinfo
    return utc_time.astimezone(ARGENTINA_TIMEZONE)

def to_utc(arg_time: datetime) -> datetime:
    """Convierte una fecha y hora de Argentina a UTC."""
    if arg_time.tzinfo is None:
        arg_time = ARGENTINA_TIMEZONE.localize(arg_time)  # Asignar Argentina si no tiene tzinfo
    else:
        arg_time = arg_time.astimezone(ARGENTINA_TIMEZONE)  # Asegurar que esté en ARG antes de convertir
    return arg_time.astimezone(pytz.utc)
