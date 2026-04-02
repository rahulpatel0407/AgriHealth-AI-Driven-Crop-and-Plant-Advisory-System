# API Documentation (Draft)

Base URL: http://localhost:8000

## Auth
- POST /api/auth/request-otp
- POST /api/auth/verify-otp

## Inference
- POST /api/upload-image
- POST /api/infer/frame
- POST /api/infer/gradcam
- POST /api/save-result
- WS /ws/live-scan

## Crop recommendation
- POST /api/recommend-crop

## Feedback
- POST /api/feedback

## Chat advisor
- POST /api/chat/advice
- POST /api/chat/feedback

## Expert review
- POST /api/expert/request

OpenAPI UI available at /docs.
