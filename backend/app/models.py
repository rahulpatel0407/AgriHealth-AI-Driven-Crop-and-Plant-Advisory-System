from sqlalchemy import Column, DateTime, Float, Integer, JSON, String, Text
from sqlalchemy.sql import func

from .db import Base


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    image_path = Column(String, nullable=True)
    predicted_label = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    meta_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ExpertRequest(Base):
    __tablename__ = "expert_requests"

    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(Integer, nullable=True)
    user_id = Column(Integer, nullable=True)
    question = Column(Text, nullable=True)
    status = Column(String, default="pending")
    assigned_to = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    id = Column(Integer, primary_key=True, index=True)
    phone_encrypted = Column(String, nullable=False)
    otp_token = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
