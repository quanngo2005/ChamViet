# Notebook Index

## Security / Traffic

- [Rate limit surface](rate-limit-surface.md): public backend and AI endpoints that need throttling.

## Service Wiring

- [Docker service wiring](docker-service-wiring.md): backend, MySQL, and root AI voice service container relationships.

## Frontend / Landing

- [Home landing flow](home-landing-flow.md): homepage section order, styling location, copy/images, and CTA routes.
- [Story QA overlay](story-qa-overlay.md): story video QA modal layout, Lenis scroll interaction, and overflow gotchas.
- [Product image loading](product-image-loading.md): product card to detail-page image preload path and gallery loading priorities.

## Product / AI Flows

- [Scanner product to AI QA flow](scanner-product-to-ai-qa-flow.md): end-to-end runtime path from `/scan` through vision recognition, story routing, story-config loading, and voice Q&A.
- [AI-owned voice QA flow](ai-owned-voice-qa-flow.md): voice QA session contract where AI service owns prompts, scoring, feedback, progression, and speech audio.
- [Voice session contract mismatch](voice-session-contract-mismatch.md): current AI voice Docker runtime exposes legacy `story.json` endpoints while Spring/UI call `/api/session/*` with backend story payload.
- [Product domain logic and concepts](product-domain-logic-and-concepts.md): entity relations, business meaning, variant/component composition, inventory flow, and story/AI linkage.
- [Product scan to QA implementation report](product-scan-to-qa-implementation-report.md): implemented backend/frontend/session changes that move scan routing onto the real product domain.
