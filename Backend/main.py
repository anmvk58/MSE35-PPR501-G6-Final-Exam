from fastapi import FastAPI
import models
from database import engine

from routers import auth, api_students

app = FastAPI()

# Create tables from models (if not exists)
models.Base.metadata.create_all(bind=engine)

# Register router to App
app.include_router(auth.router)
app.include_router(api_students.router)