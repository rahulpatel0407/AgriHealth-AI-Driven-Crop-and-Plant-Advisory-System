from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import AuthSession
from ..schemas import OtpRequest, OtpVerify
from ..utils.crypto import encrypt_phone

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/request-otp")
def request_otp(payload: OtpRequest, db: Session = Depends(get_db)):
    # Mock OTP flow
    encrypted_phone = encrypt_phone(payload.phone)
    record = AuthSession(phone_encrypted=encrypted_phone, otp_token="mock-otp-token")
    db.add(record)
    db.commit()
    return {"otp_token": "mock-otp-token"}


@router.post("/verify-otp")
def verify_otp(payload: OtpVerify):
    # Mock verification
    return {"token": "mock-jwt-token"}
