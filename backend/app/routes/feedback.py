from fastapi import APIRouter

from ..schemas import FeedbackRequest

router = APIRouter(prefix="/api", tags=["feedback"])


@router.post("/feedback")
def submit_feedback(payload: FeedbackRequest):
    # TODO: write to feedback table
    return {"status": "received"}
