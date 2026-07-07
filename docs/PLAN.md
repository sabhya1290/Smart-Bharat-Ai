# Smart Bharat AI — Full-Stack Build Plan

## Context
Greenfield hackathon build (no existing code). Deliver a working, deployable civic-tech
monorepo at `smart-bharat-ai/` per `docs/PRD.md`: React+Vite frontend, Node/Express backend,
Supabase Postgres+Storage, Gemini AI with mock fallback, JWT auth, civic issue reporting/tracking,
scheme recommendations, transparency dashboard, multilingual (EN/HI/Hinglish) + accessibility.
Credentials are placeholders (`.env.example`); app must run fully via mock AI and needs real
Supabase keys later to persist data.

**Resume instructions for another AI/session:** Read this file + `docs/PRD.md` fully before
touching code. Check `## Progress Log` at the bottom for what's already been built — verify by
listing the actual files (don't trust the log blindly if it looks stale). Continue from the first
unchecked item in `## Build Order`. Reuse all conventions below rather than inventing new ones.

## Folder Structure
```
smart-bharat-ai/
  client/            React + Vite + Tailwind
    src/
      components/    shared UI (Navbar, Sidebar, Toast, Skeletons, Modals, ChatBubble, etc.)
      pages/          15 route pages
      layouts/        AppLayout (sidebar+topbar), AuthLayout
      hooks/          useAuth, useToast, useSpeech, useDebounce
      context/        AuthContext, AccessibilityContext (lang/font/contrast)
      services/       axios instance + api*.js per domain (auth, services, ai, issues, dashboard)
      utils/          validators (zod schemas), formatters, complaintId helper (client-side display only)
      data/           i18n strings (en/hi/hinglish), category constants
      assets/
    index.html, vite.config.js, tailwind.config.js, postcss.config.js, vercel.json, .env.example
  server/            Node + Express
    src/
      config/        supabaseClient.js, env.js
      controllers/   auth, profile, services, bookmarks, recommendations, ai, issues, complaints, dashboard
      routes/        one router per domain, mounted in app.js
      middleware/     authMiddleware (JWT), errorHandler, rateLimiter, upload (multer)
      services/       geminiService.js (+ mock fallback), recommendationEngine.js, complaintIdGenerator.js
      validators/     zod/joi schemas per route
      prompts/        systemPrompt.js (civic assistant prompt spec)
      utils/          asyncHandler, apiResponse
      app.js, server.js
    .env.example
  database/
    schema.sql        users, services, user_saved_services, civic_issues, complaint_updates,
                       chat_messages, scheme_rules
    seed_services.sql  15 services
    seed_scheme_rules.sql
    seed_sample_complaints.sql
  docs/
    PRD.md, PLAN.md (this file), API.md
  README.md, render.yaml, .gitignore
```

## Backend Design
- **Auth**: `POST /api/auth/register`, `/login`, `/logout` (client-side token clear), `GET /api/auth/me`.
  JWT signed with `JWT_SECRET`, bcryptjs hash, 7-day expiry. `authMiddleware` verifies `Authorization: Bearer`.
- **Profile**: `GET/PUT /api/profile` — full name, phone, state, age group, occupation, income range,
  category enum, preferred language, accessibility prefs (stored as JSON column).
- **Services**: `GET /api/services` (search/category/state query params), `GET /api/services/:id`,
  `POST/DELETE /api/services/:id/bookmark` (auth), `GET /api/services/bookmarked` (auth).
- **Recommendations**: `GET /api/recommendations` (auth) — rule engine in
  `services/recommendationEngine.js` matches user profile fields against `scheme_rules` table rows
  (each rule: category/age/income/state conditions + service_id + reason template). Pure function,
  swappable later for an AI-based scorer without touching the route.
- **AI Chat**: `POST /api/ai/chat` (auth) — takes message + language, calls `geminiService.ask()`.
  `geminiService` wraps `@google/generative-ai`; on missing `GEMINI_API_KEY` or any thrown error,
  returns a structured mock (short answer/steps/documents/eligibility/time/portal/warnings/related)
  built from keyword matching against the message — never fails the request. Persists both user and
  AI messages to `chat_messages`. `GET /api/ai/chat/history`.
- **Civic Issues**: `POST /api/issues` (auth, multipart via multer) — uploads image buffer to Supabase
  Storage bucket `civic-issues`, inserts row, generates complaint ID `SB-{year}-{4-digit-seq}` via a
  Postgres sequence/count, assigns department by category lookup table, status `Submitted`.
  `GET /api/issues/mine` (auth). `GET /api/issues/:complaintId` (public, for tracker).
- **Complaint updates**: `POST /api/complaints/:id/updates` (simple admin-less status append used by
  seed data / manual testing), `GET /api/complaints/:id/timeline`.
- **Dashboard**: `GET /api/dashboard/summary` — aggregates counts, avg resolution time, category
  breakdown, status distribution, monthly trend, state/city breakdown via SQL aggregate queries;
  flags `isDemoData: true` when total complaints < threshold (e.g. 20).
- **Security**: helmet, cors (allow configured `CLIENT_URL` + localhost), express-rate-limit on
  `/api/auth/*` and `/api/ai/*`, centralized `errorHandler` middleware, `asyncHandler` wrapper so
  controllers stay try/catch-free.

## Database Design (Postgres via Supabase)
- `users`: id uuid pk, email unique, password_hash, full_name, phone, state, age_group, occupation,
  income_range, category, preferred_language, accessibility_prefs jsonb, created_at.
- `services`: id, name, category, description, eligibility text, required_documents text[],
  processing_time, official_url, states text[] (or `nationwide` boolean), created_at.
- `user_saved_services`: user_id fk, service_id fk, saved_at — composite unique.
- `scheme_rules`: id, service_id fk, condition jsonb (age_group/state/occupation/income_range/category
  arrays, empty = any), reason_template text, priority int.
- `civic_issues`: id, complaint_id unique, user_id fk, category, description, address, city, state,
  pincode, priority, landmark, image_url, department, status, created_at, estimated_resolution_date.
- `complaint_updates`: id, civic_issue_id fk, status, note, created_at — powers the timeline.
- `chat_messages`: id, user_id fk, role (user/assistant), content, language, structured jsonb,
  created_at.
- Indexes on `services(category)`, `civic_issues(complaint_id)`, `civic_issues(user_id)`,
  `chat_messages(user_id)`.
- Seed: 15 services (Aadhaar update, PAN, driving licence, passport, ration card, birth cert, income
  cert, caste cert, Ayushman Bharat, PM Kisan, scholarships, pension, employment services, voter ID,
  GST), ~10 scheme_rules covering student/farmer/senior/entrepreneur cases, 3-4 sample civic_issues
  with complaint_updates so the tracker/dashboard have non-empty demo data.

## Frontend Design
- **Routing** (`react-router-dom`): public routes (Landing, Login, Register, 404, Complaint Tracker —
  track by ID doesn't require auth) + protected routes wrapped in `<ProtectedRoute>` reading
  `AuthContext` (Dashboard, AI Assistant, Service Finder/Details, Recommendations, Report Issue, My
  Complaints, Transparency Dashboard, Saved Services, Profile/Settings).
- **State**: `AuthContext` (user, token in localStorage, login/register/logout), `AccessibilityContext`
  (language EN/HI/Hinglish, font scale, high-contrast toggle) persisted to localStorage, applied via
  a root `<html>` class + CSS variables.
- **API layer**: single axios instance (`services/apiClient.js`) with baseURL from
  `VITE_API_BASE_URL`, request interceptor attaching JWT, response interceptor normalizing errors for
  toast display. One thin wrapper module per domain calling the exact backend routes above.
- **Forms**: react-hook-form + zod resolvers for register/login/profile/report-issue; inline field
  errors, disabled+spinner submit buttons.
- **AI Assistant page**: chat list (scrollable), suggested-question chips, structured response card
  renderer (answer/steps/documents/eligibility/time/portal-link/warnings/related-services), copy
  button (clipboard API), TTS button (`window.speechSynthesis`), persistent disclaimer banner.
- **Dashboard/Transparency**: Recharts (BarChart status distribution, LineChart monthly trend,
  PieChart category share), stat cards, "Demo transparency data" badge when backend flags it.
- **Design system**: Tailwind config with blue/saffron/green/neutral palette tokens, shared
  `Button`, `Card`, `Badge`, `Skeleton`, `Toast`, `Modal`, `EmptyState` components reused across all
  15 pages; desktop collapsible sidebar + mobile bottom/hamburger nav in `AppLayout`.

## Deployment
- `client/vercel.json` — SPA rewrite (`/* -> /index.html`), build command `vite build`.
- `render.yaml` (repo root) — one `web` service for `server/` (`node src/server.js`), env var list
  referencing Render dashboard secrets (`JWT_SECRET`, `GEMINI_API_KEY`, `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `CLIENT_URL`).
- `.env.example` in both `client/` and `server/` listing every variable referenced in code (nothing
  undocumented).
- Top-level `.gitignore` (node_modules, dist, .env, uploads tmp).

## README.md Contents
Architecture overview, tech stack, full API endpoint table, local setup commands (`npm install` in
both client/server, `npm run dev` each), Supabase project + SQL script run order, Render deploy
steps, Vercel deploy steps, environment variable reference table, final manual testing checklist
(register→login→ask AI→browse services→save one→get recommendations→report issue with image→track
by complaint ID→view dashboard→switch language→toggle high contrast).

## Build Order (check off as completed)
- [x] 1. Root: `.gitignore`, `render.yaml`, root `README.md` stub (filled last).
- [x] 2. `database/`: schema.sql, seed files.
- [x] 3. `server/`: config → middleware/utils → services (gemini, recommendation engine, complaint id) →
      validators → controllers → routes → app.js/server.js → `.env.example` → `package.json`.
- [x] 4. `client/`: vite/tailwind config → context/hooks → services (api) → shared components → layouts →
      15 pages → routing in `App.jsx` → `.env.example`, `vercel.json` → `package.json`.
- [x] 5. Finalize root `README.md` with full instructions + testing checklist.

## Verification
- `cd server && npm install && npm run dev` — server boots on configured PORT without a live
  Supabase/Gemini connection (falls back to mock AI; DB calls will error until real Supabase keys
  are supplied — documented as expected in README).
- `cd client && npm install && npm run dev` — Vite dev server loads Landing page; navigate through
  public routes (Login/Register/404) without console errors.
- Confirm every `axios` call in `client/src/services/*` targets a route defined in `server/src/routes/*`
  (manual cross-check during generation, not automated).

## Progress Log
- 2026-07-07: PRD + PLAN written, empty folder skeleton created. Nothing else built yet.
- 2026-07-07: Full build completed in one pass — database schema/seeds, backend (all
  controllers/routes/services/middleware/validators), frontend (all 15 pages, contexts, shared
  components, layouts, API layer), deployment configs (render.yaml, vercel.json, both
  .env.example files), and final README.md with API reference, setup, deploy steps, and testing
  checklist. Every frontend axios call was manually cross-checked against a backend route — no
  mismatches found. Not yet run (`npm install` / `npm run dev`) or tested end-to-end in a browser —
  see README "Final Testing Checklist" for the next verification pass. Real Supabase/Gemini
  credentials still need to be supplied by the user for the app to persist data beyond mock AI.
