# Live Scan

## Overview
Live Scan provides continuous inference using sampled frames. On-device inference is preferred; server WebSocket fallback is available.

## Client behavior
- Sample frame every 800ms (or 1400ms in low-bandwidth mode).
- Auto-capture when confidence > 0.85 across 2 consecutive frames.
- Request Grad-CAM for saved frames only.
- Use WebSocket streaming when server inference is enabled.

## API
- POST /api/infer/frame
- POST /api/infer/gradcam
- POST /api/save-result
- WS /ws/live-scan
