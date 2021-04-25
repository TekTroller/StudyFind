from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str

class RequestCodeData(BaseModel):
    email: str

class VerificationData(BaseModel):
    email: str
    code: int
    password: str