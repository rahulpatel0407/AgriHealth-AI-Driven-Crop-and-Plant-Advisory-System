from fastapi import APIRouter

from ..schemas import ChatAdviceRequest, ChatAdviceResponse, ChatFeedbackRequest

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/advice", response_model=ChatAdviceResponse)
def chat_advice(payload: ChatAdviceRequest):
    lower_q = payload.question.lower()
    actions = [
        "Remove infected leaves",
        "Apply recommended fungicide at label dose",
        "Avoid overhead irrigation",
    ]
    answer = "Here is a simple plan based on your crop condition. Safety: wear gloves when handling infected leaves."
    confidence = 0.72
    escalate = False
    if "organic" in lower_q:
        actions = [
            "Use neem oil spray",
            "Remove infected leaves",
            "Improve airflow between plants",
        ]
    if "expert" in lower_q or "escalate" in lower_q:
        escalate = True
        confidence = 0.48
        answer = "Confidence is low. I recommend requesting an expert review for accurate guidance."
    return ChatAdviceResponse(
        answer=answer,
        actions=actions,
        confidence=confidence,
        citations=["docs/agri_kb/early_blight.md"],
        escalate=escalate,
    )


@router.post("/feedback")
def chat_feedback(payload: ChatFeedbackRequest):
    return {"status": "received"}
