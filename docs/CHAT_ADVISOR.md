# Chat Advisor

## Overview
Ask for Solution blends disease inference with curated knowledge base and LLM synthesis.

## API
- POST /api/chat/advice
- POST /api/chat/feedback

## Behavior
- Returns 2-4 actionable steps and a safety note.
- Provides citations when possible.
- Escalates to expert review when confidence is low or user requests it.
