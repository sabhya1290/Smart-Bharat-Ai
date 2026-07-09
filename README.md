<div align="center">

# 🇮🇳 Smart Bharat AI

### Your AI-Powered Civic Companion for India

A GenAI-powered civic platform that helps citizens discover government services, report public issues, receive personalized scheme recommendations, and track complaints in **English, Hindi, and Hinglish**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-0A66C2?style=for-the-badge)](https://smart-bharat-ai-navy.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge\&logo=google\&logoColor=white)](https://ai.google.dev/)

[🌐 Live Demo](https://smart-bharat-ai-navy.vercel.app/) · [🐛 Report Bug](https://github.com/sabhya1290/Smart-Bharat-Ai/issues) · [✨ Request Feature](https://github.com/sabhya1290/Smart-Bharat-Ai/issues)

</div>

---

## 📖 Table of Contents

* [About the Project](#-about-the-project)
* [Key Features](#-key-features)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [API Reference](#-api-reference)
* [Deployment](#-deployment)
* [Testing Checklist](#-testing-checklist)
* [Contributing](#-contributing)
* [License](#-license)

---

## 🚀 About the Project

**Smart Bharat AI** is a civic-tech platform designed to make public services easier to access for Indian citizens.

Users can explore government services, receive personalized scheme recommendations, report civic problems with images, track complaint status, and interact with an AI civic assistant. The platform is designed to be accessible through English, Hindi, and Hinglish.

> The app remains demo-ready even without a Gemini API key because it automatically uses structured mock AI responses when the API is unavailable.

---

## ✨ Key Features

| Feature                         | Description                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 🤖 AI Civic Assistant           | Ask questions about civic services and receive helpful structured responses.                            |
| 🏛️ Government Service Finder   | Search and filter government services by category and state.                                            |
| 🎯 Personalized Recommendations | Get scheme recommendations based on profile details such as age group, state, occupation, and category. |
| 🚨 Civic Issue Reporting        | Report local public issues and attach images as evidence.                                               |
| 🔎 Complaint Tracker            | Track complaint status and view a detailed complaint timeline.                                          |
| 🔖 Saved Services               | Bookmark useful services and access them later.                                                         |
| 📊 Transparency Dashboard       | View public issue statistics and visual charts.                                                         |
| 🌐 Multilingual Experience      | Use the platform in English, Hindi, or Hinglish.                                                        |
| ♿ Accessibility Features        | High-contrast mode and adjustable font size for better usability.                                       |
| 📱 Responsive Design            | Works across desktop, tablet, and mobile screens.                                                       |

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router DOM
* Lucide React
* Recharts
* React Hook Form + Zod
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* Multer
* Helmet
* CORS
* express-rate-limit
* dotenv

### Database & Storage

* Supabase PostgreSQL
* Supabase Storage

### AI

* Google Gemini API (`gemini-1.5-flash`)
* Structured mock fallback for demo mode

---

## 📂 Project Structure

```text
Smart-Bharat-Ai/
│
├── client/                 # React + Vite frontend
├── server/                 # Node.js + Express backend
├── database/               # SQL schema and seed files
├── docs/                   # PRD, architecture plan, API documentation
├── render.yaml             # Render backend deployment configuration
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* Node.js 18+
* npm
* A Supabase project
* Optional: Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/sabhya1290/Smart-Bharat-Ai.git
cd Smart-Bharat-Ai
```

### 2. Set Up the Database

1. Create a project on [Supabase](https://supabase.com/).
2. Open the Supabase SQL Editor.
3. Run these files in order:

```text
database/schema.sql
database/seed_services.sql
database/seed_scheme_rules.sql
database/seed_sample_complaints.sql
```

4. Create a public storage bucket named:

```text
civic-issues
```

### 3. Run the Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 4. Run the Frontend

Open a new terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

### Server Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_STORAGE_BUCKET=civic-issues
CLIENT_URL=http://localhost:5173
```

### Client Environment Variables

Create a `.env` file inside the `client` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> Never expose `SUPABASE_SERVICE_ROLE_KEY` in the frontend.

---

## 🔌 API Reference

All API routes use the `/api` prefix.

| Method | Endpoint                 | Authentication | Description                        |
| ------ | ------------------------ | -------------: | ---------------------------------- |
| POST   | `/auth/register`         |             No | Register a new user                |
| POST   | `/auth/login`            |             No | Log in and receive JWT             |
| GET    | `/auth/me`               |            Yes | Get current user details           |
| GET    | `/services`              |             No | Browse government services         |
| GET    | `/services/:id`          |             No | View service details               |
| POST   | `/services/:id/bookmark` |            Yes | Save a service                     |
| DELETE | `/services/:id/bookmark` |            Yes | Remove saved service               |
| GET    | `/recommendations`       |            Yes | Get personalized recommendations   |
| POST   | `/ai/chat`               |            Yes | Send a message to the AI assistant |
| POST   | `/issues`                |            Yes | Report a civic issue with image    |
| GET    | `/issues/mine`           |            Yes | View reported issues               |
| GET    | `/issues/:complaintId`   |             No | Track a complaint                  |
| GET    | `/dashboard/summary`     |             No | View transparency dashboard data   |

For protected routes, send:

```http
Authorization: Bearer <token>
```

---


## ✅ Testing Checklist

* [ ] Register and log in successfully.
* [ ] Use the AI Civic Assistant.
* [ ] Browse and filter government services.
* [ ] Save and remove bookmarked services.
* [ ] Update profile information and view recommendations.
* [ ] Report a civic issue with an image.
* [ ] Track a complaint using its complaint ID.
* [ ] View complaint timeline.
* [ ] Check charts in the Transparency Dashboard.
* [ ] Switch between English, Hindi, and Hinglish.
* [ ] Test high-contrast mode and font-size settings.
* [ ] Test the application on mobile screen sizes.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork this repository.
2. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes and commit them:

```bash
git commit -m "Add your feature"
```

4. Push your branch:

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request.

---

## 📄 License

This project is created for educational, hackathon, and civic-tech demonstration purposes.

---

<div align="center">

Made with ❤️ for a smarter and more accessible Bharat.

[⬆ Back to Top](#-smart-bharat-ai)

</div>
