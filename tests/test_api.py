from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_recommend_crop():
    payload = {
        "N": 90,
        "P": 40,
        "K": 40,
        "temp": 24,
        "humidity": 65,
        "rainfall": 80,
        "ph": 6.8,
        "region": "MH",
    }
    response = client.post("/api/recommend-crop", json=payload)
    assert response.status_code == 200
    assert "crop" in response.json()
