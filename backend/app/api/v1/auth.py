from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    phone_or_email: str
    otp: Optional[str] = "123456"


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    """Logs in farmer and returns session token."""
    return AuthResponse(
        access_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.agribridgezero.mocktoken",
        user={
            "id": "farmer-rajesh",
            "name": "Rajesh Patel",
            "phone": payload.phone_or_email,
            "village": "Hoskote, Bengaluru Rural",
            "verified": True,
        },
    )


@router.get("/me")
def get_current_user():
    return {
        "id": "farmer-rajesh",
        "name": "Rajesh Patel",
        "phone": "+91 98450 12345",
        "village": "Hoskote, Bengaluru Rural",
        "verified": True,
    }
