import base64
from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_infer_frame():
    payload = {"jpeg_b64": base64.b64encode(b"fakebytes").decode("utf-8")}
    response = client.post("/api/infer/frame", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "candidates" in body
    assert isinstance(body["candidates"], list)


def test_live_scan_ws():
    with client.websocket_connect("/ws/live-scan") as websocket:
        websocket.send_json({"type": "frame", "frame_id": "1", "jpeg_b64": "AA=="})
        data = websocket.receive_json()
        assert data["type"] == "inference"
        assert "candidates" in data
