from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import ExpertRequest
from ..schemas import ExpertRequestCreate

router = APIRouter(prefix="/api/expert", tags=["expert"])


@router.post("/request")
def create_expert_request(payload: ExpertRequestCreate, db: Session = Depends(get_db)):
    record = ExpertRequest(
        result_id=payload.result_id,
        user_id=payload.user_id,
        question=payload.question,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"id": record.id, "status": record.status}
