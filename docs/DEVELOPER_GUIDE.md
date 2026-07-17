# Developer Deep-Dive: GI Heritage Hub Patterns

## 📁 Project Philosophy
Bridge the gap between rural Indian artisans and a global audience via authenticity and AI.

## 🔧 Hidden Technical Patterns

### 1. Optimistic UI & "Catch and Emit"
We use a non-blocking write pattern to make the UI feel instantaneous.
- Mutations are triggered without `await`.
- Chained `.catch()` sends errors to a global `errorEmitter`.
- The `FirebaseErrorListener` catches these and throws them to the Next.js error overlay.

### 2. Security Rules Philosophy
- **Public:** Profiles and Products are readable by anyone.
- **Private:** Chats and Custom Orders are restricted to specific UIDs named in the document.
- **Immutable Owners:** Rules prevent changing the `artisanId` or `userId` on existing documents.

### 3. State Persistence
- Cart and Wishlist items are serialized to JSON in `localStorage`. 
- This allows a user to "Shift" browsers and keep their selected items.

### 4. Lightweight Styling
- No heavy background images.
- We use inline SVG grid patterns in CSS for texture.
- Font `Alegreya` is loaded via Google Fonts with specific weights for performance.