from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_upload_image_requires_consent():
    files = {"image": ("leaf.jpg", b"fakebytes", "image/jpeg")}
    response = client.post("/api/upload-image", files=files, data={"consent": "false"})
    assert response.status_code == 400
