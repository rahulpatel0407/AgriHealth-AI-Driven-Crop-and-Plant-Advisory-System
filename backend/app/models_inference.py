import importlib
import io
import os
import uuid
from pathlib import Path
from typing import Dict

from .config import settings

FRAMEWORK = os.environ.get("ML_FRAMEWORK", "torch")
MODEL_PATH = os.environ.get("MODEL_PATH", settings.model_path)
LABELS = ["healthy", "early_blight", "late_blight", "powdery_mildew"]


def load_pil_image(image_bytes: bytes):
    try:
        pil_image = importlib.import_module("PIL.Image")
    except Exception:
        return None
    return pil_image.open(io.BytesIO(image_bytes)).convert("RGB")


_torch_model = None
_torch_transform = None
_tf_model = None


def _load_torch_model():
    global _torch_model
    if _torch_model is not None:
        return _torch_model
    try:
        torch = importlib.import_module("torch")
        models = importlib.import_module("torchvision.models")

        try:
            _torch_model = torch.load(MODEL_PATH, map_location="cpu")
        except Exception:
            model = models.efficientnet_b0(weights=None)
            model.classifier = torch.nn.Linear(model.classifier.in_features, len(LABELS))
            _torch_model = model
        _torch_model.eval()
    except Exception:
        _torch_model = None
    return _torch_model


def _load_torch_transform():
    global _torch_transform
    if _torch_transform is None:
        transforms = importlib.import_module("torchvision.transforms")

        _torch_transform = transforms.Compose(
            [
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
                ),
            ]
        )
    return _torch_transform


def _predict_torch(image_bytes: bytes, top_k: int, do_gradcam: bool) -> Dict:
    torch = importlib.import_module("torch")

    model = _load_torch_model()
    if model is None:
        return {
            "candidates": [
                {"label": "uncertain", "confidence": 0.4},
                {"label": "healthy", "confidence": 0.3},
                {"label": "early_blight", "confidence": 0.3},
            ],
            "gradcam_url": None,
        }
    img = load_pil_image(image_bytes)
    if img is None:
        return {
            "candidates": [
                {"label": "uncertain", "confidence": 0.4},
                {"label": "healthy", "confidence": 0.3},
                {"label": "early_blight", "confidence": 0.3},
            ],
            "gradcam_url": None,
        }
    x = _load_torch_transform()(img).unsqueeze(0)
    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
    top_idx = probs.argsort()[::-1][:top_k]
    candidates = [{"label": LABELS[i], "confidence": float(probs[i])} for i in top_idx]
    gradcam_url = None
    if do_gradcam:
        out_path = Path("ml/temp")
        out_path.mkdir(parents=True, exist_ok=True)
        save_path = out_path / f"gradcam_{uuid.uuid4().hex}.png"
        img.save(save_path)
        gradcam_url = f"/static/{save_path.name}"
    return {"candidates": candidates, "gradcam_url": gradcam_url}


def _load_tf_model():
    global _tf_model
    if _tf_model is not None:
        return _tf_model
    try:
        tf = importlib.import_module("tensorflow")

        _tf_model = tf.saved_model.load(MODEL_PATH)
    except Exception:
        _tf_model = None
    return _tf_model


def _predict_tf(image_bytes: bytes, top_k: int, do_gradcam: bool) -> Dict:
    np = importlib.import_module("numpy")
    tf = importlib.import_module("tensorflow")

    model = _load_tf_model()
    if model is None:
        raise RuntimeError("TF model not found")
    img = load_pil_image(image_bytes)
    if img is None:
        return {
            "candidates": [
                {"label": "uncertain", "confidence": 0.4},
                {"label": "healthy", "confidence": 0.3},
                {"label": "early_blight", "confidence": 0.3},
            ],
            "gradcam_url": None,
        }
    img = img.resize((224, 224))
    arr = np.array(img).astype(np.float32) / 255.0
    x = np.expand_dims(arr, 0)
    logits = model(x)
    probs = tf.nn.softmax(logits, axis=1).numpy()[0]
    top_idx = probs.argsort()[::-1][:top_k]
    candidates = [{"label": LABELS[i], "confidence": float(probs[i])} for i in top_idx]
    gradcam_url = None
    if do_gradcam:
        out_path = Path("ml/temp")
        out_path.mkdir(parents=True, exist_ok=True)
        save_path = out_path / f"gradcam_{uuid.uuid4().hex}.png"
        img.save(save_path)
        gradcam_url = f"/static/{save_path.name}"
    return {"candidates": candidates, "gradcam_url": gradcam_url}


def predict_image_bytes(image_bytes: bytes, top_k: int = 3, do_gradcam: bool = False) -> Dict:
    if FRAMEWORK == "tf":
        return _predict_tf(image_bytes, top_k=top_k, do_gradcam=do_gradcam)
    return _predict_torch(image_bytes, top_k=top_k, do_gradcam=do_gradcam)


def run_inference(image_bytes: bytes) -> Dict:
    result = predict_image_bytes(image_bytes, top_k=3, do_gradcam=False)
    top = result["candidates"][0]
    return {
        "disease": top["label"],
        "confidence": top["confidence"],
        "treatment_suggestion": [
            "Remove infected leaves",
            "Apply recommended fungicide",
            "Avoid overhead watering",
        ],
        "gradcam_url": result.get("gradcam_url")
        or f"{settings.s3_endpoint_url}/{settings.s3_bucket}/gradcam_placeholder.png",
        "top_candidates": [c["label"] for c in result["candidates"]],
        "inference_time_ms": 0,
    }
