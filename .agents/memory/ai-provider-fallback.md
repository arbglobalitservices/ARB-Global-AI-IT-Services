---
name: AI provider fallback
description: Managed OpenAI provisioning and direct-key behavior for this workspace
---

The managed Replit OpenAI integration may require an account upgrade. When that path is unavailable, the assistant can use a user-owned `OPENAI_API_KEY`, but the provider account must have API credits; an exhausted balance is a runtime limitation, not a code/configuration failure.

**Why:** An eager AI client import can otherwise prevent the API server from starting, taking unrelated payment and health endpoints down with it.

**How to apply:** Preserve the direct-key fallback and return a user-friendly streamed error when the provider is unavailable. Never expose key values or provider error details in the browser.