from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from ..models_inference import run_inference
from ..schemas import ImageInferenceResponse

router = APIRouter(prefix="/api", tags=["inference"])


@router.post("/upload-image", response_model=ImageInferenceResponse)
async def upload_image(
    image: UploadFile = File(...),
    consent: bool = Form(...),
):
    if not consent:
        raise HTTPException(status_code=400, detail="Consent is required to upload images")

    image_bytes = await image.read()
    result = run_inference(image_bytes)

    if result["confidence"] < 0.6:
        result["disease"] = "uncertain"

    return ImageInferenceResponse(
        disease=result["disease"],
        confidence=result["confidence"],
        treatment_suggestion=result["treatment_suggestion"],
        gradcam_url=result["gradcam_url"],
        top_candidates=result.get("top_candidates"),
    )
