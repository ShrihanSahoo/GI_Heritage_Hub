
# Hosting GI Heritage Hub

This app is optimized for GitHub-integrated hosting providers and global edge deployment.

## 1. Cloudflare Pages Deployment (RECOMMENDED)
Cloudflare Pages is the ideal choice for this app due to its superior global performance and Node.js compatibility for Genkit.

### Manual Deployment via CLI
1.  **Login to Wrangler:** `npx wrangler login`.
2.  **Deploy:** Run `npm run pages:deploy`. 
3.  Wrangler will build the project and push the `.vercel/output` to Cloudflare.

### Automated Deployment (Dashboard)
1.  **Connect Repo:** Import your GitHub repository into the Cloudflare Pages dashboard.
2.  **Build Settings:**
    -   **Framework Preset:** `Next.js`
    -   **Build Command:** `npm run build` (Note: Cloudflare's new Next.js integration handles this natively).
3.  **Node.js Compatibility (CRITICAL):**
    -   Go to **Settings > Functions > Compatibility Flags**.
    -   Add the `nodejs_compat` flag to both **Production** and **Preview** environments.
    -   *Without this, Genkit AI flows will fail.*
4.  **Environment Variables:** Add your `FIREBASE_...` and `GEMINI_API_KEY` keys in the dashboard.

## 2. Antigravity Deployment
1.  **Connect Repo:** Import your GitHub repository.
2.  **Environment Variables:** Manually add all keys from `.env.example`.
3.  **Build Command:** `npm run build`.
4.  **Firebase Settings:** Add your Antigravity URL to "Authorized Domains" in the Firebase Console.

## 3. Firebase Authorized Domains
No matter where you host (Cloudflare or Antigravity), you **must** add the final production domain to the **Firebase Authentication > Settings > Authorized Domains** list. If this is skipped, Google Sign-In and popup authentication will be blocked by the browser.
