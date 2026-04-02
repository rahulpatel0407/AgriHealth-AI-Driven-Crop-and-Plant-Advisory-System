# Product Blueprint

## Executive summary
Build a farmer-first crop and plant advisory app that (1) identifies pests and diseases from photos, (2) provides treatment and fertilizer advice, (3) recommends crops based on soil and weather, and (4) offers regional outbreak alerts, packaged with a simple farmer-friendly UX and a lightweight advisor dashboard.

## Product overview
### Primary users
- Smallholder and commercial farmers
- Agri-advisors and extension workers
- Agronomists (power users)
- Buyers/aggregators (optional)

### Value propositions
- Fast, photo-based diagnosis with actionable treatment.
- Localized advisory using weather, soil, and regional alerts.
- Simple, low-literacy friendly UI with icons and voice.
- Offline-first scanning with sync when connectivity returns.

## Core features
### MVP features
1. Camera and image upload with instant diagnosis
2. Treatment and fertilizer recommendations (chemical + organic options)
3. Soil and crop recommendations (N/P/K, pH, weather)
4. Weather integration and irrigation suggestions
5. Regional alerts and mapping
6. Offline support and background sync
7. Multilingual support (English + Hindi)

### Post-MVP features
- Market price forecasting
- Input marketplace (ethically vetted)
- Drone or satellite summaries (NDVI)
- Explainable AI overlays
- Expert escalation workflow

## Plantix-inspired features
### Image-based disease detection
Farmers upload or capture a leaf image. The model returns likely diseases with confidence.

### Treatment recommendations
- Chemical treatment
- Organic treatment
- Prevention methods

### Pest and disease alerts
Regional outbreak monitoring using aggregated reports and model detections.

### Multilingual support
Languages planned:
- English
- Hindi
- Bengali
- Telugu
- Marathi

### Farmer community support
Farmers can share crop issues and receive advice from experts and peers.

## Key features and user flows
Existing apps in this category turn a smartphone into a crop doctor by letting users photograph a sick plant and receive a fast diagnosis with treatment guidance. AgriHealth AI follows the same core interaction model while adding advisory, alerts, and recommendation layers.

### Primary diagnosis flow
1. User selects a crop or enters the scan flow directly.
2. User captures a photo or uploads an image from the gallery.
3. The system validates image quality and sends the image for inference.
4. The model returns likely diseases with confidence scores.
5. The app displays the result card with symptoms, treatments, and next actions.
6. If confidence is low, the user can ask the advisory assistant or request expert review.

### Supporting capabilities
- Chemical and biological treatment recommendations
- Nutrient and weather-aware advisory
- Crop-specific knowledge library
- Community or expert support flows
- Pest alerts, calculators, and farm management extensions

## UX elements
- Home screen with a large camera CTA and secondary actions.
- Scan flow: camera overlay -> capture -> quality feedback -> result card.
- Result card: disease name, confidence, short symptoms, treatment, ask expert.
- Dashboard: health score, recent scans, alerts, next actions.
- Notifications: outbreak and weather warnings.
- Accessibility: large tap targets, audio readout, minimal text.

## User interface design
### Home dashboard
Displays:
- Crop health score
- Weather information
- Recent diagnoses
- Pest alerts

### AI crop scanner
A camera-based interface allowing farmers to quickly scan plant leaves.

### Disease result page
Shows:
- Disease name
- Confidence score
- Symptoms
- Recommended treatment

### Typical UX patterns
- Quick scan CTA on the home screen
- Guided capture overlay for better image quality
- Result card with one-tap actions: save, ask, share, retry
- Past diagnoses accessible from a simple history view
- Low-literacy friendly use of icons, voice, and local language labels

## High-level architecture
Clients (Web/Mobile)
  -> API Gateway/CDN
  -> Backend (FastAPI)
     - ML inference service (Torch/TF)
     - Crop recommendation service
     - Notification service (SMS/FCM)
     - Advisory engine
  -> Datastore
     - Postgres (primary data)
     - S3-compatible storage (images)
  -> Third-party APIs
     - Weather (OpenWeather)
     - Maps (Mapbox/Google)
     - SMS (Twilio/MSG91)

### Simple architecture diagram
```
+-----------------------+
|     Mobile App        |
|  (React Native UI)    |
+----------+------------+
           |
           | REST API
           |
+----------v------------+
|     Backend API       |
|   (FastAPI / Node)    |
+----------+------------+
           |
   -------------------------
   |          |            |
   v          v            v
ML Service   Database    External APIs
(CNN model)  (MongoDB)   Weather / Maps
   |
   v
Prediction Engine
   |
   v
Advisory Output
```

## Technical stack and open-source tools
### ML and computer vision
- TensorFlow or PyTorch for model training and inference
- EfficientNet or MobileNet as baseline backbones for disease classification
- TensorFlow Lite or ONNX for mobile or edge deployment
- OpenCV or PlantCV for preprocessing, segmentation, and image cleanup

### Backend and APIs
- FastAPI as the primary backend framework for async model serving and APIs
- Flask or Django REST as alternatives if team needs differ
- Model serving via application runtime, TorchServe, TensorFlow Serving, or ONNX Runtime

### Frontend and clients
- React for web dashboards and PWAs
- React Native or Flutter for mobile apps
- Streamlit or Dash for rapid internal prototypes and demos

### Data and infrastructure
- PostgreSQL or MongoDB for user, diagnosis, and advisory records
- S3-compatible storage for uploaded images and derived artifacts
- Redis for caching, alert fanout, and background jobs
- Docker, GitHub Actions, and cloud infrastructure for deployment and CI/CD

### External services
- OpenWeather for weather forecasting and irrigation hints
- Map services for region-based views and alerts
- Notification providers for push or SMS delivery
- LLM APIs for advisory text generation where appropriate

## Model and ML pipeline
- Data ingestion -> augmentation -> train/val/test split
- Train baseline CNN (EfficientNet/MobileNet)
- Export to TFLite/ONNX for on-device inference
- Evaluate per-class precision/recall and confusion matrix
- Human-in-the-loop for low-confidence cases

### Practical pipeline
1. Image acquisition from camera or gallery
2. Image preprocessing such as resize, color normalization, or segmentation
3. Model inference for disease classification
4. Postprocessing to map disease output to factsheets and remedies
5. Advisory generation using rules, templates, or an LLM-backed assistant
6. Persistence of diagnosis history and user feedback for continuous improvement

## AI models
Possible models used:
- MobileNetV3
- EfficientNet
- ResNet50
- Vision Transformers

## Data flow
1. Farmer captures plant image.
2. Image uploaded to backend server.
3. Image processed by ML model.
4. Disease classification returned.
5. Advisory recommendations generated.
6. Results displayed to the user.

## Data model and AI pipeline
The platform should track core entities such as users, farms, plots, crops, disease classes, uploaded images, diagnosis results, advisory conversations, and feedback records.

### Suggested data entities
- Users and farmer profiles
- Farms and plots with location metadata
- Crop types and disease classes
- Uploaded images with timestamps and device context
- Diagnosis results with confidence, label, and remediation links
- Advisory chats, expert escalations, and feedback

### Storage notes
- Keep image blobs in object storage and store references in the main database
- Retain prediction metadata for auditing and model retraining
- Support multilingual fields for crop names, disease descriptions, and advisory text

## Data sources
- PlantVillage dataset (baseline)
- Field-collected labeled images (pilot)
- Weather data via OpenWeather

## Security and privacy
- Explicit consent for photo and location usage
- Encryption at rest and in transit
- Role-based access control for admin tools
- Clear opt-in/out for data sharing

## Roadmap (stage-based)
Stage 0: Discovery and validation (personas, KPIs, competitive analysis)
Stage 1: Prototype and architecture (POC model, stack decisions)
Stage 2: UI/UX design (Figma, accessibility, localization)
Stage 3: MVP development (scan, results, inference, offline sync)
Stage 4: Testing and field validation (pilot feedback)
Stage 5: Production hardening (monitoring, CI/CD, backups)
Stage 6: Continuous improvement (retraining and A/B tests)

## Milestones
- Milestone 1: MVP with photo upload, basic CNN prediction, core UI, and baseline data schema
- Milestone 2: More disease classes, treatment guidance, and local language support
- Milestone 3: Community Q&A, alerts, calculators, and richer advisory tools
- Milestone 4: Pilot deployment with real users and iterative refinement

## Testing strategy
- Unit tests for endpoints and utilities
- Integration tests for image upload -> inference flow
- E2E tests for core user journeys
- Model regression tests after each model update

### Additional validation goals
- Hold-out accuracy and per-class evaluation for disease models
- Inference latency checks for both on-device and server inference paths
- Field validation on real photos captured under varied lighting conditions
- Acceptance tests for alerts, community flows, and multilingual content

## Deployment recommendations
- Use feature flags for experiments
- Canary releases for new model versions
- Monitor model drift and performance
- Backup and disaster recovery for DB and storage

## KPIs
- Top-1 and top-3 accuracy per crop/disease
- DAU/MAU and 7/30 day retention
- Time-to-action after recommendations
- Monthly labeled images collected

## Future enhancements
- Satellite-based crop monitoring
- Drone image analysis
- Yield prediction models
- Market price forecasting
- Voice-based farmer assistant

## Deliverables checklist
- Mobile/web app builds with scan flow
- Backend API + model inference pipeline
- Docs: architecture, privacy, datasets
- CI/CD pipeline and deployment scripts
- Pilot report and model evaluation artifacts
