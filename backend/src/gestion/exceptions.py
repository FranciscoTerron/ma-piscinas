from typing import Dict, Any, List, Union
from src.gestion.constants import ErrorCode
from src.exceptions import NotFound, BadRequest, PermissionDenied

class UsuarioNoEncontrado(NotFound):
    DETAIL = ErrorCode.USUARIO_NO_ENCONTRADO

class UsuarioYaRegistrado(BadRequest):
    DETAIL = ErrorCode.USUARIO_YA_REGISTRADO

class EmailYaRegistrado(BadRequest):
    DETAIL = ErrorCode.EMAIL_YA_REGISTRADO

class EmailNoRegistrado(NotFound):
    DETAIL = ErrorCode.EMAIL_NO_REGISTRADO

class CredencialesIncorrectas(PermissionDenied):
    DETAIL = ErrorCode.CREDENCIALES_INCORRECTAS

class RolNoEncontrado(NotFound):
    DETAIL = ErrorCode.ROL_NO_ENCONTRADO