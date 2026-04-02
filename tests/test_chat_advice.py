from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_chat_advice():
    payload = {
        "user_id": "demo-user",
        "question": "How do I treat this?",
        "context": {"language": "en"},
    }
    response = client.post("/api/chat/advice", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "answer" in body
    assert isinstance(body.get("actions"), list)
