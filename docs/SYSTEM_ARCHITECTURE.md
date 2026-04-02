# System Architecture

This document provides the system-level architecture for AgriHealth AI.

## Overview
- Clients: Web (React) and mobile (future React Native)
- Backend: FastAPI API server
- ML: Torch/TF inference services
- Storage: S3-compatible for images and Grad-CAM
- DB: Postgres (prod) or SQLite (local)

## Core components
- Client applications for image capture, diagnosis display, advisory chat, and dashboard access
- API layer for authentication, uploads, diagnosis, crop recommendation, and notifications
- ML inference layer for disease classification and supporting explainability outputs
- Advisory engine for treatment generation, KB retrieval, and expert escalation
- Data layer for user accounts, diagnosis history, alerts, and feedback
- Integration layer for weather, map, notification, and optional LLM services

## Integration model
- Client uploads an image or sampled frame to the backend
- Backend invokes the ML service and gets disease predictions
- Backend enriches the response with treatment facts, advisories, and metadata
- Optional integrations add weather context, maps, alerts, and region-based outbreak signals
- Results are persisted for history, analytics, and active learning

## Deployment notes
- Start with a single API service and colocated inference runtime
- Move heavy inference to a dedicated service when traffic or model size grows
- Use object storage for image artifacts and a managed relational database for core records
- Add Redis or a queue when Grad-CAM generation and notifications become asynchronous

## Diagram
See docs/ARCHITECTURE.md for the current diagram and component map.
