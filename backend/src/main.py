import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import cloudinary

# Importamos la conexión a la base de datos y los modelos
from src.database import engine, SessionLocal
from src.models import BaseModel
from src.gestion.router import router as gestion_router # Importamos los routers desde nuestros módulos
from src.gestion.services import verificar_y_crear_roles 
from src.pagos.router import router as pagos_router

load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")

# Configuración de Cloudinary utilizando variables de entorno
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    BaseModel.metadata.create_all(bind=engine)  # Crear tablas si no existen
    
    # Verificar y crear roles
    db = SessionLocal()
    verificar_y_crear_roles(db)
    db.close()
    
    yield

app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)

# Asociamos los routers a la app
app.include_router(gestion_router)
app.include_router(pagos_router)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
