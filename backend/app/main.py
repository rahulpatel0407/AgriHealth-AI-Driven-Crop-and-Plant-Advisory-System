from fastapi import FastAPI
import sentry_sdk

from .config import settings
from .db import Base, engine
from .routes import auth, chat, crop, expert, feedback, inference, live_scan

app = FastAPI(title="AgriHealth AI API", version="0.1.0")

if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn, traces_sample_rate=0.2)

app.include_router(auth.router)
app.include_router(inference.router)
app.include_router(crop.router)
app.include_router(feedback.router)
app.include_router(live_scan.router)
app.include_router(chat.router)
app.include_router(expert.router)


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}
