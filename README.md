# Anime/Manga Fan Website

## Project Overview
Full-stack WEB 2 final project for an Anime/Manga Fan Website. The backend provides authentication and manga list management, while the frontend offers a simple UI to register/login, manage profile, add manga entries, and search manga via the Jikan API.

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Joi Validation

## Setup & Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file using `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## Frontend
The frontend is served from `src/public`. After starting the server, open:
- `http://localhost:3000`
The UI supports register/login, profile update, manga create/edit/delete, and external search.
Pages include:
- Home: `/`
- Login: `/pages/login.html`
- Register: `/pages/register.html`
- Manga: `/pages/manga.html`
- Search: `/pages/search.html`
- Manga Detail: `/pages/manga-detail.html?id=<id>`
- Profile: `/pages/profile.html`
- About: `/pages/about.html`

## API Documentation

### Auth Routes (Public)
- `POST /api/auth/register` — Register a user
  - Body: `{ "username": "", "email": "", "password": "" }`
- `POST /api/auth/login` — Login and receive JWT
  - Body: `{ "email": "", "password": "" }`

### User Routes (Private)
- `GET /api/users/profile` — Get current user profile
- `PUT /api/users/profile` — Update profile
  - Body: `{ "username"?: "", "email"?: "", "password"?: "" }`

### Manga Routes (Private)
- `POST /api/manga` — Create manga entry
- `GET /api/manga` — Get all manga entries
- `GET /api/manga/:id` — Get one manga entry
- `PUT /api/manga/:id` — Update manga entry
- `DELETE /api/manga/:id` — Delete manga entry

### External API (Public)
- `GET /api/external/manga/search?q=title` — Search manga via Jikan API
- `GET /api/external/manga/:id` — Get manga details from Jikan API

## Environment Variables
- `PORT` — Server port (default 3000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT signing

## Notes
- Include `Authorization: Bearer <token>` header for protected routes.
- API responses are in JSON format.

## Deployment (Render/Railway)
1. Set environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`) in the platform dashboard.
2. Set the start command to `npm start`.
3. Use a hosted MongoDB (Atlas) for production.
