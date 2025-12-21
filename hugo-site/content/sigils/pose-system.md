---
title: "POSE System"
date: 2024-12-01
type: "code"
tech: ["Ghost CMS", "Node.js", "n8n", "LLM APIs"]
status: "research"
---

**P**ublish **O**nce, **S**yndicate **E**verywhere — an automated content distribution pipeline.

## Architecture

```
Ghost CMS (canonical source)
    ↓
Static Site Generator → Website /scroll section
    ↓
Middleware (n8n or Node.js)
    ↓
┌─────────────┬─────────────┬─────────────┐
│  Instagram  │   Mastodon  │   Bluesky   │
└─────────────┴─────────────┴─────────────┘
```

## Key Features

- **Single source of truth** — Write once in Ghost
- **LLM summarization** — Longform → platform-optimized short-form
- **Automated syndication** — Scheduled cross-posting
- **Format adaptation** — Character limits, image requirements per platform

## Research Questions

- n8n vs custom Node.js middleware?
- WordHero AI vs paid API costs?
- Rate limiting and posting schedules?
- Media handling across platforms?
