# TravelBoost — MERN Tourism Platform (Student Innovation Project)

A full-stack solution to the "boost the tourism industry" problem statement: a unified
marketplace where travelers discover and book hotels + experiences, small vendors list
their properties directly, and an AI-style planner builds a day-wise itinerary automatically.

## Problem it solves
- Tourists juggle separate apps/agents for hotels, transport, and activities → **one platform, one checkout.**
- Small hotels/homestays have poor online visibility → **self-service vendor onboarding.**
- Fake reviews erode trust → **reviews are only allowed after a real booking** (schema enforces this).
- Trip planning is time-consuming → **AI Planner generates a budget-aware itinerary from live inventory.**

## Tech stack
- **Frontend:** React 18 + Vite + Tailwind CSS + React Router + Axios
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT auth + bcrypt

## Project structure
```
TravelBoost/
├── backend/        # Phase 2 — REST API
│   ├── models/         User, Hotel, Experience, Booking, Review
│   ├── controllers/     business logic
│   ├── routes/          /api/auth, /api/hotels, /api/experiences, /api/bookings, /api/reviews, /api/planner
│   ├── middleware/auth.js   JWT protect + role guard
│   ├── seed.js          demo data loader
│   └── server.js
└── frontend/       # Phase 1 — UI
    └── src/
        ├── pages/       Home, Explore, HotelDetail, Experiences, Bookings, Planner, Login, Register
        ├── components/  Sidebar, Topbar, Layout, HotelCard, ExperienceCard
        └── context/AuthContext.jsx
```

## How to run

### 1. Backend
```bash
cd backend
cp .env.example .env      # edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed               # loads 5 demo hotels + 6 experiences + 2 users
npm run dev                # starts API on http://localhost:5001
```
Demo login: `traveler@travelboost.com` / `password123`

### 2. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # starts UI on http://localhost:5173
```

Requires a MongoDB instance — either local (`mongod`) or a free MongoDB Atlas cluster
(paste its connection string into `backend/.env` as `MONGO_URI`).

## Core API endpoints
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account (traveler or vendor) |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/hotels?destination=&sort= | Search/filter hotels |
| POST | /api/hotels | Vendor: list a new hotel |
| GET | /api/experiences?category= | Browse experiences |
| POST | /api/bookings | Book a hotel or experience (applies coupon) |
| GET | /api/bookings/mine | My bookings |
| PATCH | /api/bookings/:id/cancel | Cancel a confirmed booking and release its room |
| POST | /api/reviews | Leave a rating after a confirmed booking |
| GET | /api/hotels/mine | Vendor: view own hotel listings |
| GET | /api/experiences/mine | Vendor: view own activity listings |
| POST | /api/planner | Generate AI-style day-wise itinerary |

## Ideas to extend for the pitch/demo
- Swap `plannerController.js`'s rule-based loop for a real LLM call (Anthropic API) for
  natural-language itinerary descriptions.
- Add payment gateway (Razorpay/Stripe test mode) to the booking flow.
- Add a vendor dashboard (list your hotel, see bookings, revenue analytics).
- Add multilingual support and regional payment options for wider tourist reach.
