from pydantic import BaseModel, EmailStr
from typing import Literal, Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserCreateAdmin(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["user", "owner", "admin"] = "owner"

class UserUpdateAdmin(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[Literal["user", "owner", "admin"]] = None
    is_active: Optional[bool] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True