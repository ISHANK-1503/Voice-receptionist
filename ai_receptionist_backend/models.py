from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Client(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None

class Appointment(BaseModel):
    client_id: int
    appointment_date: datetime
    service: str
    status: Optional[str] = "booked"
