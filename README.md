# Smart Bharat AI — Your Civic Companion

A GenAI-powered civic platform helping Indian citizens access government services, report public
issues, receive personalized scheme recommendations, track complaints, and use the platform in
English, Hindi, or Hinglish.

See `docs/PRD.md` for the full product spec and `docs/PLAN.md` for the build plan/architecture.

## Tech Stack

**Frontend:** React + Vite, Tailwind CSS, React Router DOM, Lucide React, Recharts, React Hook Form
+ Zod, Axios.

**Backend:** Node.js + Express, JWT auth, bcryptjs, Multer, dotenv, CORS, express-rate-limit, Helmet.

**Data:** Supabase Postgres + Supabase Storage (image uploads), accessed via the Supabase JS client
in the backend only.

**AI:** Google Gemini API (`gemini-1.5-flash`) via a backend service layer, with a deterministic,
structured mock fallback used automatically when `GEMINI_API_KEY` is not set or a Gemini call fails —
the app is always demo-ready.

## Monorepo Structure

```
smart-bharat-ai/
  client/     React + Vite frontend
  server/     Node + Express backend
  database/   SQL schema + seed files (run in Supabase SQL editor)
  docs/       PRD.md, PLAN.md, API.md
  render.yaml Backend deploy config for Render
```

## API Reference

All routes are prefixed with `/api`. Auth-protected routes require `Authorization: Bearer <token>`.

| Method | Route                          | Auth | Description                                   |
|--------|---------------------------------|------|------------------------------------------------|
| POST   | `/auth/register`                | No   | Create account, returns JWT + user             |
| POST   | `/auth/login`                   | No   | Log in, returns JWT + user                     |
| GET    | `/auth/me`                      | Yes  | Get current user                               |
| GET    | `/profile`                      | Yes  | Get current user profile (alias of `/auth/me`) |
| PUT    | `/profile`                      | Yes  | Update profile fields                          |
| GET    | `/services`                     | No   | List services (`?search=&category=&state=`)    |
| GET    | `/services/:id`                 | No   | Get one service                                |
| GET    | `/services/bookmarked`          | Yes  | List current user's saved services             |
| POST   | `/services/:id/bookmark`        | Yes  | Save a service                                 |
| DELETE | `/services/:id/bookmark`        | Yes  | Remove a saved service                         |
| GET    | `/recommendations`              | Yes  | Rule-based personalized scheme recommendations |
| POST   | `/ai/chat`                      | Yes  | Send a message to the civic assistant          |
| GET    | `/ai/chat/history`              | Yes  | Get chat history                               |
| POST   | `/issues`                       | Yes  | Report a civic issue (`multipart/form-data`, field `image`) |
| GET    | `/issues/mine`                  | Yes  | List current user's reported issues            |
| GET    | `/issues/:complaintId`          | No   | Look up a complaint by ID (public tracker)     |
| GET    | `/complaints/:complaintId/timeline` | No | Get a complaint's status timeline           |
| POST   | `/complaints/:complaintId/updates`  | No | Append a status update (demo/manual use)    |
| GET    | `/dashboard/summary`            | No   | Transparency dashboard aggregate stats         |

## Local Setup

### 1. Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run, in order:
   - `database/schema.sql`
   - `database/seed_services.sql`
   - `database/seed_scheme_rules.sql`
   - `database/seed_sample_complaints.sql`
3. Create a **public** Storage bucket named `civic-issues` (Storage → New Bucket → Public bucket).
4. Copy your Project URL and `service_role` key (Settings → API) for the backend `.env`.

### 2. Backend

```bash
cd server
cp .env.example .env   # fill in JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY (optional)
npm install
npm run dev             # http://localhost:5000
```

Without `GEMINI_API_KEY`, `/api/ai/chat` automatically returns structured mock responses — the app
remains fully demoable.

### 3. Frontend

```bash
cd client
cp .env.example .env    # VITE_API_BASE_URL=http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```

## Environment Variables

**server/.env**

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default 5000) | Server port |
| `JWT_SECRET` | Yes | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | No (default 7d) | Token lifetime |
| `GEMINI_API_KEY` | No | Enables real Gemini responses; falls back to mock if unset |
| `SUPABASE_URL` | Yes (for DB features) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (for DB features) | Supabase service role key (backend only, never expose) |
| `SUPABASE_STORAGE_BUCKET` | No (default civic-issues) | Storage bucket for issue images |
| `CLIENT_URL` | Yes (prod) | Deployed frontend URL, for CORS |

**client/.env**

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Base URL of the backend API, e.g. `https://your-api.onrender.com/api` |

## Deployment

### Supabase
Follow the "Local Setup → Database" steps above against your production Supabase project.

### Backend → Render
1. Push this repo to GitHub.
2. In Render, create a new **Blueprint** from the repo (uses the root `render.yaml`), or manually
   create a Web Service with root directory `server`, build command `npm install`, start command
   `node src/server.js`.
3. Set the env vars listed above in the Render dashboard (`JWT_SECRET`, `GEMINI_API_KEY`,
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CLIENT_URL`).
4. Deploy and note the resulting URL, e.g. `https://smart-bharat-ai-server.onrender.com`.

### Frontend → Vercel
1. Import the repo in Vercel, set the root directory to `client`.
2. Framework preset: Vite. Build command `npm run build`, output directory `dist`.
3. Set env var `VITE_API_BASE_URL` to your Render backend URL + `/api`.
4. Deploy. `client/vercel.json` handles SPA routing rewrites.
5. Update `CLIENT_URL` on Render to your Vercel URL so CORS allows it.

## Final Testing Checklist

- [ ] Register a new account, then log out and log back in.
- [ ] Ask the AI Assistant a suggested question — verify a structured response renders (mock or Gemini).
- [ ] Copy an AI response and use the text-to-speech button.
- [ ] Browse Service Finder, filter by category, open a service's details page.
- [ ] Save a service, confirm it appears under Saved Services, then remove it.
- [ ] Complete your profile (age group, state, occupation, category) and check Recommendations updates.
- [ ] Report a civic issue with an uploaded photo — confirm a complaint ID like `SB-2026-1042` is shown.
- [ ] Track that complaint ID on the Complaint Tracker page and confirm the timeline renders.
- [ ] View the same complaint under My Complaints.
- [ ] Open the Transparency Dashboard and confirm charts render (with the "Demo transparency data"
      badge visible if fewer than 20 complaints exist).
- [ ] Switch language between English, Hindi, and Hinglish and confirm navigation labels update.
- [ ] Toggle high-contrast mode and adjust font size from Profile & Settings.
- [ ] Resize the browser to mobile width and confirm the hamburger menu and layout work correctly.
