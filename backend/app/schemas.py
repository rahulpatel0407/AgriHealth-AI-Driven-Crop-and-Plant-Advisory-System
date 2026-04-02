from pydantic import BaseModel, Field
from typing import List, Optional


class OtpRequest(BaseModel):
    phone: str = Field(min_length=8, max_length=20)


class OtpVerify(BaseModel):
    phone: str = Field(min_length=8, max_length=20)
    otp: str = Field(min_length=4, max_length=8)


class CropRecommendRequest(BaseModel):
    N: float
    P: float
    K: float
    temp: float
    humidity: float
    rainfall: float
    ph: float
    region: Optional[str] = None


class CropRecommendResponse(BaseModel):
    crop: str
    score: float
    explanation: str


class ImageInferenceResponse(BaseModel):
    disease: str
    confidence: float
    treatment_suggestion: List[str]
    gradcam_url: str
    top_candidates: Optional[List[str]] = None


class FeedbackRequest(BaseModel):
    image_id: str
    correct_label: str


class Candidate(BaseModel):
    label: str
    confidence: float


class LiveFrameRequest(BaseModel):
    jpeg_b64: str


class LiveFrameResponse(BaseModel):
    id: str
    candidates: List[Candidate]
    model_version: str


class GradcamRequest(BaseModel):
    image_id: Optional[str] = None
    image_b64: Optional[str] = None


class GradcamResponse(BaseModel):
    gradcam_url: str


class SaveResultRequest(BaseModel):
    image_id: str
    user_id: Optional[str] = None
    label: str
    confidence: float
    location: Optional[str] = None
    note: Optional[str] = None


class ChatAdviceRequest(BaseModel):
    user_id: str
    question: str
    image_id: Optional[str] = None
    context: Optional[dict] = None


class ChatAdviceResponse(BaseModel):
    answer: str
    actions: List[str]
    confidence: float
    citations: List[str]
    escalate: Optional[bool] = False


class ChatFeedbackRequest(BaseModel):
    chat_id: Optional[str] = None
    rating: str


class ExpertRequestCreate(BaseModel):
    result_id: Optional[int] = None
    user_id: Optional[int] = None
    question: str
