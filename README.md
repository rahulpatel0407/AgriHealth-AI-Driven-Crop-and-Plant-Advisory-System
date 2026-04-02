# AgriHealth AI

Farmer-first platform for crop disease detection from leaf images and crop recommendations.

## MVP scope
- Image-based disease detection (upload/camera) with Grad-CAM overlay
- Crop recommendation from soil and weather inputs
- Live Scan mode with auto-capture and low-bandwidth sampling
- Ask for Solution conversational advisor
- Mobile-first web app with i18n stubs (English + Hindi placeholders)
- FastAPI backend, Postgres, and S3-compatible storage (MinIO for local)

## Quick start (local)
1. Copy env template files and adjust values:
   - backend/.env.example -> backend/.env
   - frontend/.env.example -> frontend/.env
2. Run the full stack:
   ```bash
   docker-compose -f infra/docker-compose.yml up --build
   ```
3. Open the app at http://localhost:5173 and API docs at http://localhost:8000/docs

## Repo structure
- frontend/ - React + Vite + Tailwind PWA UI
- backend/ - FastAPI API server
- ml/ - training scripts, notebooks, and model artifacts
- infra/ - docker-compose and container configs
- docs/ - architecture, data sources, privacy
- tests/ - backend tests

## Security & privacy
- Explicit consent required before image upload
- Phone numbers are encrypted at rest
- Raw images are not written to logs

## Demo
See demo/README.md for local demo steps.

## Documentation
- Product Blueprint: docs/PRODUCT_BLUEPRINT.md
- System Architecture: docs/SYSTEM_ARCHITECTURE.md
- UI Design: docs/UI_DESIGN.md
- API Documentation: docs/API_DOCUMENTATION.md
- Dataset Guide: docs/DATASET_GUIDE.md
- Future Work: docs/FUTURE_WORK.md

## License
See docs/DATA_SOURCES.md for dataset licensing details.
