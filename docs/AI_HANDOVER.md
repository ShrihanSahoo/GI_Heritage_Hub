# 🤖 AI-to-AI Technical Handover Brief

This document is optimized for LLM ingestion. It describes the state and "invisible" logic of the **GI Heritage Hub**.

## 1. Context Injection
This project is a high-fidelity prototype of a verified marketplace for Indian GI-tagged crafts. It uses **Next.js 15**, **Firebase**, and **Genkit**.

## 2. Core Logic Patterns (Non-Negotiable)

### A. The Hybrid Merge Engine
*   **Problem:** Empty marketplace on first load.
*   **Solution:** Components (Products, Artisans) use a `Map<string, T>` strategy. They load static mocks from `src/lib/data.ts` first, then overwrite them with live Firestore records if IDs match.
*   **AI instruction:** Maintain this pattern to ensure the "Demo Mode" always looks full.

### B. Shadow Profile Detection
*   **Pattern:** Artisan status is NOT a field in Firebase Auth. It is detected by the presence of a document in `artisan_profiles/{uid}`. 
*   **Implementation:** See `src/components/Header.tsx` and `src/components/HomePageClient.tsx`.

### C. Polymorphic Translation (`t()`)
*   **Pattern:** The `useTranslation` hook detects if an input is a string (static UI) or a `Translatable` object `{en, hi, ta}` (database content). 
*   **AI instruction:** Always wrap database strings in the `t()` function.

### D. Optimistic UI & "Catch-and-Emit"
*   **Pattern:** All Firestore writes are non-blocking. 
*   **Flow:** Trigger `setDoc`/`addDoc` without `await` -> Chain `.catch()` -> Create `FirestorePermissionError` -> Emit via `errorEmitter`.
*   **Reason:** Provides instantaneous local feel while catching security rule violations globally.

## 3. Strict Guardrails
*   **Memoization:** All Firestore queries MUST be wrapped in `useMemoFirebase`. This is enforced via a custom check in the hooks to prevent billing-loop "infinite renders."
*   **Genkit v1.x:** This project uses the finalized Genkit v1.0+ API. Do not use deprecated `configureGenkit` syntax.

## 4. Immediate Tasks for Successor
1.  **Storage Bridge:** Transition from `imageId` placeholder strings to actual `firebase/storage` refs.
2.  **Hard Validation:** Current forms are in "Demo Mode" (optional fields). Transition to strict validation for production.
