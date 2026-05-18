from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine

app = FastAPI()

@app.get("/")
def root():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "message": "GlowUp API + MySQL Connected"
        }

    except Exception as e:
        return {
            "error": str(e)
        }