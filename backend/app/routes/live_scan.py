import base64
import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse

from ..schemas import (
    GradcamRequest,
    GradcamResponse,
    LiveFrameRequest,
    LiveFrameResponse,
    SaveResultRequest,
)
from ..models_inference import predict_image_bytes

router = APIRouter(tags=["live-scan"])


def _decode_b64(data: str) -> bytes:
    if "," in data:
        _, data = data.split(",", 1)
    return base64.b64decode(data)


@router.post("/api/infer/frame", response_model=LiveFrameResponse)
def infer_frame(payload: LiveFrameRequest):
    try:
        image_bytes = _decode_b64(payload.jpeg_b64)
    except Exception:
        return JSONResponse(status_code=400, content={"error": "invalid frame"})
    result = predict_image_bytes(image_bytes, top_k=3, do_gradcam=False)
    return LiveFrameResponse(
        id=str(uuid.uuid4()),
        candidates=result["candidates"],
        model_version="mvp-0.1",
    )


@router.post("/api/infer/gradcam", response_model=GradcamResponse)
def infer_gradcam(payload: GradcamRequest):
    if not payload.image_b64:
        return GradcamResponse(gradcam_url="")
    image_bytes = _decode_b64(payload.image_b64)
    result = predict_image_bytes(image_bytes, top_k=1, do_gradcam=True)
    return GradcamResponse(gradcam_url=result.get("gradcam_url") or "")


@router.post("/api/save-result")
def save_result(payload: SaveResultRequest):
    return {"status": "saved"}


@router.websocket("/ws/live-scan")
async def live_scan_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            message = await websocket.receive_json()
            if message.get("type") != "frame":
                await websocket.send_json({"type": "error", "message": "unsupported"})
                continue
            frame_b64 = message.get("jpeg_b64")
            if not frame_b64:
                await websocket.send_json({"type": "error", "message": "no frame"})
                continue
            try:
                image_bytes = _decode_b64(frame_b64)
                result = predict_image_bytes(image_bytes, top_k=3, do_gradcam=False)
                await websocket.send_json(
                    {
                        "type": "inference",
                        "frame_id": message.get("frame_id"),
                        "candidates": result["candidates"],
                        "gradcam_url": None,
                        "model_version": "mvp-0.1",
                    }
                )
            except Exception:
                await websocket.send_json({"type": "error", "message": "inference failed"})
    except WebSocketDisconnect:
        return
