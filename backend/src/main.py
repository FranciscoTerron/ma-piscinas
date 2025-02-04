import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from src.database import engine
from src.models import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# importamos los routers desde nuestros modulos
from src.gestion.router import router as gestion_router

load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")


@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    BaseModel.metadata.create_all(bind=engine)
    yield


app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)

# asociamos los routers a nuestra app
app.include_router(gestion_router)

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