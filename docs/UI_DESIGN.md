# UI Design

This document describes the UI structure, key screens, and design intent.

## Core screens
- Home dashboard (health score, weather, alerts)
- AI crop scanner (live scan + upload)
- Result page (disease, confidence, treatments)
- Advisory chat (Ask for Solution)

## Primary user flows
### Scan to diagnosis
1. User opens the scanner.
2. User captures or uploads an image.
3. App shows processing state and quality feedback.
4. Result page displays diagnosis, confidence, symptoms, and treatment.

### Ask for solution
1. User opens advisory from a result.
2. Assistant uses diagnosis context plus knowledge base content.
3. User receives short, actionable steps and can escalate if needed.

### Dashboard monitoring
1. User checks current farm health score.
2. User sees recent diagnoses, weather, and pest alerts.
3. User takes action from prominent quick-action cards.

## UX principles
- Mobile-first, large touch targets
- High contrast, readable typography
- Clear primary CTA per screen
- Local language support

## Content strategy
- Prioritize icons and short phrases over long paragraphs
- Use confidence indicators and color states carefully
- Surface one primary next step per result screen
- Support multilingual labels and audio readout for accessibility
