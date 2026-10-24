# AgriHealth AI — Crop and Plant Advisory

AgriHealth AI is an agritech project by Tej Pratap and collaborators, intended to bring crop-health support and farmer-focused advisory tools into one interface.

## Problem and intended users

Crop-health decisions can be difficult when a farmer must consult several sources for disease information, weather conditions, soil/crop suggestions, fertilizer guidance, and public-scheme information. AgriHealth AI explores how computer vision and an integrated advisory interface could make these tasks easier to navigate.

## Planned and demonstrated capabilities

- Crop-disease and plant-health assistance.
- Weather alerts and context for crop decisions.
- Soil and crop recommendations.
- Fertilizer advisory information.
- Government-scheme discovery.
- AI-powered farmer assistant.
- A farmer-facing dashboard.

Availability and reliability of each feature depend on the implementation and data connected to the running version. The project is an assistance tool, not a replacement for local agricultural experts or official scheme eligibility decisions.

## Technical directions

The project has explored or planned the following areas:

- **Computer vision:** YOLO/CNN-based approaches for crop and plant disease assistance.
- **Web interface:** React-based dashboard and advisory workflows.
- **Geospatial display:** Leaflet/Folium-style maps where location context is useful.
- **IoT prototypes:** ESP32 with temperature/humidity and soil-moisture sensing; pH/NPK sensing and MQTT are part of the wider hardware exploration where supported by available sensors.
- **AI assistance:** structured advisory flows and experimentation with language-model-based assistance.

This list describes project directions, not a claim that every component is currently integrated into a single production release.

## Recognition

AgriHealth AI received first prize at IBM Hackathon 2026 and was presented at AI Summit Bihar 2026. Supporting event details should be checked against the relevant certificate or event record.

## Repository status

**Documentation status (24 October 2026):** This repository currently contains this project overview. The complete application source code, datasets, trained model weights, and deployment configuration are not included here yet. This README therefore documents the project; it should not be taken as a source-code release or as evidence of independently validated model performance.

When code or data are published, add clear setup instructions, dataset licenses, model versions, test procedures, and measured evaluation results (including the data split, metrics, and hardware used).

## Links

- Portfolio: https://tech-with-tej.onrender.com/
- Research and technical project summaries: https://tech-with-tej.onrender.com/research.html
- LinkedIn: https://www.linkedin.com/in/tej-pratap-203418395
- GitHub profile: https://github.com/rahulpatel0407

## Responsible use

Disease classification and advisory outputs can be wrong or incomplete. Farmers should confirm high-impact crop, pesticide, fertilizer, and eligibility decisions with qualified local agriculture professionals and official sources.
