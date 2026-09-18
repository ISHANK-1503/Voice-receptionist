from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
from fastapi.responses import JSONResponse
import os
from database import get_connection
from models import Appointment, Client
import CRUD

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8443",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/appointments")
def list_appointments():
    return CRUD.get_appointments_with_clients()


@app.post("/clients")
def add_client(client: Client):
    return CRUD.create_client(client)


@app.post("/appointments")
def add_appointment(appt: Appointment):
    return CRUD.create_appointment(appt)


@app.get("/clients")
def list_clients():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Clients")

    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return result

@app.post("/voice/upload")
async def upload_voice(file: UploadFile = File(...)):

    os.makedirs("recordings", exist_ok=True)

    save_path = os.path.join("recordings", file.filename)

    with open(save_path, "wb") as buffer:
        buffer.write(await file.read())

    return JSONResponse({
        "message": "Audio uploaded successfully",
        "filename": file.filename,
        "path": save_path,
    })