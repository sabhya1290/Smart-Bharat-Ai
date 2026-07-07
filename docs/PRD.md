# Smart Bharat AI — Product Requirements Document

## 1. Product
**Name:** Smart Bharat AI
**Pitch:** A GenAI-powered civic companion helping Indian citizens access government services,
report public issues, get personalized scheme recommendations, understand document requirements,
track complaints, and use the platform in English, Hindi, or Hinglish.

## 2. Goals
- End-to-end working app (not static UI) — deployable to Vercel (frontend) + Render (backend) +
  Supabase (Postgres + Storage).
- Must run in "demo mode" with zero external credentials: mock AI fallback when `GEMINI_API_KEY`
  is absent, clearly-labeled demo/seed data.
- Never expose secrets in frontend code; all third-party keys live in backend env vars only.

## 3. Users
Citizens across age groups/occupations: students, farmers, workers, senior citizens,
entrepreneurs, other. Profile captures state, age group, occupation, income range, category,
preferred language, accessibility preferences.

## 4. Functional Modules
1. **Authentication** — register/login/logout, JWT-protected routes, bcrypt hashing, profile CRUD.
2. **AI Civic Assistant** — chatbot, EN/HI/Hinglish, persisted chat history, suggested questions,
   copy + text-to-speech, structured responses (short answer, steps, documents, eligibility,
   estimated time, official portal link, warnings, related services). System prompt must never
   invent schemes/documents/URLs, must ask clarifying questions when info is insufficient, must
   include a "verify on official portal" disclaimer.
3. **Government Service Finder** — searchable/filterable directory (category, state), detail pages,
   bookmarking, "Ask AI about this service". Seeded with 15 real Indian civic services.
4. **Personalized Scheme Recommendations** — rule-based engine over profile fields, matched against
   a `scheme_rules` table; must be swappable for an AI-based scorer later without route changes.
5. **Civic Issue Reporting** — category, description, location (address/city/state/pincode),
   priority, optional landmark, image upload to Supabase Storage, auto-generated complaint ID
   (`SB-{year}-{seq}`), auto-assigned department, initial status `Submitted`.
6. **Complaint Tracker** — lookup by complaint ID (public), status/department/date/location/image/
   progress timeline/estimated resolution date; logged-in users see all their own complaints.
7. **Transparency Dashboard** — total/pending/resolved counts, avg resolution time, category
   breakdown, status distribution, monthly trend, state/city breakdown via Recharts; "Demo
   transparency data" label shown when volume is low.
8. **Accessibility & Multilingual** — language selector (EN/HI/Hinglish), font-size control,
   high-contrast mode, keyboard navigation, ARIA labeling, responsive mobile layout, TTS for AI
   replies.

## 5. Pages (15 + 404)
Landing, Register, Login, Dashboard Home, AI Assistant, Service Finder, Service Details, Scheme
Recommendations, Report Civic Issue, Complaint Tracker, My Complaints, Transparency Dashboard,
Saved Services, Profile & Accessibility Settings, 404.

## 6. Non-Functional Requirements
- Security: helmet, CORS locked to configured client URL, express-rate-limit on auth/AI routes,
  JWT auth middleware, centralized error handling, input validation (zod) on every mutating route.
- Code quality: modular, no TODO/placeholder functions, no fake imports, beginner-readable.
- Every frontend API call must match an existing backend route exactly.
- All env vars documented in `.env.example` (client + server).

## 7. Tech Stack (fixed, do not substitute)
**Frontend:** React + Vite, Tailwind CSS, React Router DOM, Lucide React, Recharts, React Hook
Form + Zod, Axios.
**Backend:** Node.js + Express, JWT, bcryptjs, Multer, dotenv, CORS, express-rate-limit, Helmet.
**Data:** Supabase Postgres + Supabase Storage, Supabase JS client (backend only).
**AI:** Google Gemini API via backend service layer, with deterministic structured mock fallback.

## 8. Out of Scope (for this build)
Real government API integrations, real payment/verification flows, admin panel for complaint
status changes (status updates seeded/manual for demo), real SMS/email notifications.

## 9. Acceptance / Testing Checklist
See `docs/PLAN.md` → Verification section and root `README.md` → Testing Checklist. In short:
register → login → chat with AI assistant (mock mode works with no key) → browse/filter services →
bookmark one → view personalized recommendations → report an issue with an image → track it by
complaint ID → view it in "My Complaints" → view transparency dashboard charts → switch language →
toggle high-contrast/font size, all without console errors and with every API call succeeding
against the local backend (once Supabase env vars are supplied) or failing gracefully with a toast.
