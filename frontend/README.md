# Performance Arena - README

## Project overview
This repository contains the Performance Arena product: a gamification platform with a frontend (Vite + React + TypeScript) and a Node/Express backend located in the `backend/` folder. This README adds clear, focused documentation for running and developing both the backend and the frontend.

---

## Table of contents
- Backend
  - Overview
  - Requirements
  - Install
  - Run
  - Scripts
  - Environment variables
  - Tests
  - File structure / where to look
- Frontend
  - Overview
  - Requirements
  - Install
  - Run
  - Scripts
  - Environment variables
  - File structure / where to look
- Running both services together
- Troubleshooting and notes

---

## Backend

### Overview
The backend API is implemented in the `backend/` directory. It provides REST endpoints used by the frontend and supports importing data from Excel files. The backend is a lightweight Express server (entry: `backend/server.js`).

### Requirements
- Node.js 16+ (Node 18+ recommended)
- npm (or yarn)

### Install
From the repository root:

- Install dependencies for the backend:

  cd backend
  npm install

### Run (development)

- Start the backend in development (restarts on file changes using nodemon):

  npm run dev

### Run (production)

- Start the backend:

  npm start

The backend's default port is set in code (commonly 3000). If you need to change it, update the server config (see `backend/server.js`) or set the PORT environment variable.

### Available scripts (backend/package.json)
- `start` — node server.js
- `dev` — nodemon server.js
- `test` — jest
- `test:unit` — jest tests/unit
- `test:integration` — jest tests/integration

### Environment variables
Create a `.env` file in `backend/` or provide environment variables when starting the server. Common variables:

- `PORT` — port for the Express server (e.g. 3000)
- `NODE_ENV` — set to `development` or `production`

Check `backend/server.js` for any additional configuration keys the project uses.

### Tests
Run backend tests from the `backend/` directory:

  npm run test

Unit and integration tests are organized under `backend/tests/` (if present).

### Where to look in the codebase
- `backend/server.js` — server entry point, middleware, route registration
- `backend/package.json` — scripts and dependencies
- `backend/routes/` or `backend/controllers/` — (if present) REST route handlers
- `backend/middleware/` — (if present) middleware like auth, rate limiting, logging

If you need a complete list of endpoints, open the `backend/server.js` and any route files. The codebase may contain additional documentation files under the repo root (e.g. MANAGER_API_GUIDE.md, QUICK_REFERENCE.md).

---

## Frontend

### Overview
The frontend is a Vite + React + TypeScript application at the repository root (top-level `package.json` targets the frontend app). The app uses standard Vite commands for development and build.

### Requirements
- Node.js 16+ (Node 18+ recommended)
- npm (or yarn)

### Install
From the repository root:

  npm install

This installs the frontend dependencies defined in the top-level `package.json`.

### Run (development)

  npm run dev

This starts the Vite dev server (default port 5173). Open the URL printed by Vite (usually http://localhost:5173).

### Build (production)

  npm run build

### Available scripts (top-level package.json)
- `dev` — vite
- `build` — vite build
- `build:dev` — vite build --mode development
- `lint` — eslint .
- `preview` — vite preview
- `test` / `test:watch` — vitest

### Environment variables
Frontend environment variables for Vite should be prefixed with `VITE_`. Common variable used to connect to the backend:

- `VITE_API_BASE_URL` — full backend API URL (e.g. `http://localhost:3000`)

Create a `.env` or `.env.development` file in the repo root and add:

  VITE_API_BASE_URL=http://localhost:3000

Restart the dev server after changing env files.

### Where to look in the codebase
- `src/` — main application code (components, pages, routes)
- `index.html` — Vite entry page
- `vite.config.ts`, `tsconfig.json` — build and TypeScript configuration
- `tailwind.config.ts`, `postcss.config.js` — styling configuration

---

## Running both services together
1. Start the backend:

   cd backend
   npm run dev

2. In a second terminal, start the frontend from the repo root:

   npm run dev

3. Ensure the frontend's `VITE_API_BASE_URL` points to the backend (e.g., http://localhost:3000).

---

## Troubleshooting and notes
- If ports are already in use, change `PORT` for the backend or Vite port for the frontend in `vite.config.ts` or by passing environment variables.
- If you encounter CORS errors, check the backend CORS middleware configuration (see `backend/server.js`).
- Use `npm run lint` and `npm run test` to detect common issues.

---

If you want, I can:
- add more detailed API endpoint documentation by reading `backend/server.js` and route files,
- add example curl requests and Postman collection,
- or create a CONTRIBUTING guide for running the full stack in Docker.

View repository files in the GitHub web UI: https://github.com/Java-Developer24/performance-arena-mains/tree/main