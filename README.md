# ⚡ ResumeForge AI — Full Stack Setup Guide

## Tech Stack
- **Frontend:** React 18 + React Router v6
- **Backend/DB:** Firebase (Auth + Firestore)
- **AI:** Claude API (claude-sonnet-4-20250514)
- **PDF Export:** html2pdf.js
- **Hosting:** Netlify / Vercel / Firebase Hosting

---

## Step 1 — Install Dependencies

```bash
cd resumeforge
npm install
```

---

## Step 2 — Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add Project"** → name it `resumeforge-ai`
3. Go to **Project Settings** → **Your apps** → click Web (`</>`)
4. Register app, copy the config values
5. Open `src/firebase/config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

6. In Firebase Console → **Authentication** → Enable **Email/Password**
7. In Firebase Console → **Firestore Database** → Create database (production mode)

### Firestore Security Rules
Paste these in **Firestore → Rules**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
    match /ats_reports/{reportId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
```

---

## Step 3 — Claude AI API Key

The Claude API key must be handled via a **backend proxy** (never expose in frontend).

### Option A: Simple Netlify Function (recommended)
Create `netlify/functions/claude.js`:
```js
exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  return { statusCode: 200, body: JSON.stringify(data) };
};
```
Then in your React code, call `/api/claude` instead of the Anthropic URL directly.

Set `ANTHROPIC_API_KEY` in Netlify → Site Settings → Environment Variables.

### Option B: Firebase Cloud Function
Same pattern but deployed as a Firebase function.

---

## Step 4 — Payment Integration (Razorpay)

1. Create account at https://razorpay.com
2. Get your **Key ID** from Dashboard → Settings → API Keys
3. Add Razorpay script to `public/index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```
4. In `src/pages/Pricing.js`, find the `handlePurchase` function and replace the demo block with the Razorpay code shown in the comments.
5. Set your Key ID in the options object.

For **Stripe**, use `@stripe/stripe-js` package instead.

---

## Step 5 — Run Locally

```bash
npm start
```
Opens at http://localhost:3000

---

## Step 6 — Deploy to Netlify (Recommended)

```bash
npm run build
```

1. Go to https://app.netlify.com/drop
2. Drag the `build/` folder
3. Done! You get a live URL instantly.

Or connect your GitHub repo for auto-deploys.

---

## Project Structure

```
resumeforge/
├── public/
│   └── index.html
├── src/
│   ├── firebase/
│   │   └── config.js          ← Firebase credentials
│   ├── hooks/
│   │   └── AuthContext.js     ← Auth + plan state
│   ├── components/
│   │   ├── Navbar.js/.css
│   │   └── ResumePreview.js/.css  ← 6 resume templates
│   ├── pages/
│   │   ├── Landing.js/.css    ← Public homepage
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Auth.css
│   │   ├── Dashboard.js/.css  ← User resume list
│   │   ├── ResumeBuilder.js/.css  ← Form + PDF export
│   │   ├── ATSAnalyser.js/.css    ← Claude AI scoring
│   │   ├── Templates.js/.css  ← Template gallery
│   │   └── Pricing.js/.css    ← Plans + payment
│   ├── App.js                 ← Routes
│   ├── index.js
│   └── index.css              ← Global styles
└── package.json
```

---

## Plan Feature Gates

| Feature | Free | Pro ($1) | Max ($3) |
|---|---|---|---|
| Resumes | 2 | Unlimited | Unlimited |
| Templates | 3 | 4 | 6 |
| PDF Export | ✓ | ✓ | ✓ |
| AI Writing | ✗ | ✓ | ✓ |
| ATS Analyser | ✗ | ✓ | ✓ |
| All Templates | ✗ | ✗ | ✓ |

All plan checks are in `AuthContext.js` (Firestore `users/{uid}.plan` field).

---

## Support
Built with ❤️ using React, Firebase, and Claude AI.
