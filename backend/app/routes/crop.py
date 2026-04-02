from fastapi import APIRouter

from ..schemas import CropRecommendRequest, CropRecommendResponse

router = APIRouter(prefix="/api", tags=["crop"])


@router.post("/recommend-crop", response_model=CropRecommendResponse)
def recommend_crop(payload: CropRecommendRequest):
    # Placeholder logic
    return CropRecommendResponse(
        crop="Rice",
        score=0.78,
        explanation="Based on NPK levels, rainfall, and humidity, rice is a strong fit.",
    )
