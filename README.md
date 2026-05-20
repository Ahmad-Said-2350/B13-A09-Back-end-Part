# IdeaVault — Server

REST API backend for IdeaVault. Handles all data operations, JWT verification, and MongoDB communication.

Built for simplicity — clean routes, verified access, zero complexity.

---

## Overview

IdeaVault server powers the entire backend of the platform. It exposes a set of REST API endpoints for ideas and comments, protected by BetterAuth JWT verification. All data is stored in MongoDB Atlas using the native driver — no Mongoose, no schema overhead.

**Client Repo:** https://github.com/Ahmad-Said-2350/B13-A09-Frontend-Part

**Live Server:** https://b13-a09-back-end-part.vercel.app/
---

## What's Inside

**Ideas** — Full CRUD for startup ideas. Public routes for browsing and trending. Private routes for posting, updating, and deleting — all protected by JWT.

**Comments** — Add, edit, and delete comments on any idea. Comment count on the parent idea updates automatically on every post and delete.

**My Ideas** — Fetch all ideas posted by a specific user via email query.

**My Interactions** — Fetch all ideas a user has commented on, with full idea details attached to each comment.

**JWT Verification** — Every private route is protected using `jose-cjs` with BetterAuth's remote JWKS endpoint. No token, no access.

---

## API Routes

| Method | Route | Access |
|---|---|---|
| GET | `/ideas` | Public |
| GET | `/ideas/trending` | Public |
| GET | `/ideas/my-ideas?email=` | Private |
| GET | `/ideas/:id` | Private |
| POST | `/ideas` | Private |
| PUT | `/ideas/:id` | Private |
| DELETE | `/ideas/:id` | Private |
| GET | `/comments/:ideaId` | Public |
| POST | `/comments` | Private |
| PUT | `/comments/:id` | Private |
| DELETE | `/comments/:id` | Private |
| GET | `/comments/user/all?email=` | Private |

---

## Tech Stack

| | |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database (native driver) |
| jose-cjs | JWT verification via JWKS |
| dotenv | Environment variables |
| cors | Cross-origin request handling |

---

## Getting Started

```bash
git clone https://github.com/Ahmad-Said-2350/B13-A09-Back-end-Part
npm install
npm run dev
```

Create a `.env` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:3000
```

---

## NPM Packages Used

```bash
express
mongodb
jose-cjs
jsonwebtoken
dotenv
cors
nodemon
```

---

## Notes

- No Mongoose — uses MongoDB native driver directly
- JWT verified against BetterAuth's JWKS endpoint
- Comment count on ideas updates automatically on add and delete
- `node:dns` overridden to use Google DNS for stable Atlas connection
- All private routes return `401` without a valid token

---

Crafted for innovators — minimal, honest, community-driven.