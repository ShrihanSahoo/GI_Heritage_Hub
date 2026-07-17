# GI Heritage Hub: Master Project Blueprint

## 1. Core Identity
A verified marketplace for authentic Indian handcrafted goods protected by Geographical Indication (GI) tags.

## 2. Architectural Pillars

### A. The Data Strategy (Hybrid Merge)
Ensures a "Full Marketplace" feel even before a single artisan signs up.
- Mocks from `lib/data.ts` provide the baseline.
- Live Firestore docs overwrite mocks if IDs match.

### B. The Translation Strategy (Polymorphism)
- Hook: `useTranslation.ts`.
- Supports 10+ Indian languages + global favorites.

### C. The Firebase Guardrail System
- `useMemoFirebase`: Prevents infinite render loops.
- `FirestorePermissionError`: Mimics security rules for rapid debugging.

### D. The AI Strategy (Genkit Orchestration)
- `artisan-chat-flow`: Injects the maker's full catalog into the prompt (RAG).
- `automatic-translation`: One-click chat bridge.

## 3. Route Sitemap
- `/` - Home
- `/products` - Global Marketplace
- `/products/[slug]` - Detail View
- `/products/new` - Listing Wizard
- `/artisans` - Maker Directory
- `/artisans/apply` - Onboarding
- `/chat` - Translation Hub
- `/cart` - Persistent Cart
- `/account` - Dashboard