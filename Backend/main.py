from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import api_students
from utils import to_xml

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Create tables from models (if not exists)
models.Base.metadata.create_all(bind=engine)

# Register router to App
app.include_router(api_students.router)

@app.get("/")
def root():
    """Endpoint gốc"""
    data = {
        "message": "Student Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }
    return Response(content=to_xml(data), media_type="application/xml")