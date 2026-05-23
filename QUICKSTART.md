# Quick Start Guide — ShopNest v1.0.0

Get the app running locally in about five minutes.

---

## Before You Start

Three things need to be on your machine. If any are missing, the steps below will fail.

| Tool | Required Version | Check With |
|---|---|---|
| Node.js | 18.x or higher | `node -v` |
| npm | 9.x or higher | `npm -v` |
| MongoDB | 7.x | `mongod --version` |

> **MongoDB Atlas?** If you'd rather skip a local install, create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas) and use the connection string it gives you for `MONGO_URL`. Everything else is the same.

---

## Step 1 — Clone the Repo

```bash
git clone <repository-url>
cd shopnest
```

The project has two sub-folders inside (`shopnest-backend` and `shopnest-frontend`). Keep them together.

---

## Step 2 — Backend Setup

Get the server running first so you can verify the API before touching the frontend.

### Install dependencies

```bash
cd shopnest-backend
npm install
```

### Create your .env file

```bash
cp .env.example .env
```

Open `shopnest-backend/.env` and fill in at minimum these values:

```env
MONGO_URL=mongodb://localhost:27017/shopnest
JWT_SECRET=pick-a-random-string-at-least-32-characters-long
CORS_ORIGIN=http://localhost:3000
```

> **JWT_SECRET tip:** Run `openssl rand -hex 32` in your terminal for a safe random value. Don't use something short or guessable — JWTs signed with a weak secret are trivially forged.

### Start the server

```bash
npm run dev
```

You should see:

```
Server running on port 5000
MongoDB connected
```

If the MongoDB line doesn't appear, the connection failed — check your `MONGO_URL` first. It'll exit with an error rather than running silently broken.

---

## Step 3 — Frontend Setup

Open a **second terminal window**. Don't stop the backend.

### Install dependencies

```bash
cd shopnest-frontend
npm install
```

### Create your .env file

```bash
cp .env.example .env
```

The only value you need:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Start the dev server

```bash
npm start
```

The browser opens to `http://localhost:3000` automatically. If it doesn't, navigate there manually.

---

## Step 4 — Verify It Works

Run through these quickly to confirm the core flows are functional:

1. Go to `http://localhost:3000`
2. Click **Register** and create an account (no email verification — any address works)
3. Browse the product listing page
4. Add a product to cart
5. Open the cart, check the total looks right
6. Go through checkout — pick **Cash on Delivery** to avoid needing PayPal credentials
7. Open **Order History** — your order should show up

> **No products showing?** The database starts empty. You'll need to seed it or add products via the API. Set `isAdmin: true` on your user directly in MongoDB, then POST to `/api/products` to add inventory. Add categories first — the filter sidebar needs them.

---

## Commands Reference

### Backend

| Command | What it does |
|---|---|
| `npm run dev` | Starts with nodemon — auto-restarts on file changes |
| `npm start` | Production mode — no auto-restart, no debug logging |
| `npm test` | Runs the test suite |

### Frontend

| Command | What it does |
|---|---|
| `npm start` | Dev server with hot reload at `localhost:3000` |
| `npm run build` | Production build — output goes to `/build` |
| `npm test` | Runs tests in watch mode |

---

## Common Errors

### MongoDB connection refused

```
MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

MongoDB isn't running. Start it:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
# Open Services → find MongoDB → click Start
```

---

### CORS error in browser

```
Access to XMLHttpRequest blocked by CORS policy
```

The `CORS_ORIGIN` value in your backend `.env` doesn't match the URL in your browser. They need to be identical — same protocol, same host, same port, no trailing slash.

```env
# Correct
CORS_ORIGIN=http://localhost:3000

# Wrong — trailing slash breaks it
CORS_ORIGIN=http://localhost:3000/
```

---

### Port already in use

```
Error: listen EADDRINUSE: address already in use :::5000
```

Something else is already on port 5000. Find and kill it:

```bash
# macOS / Linux
lsof -i :5000
kill -9 <PID>

# Windows (PowerShell)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### npm install fails — engine error

```
engine "node" is incompatible with this module. Expected: ">=18.0.0"
```

You're on an older Node version. Switch with nvm:

```bash
nvm install 18
nvm use 18
npm install
```

---

### White screen on frontend

No error message, just a blank page. Almost always means `REACT_APP_API_URL` is wrong or missing in `shopnest-frontend/.env`. Double-check it points to the running backend with `/api` at the end and no trailing slash.

---

## After Setup — What to Do Next

Once everything's running, here's the typical order for getting the app populated:

1. **Create an admin account** — set `isAdmin: true` directly in MongoDB Compass or the shell on your user document
2. **Add categories first** — the filter sidebar needs them. POST to `/api/categories`
3. **Add products** — POST to `/api/products` with category slugs matching what you created
4. **Customise the theme** — edit the theme object in `amazon-frontend/src/styles/`
5. **Wire up payments** — add `PAYPAL_CLIENT_ID` to backend `.env` and update the checkout step
6. **Deploy** — see the Deployment section in `README.md` when you're ready to go live

---

## Setup Checklist

Use this to track progress on a fresh install:

- [ ] Node 18+ installed (`node -v` to verify)
- [ ] MongoDB running locally or Atlas cluster ready
- [ ] `shopnest-backend/.env` created — `MONGO_URL`, `JWT_SECRET`, `CORS_ORIGIN` filled in
- [ ] `npm install` run in `shopnest-backend/`
- [ ] Backend starts without errors
- [ ] `shopnest-frontend/.env` created — `REACT_APP_API_URL` set
- [ ] `npm install` run in `shopnest-frontend/`
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Can register a new user account
- [ ] Product listing page loads (may be empty until products are added)
- [ ] Cart works — add, remove, update quantity
- [ ] Can complete a checkout with Cash on Delivery

---

> For full documentation — API reference, database schema, deployment steps, and more — see [`README.md`](./README.md).

**Version:** 1.0.0 &nbsp;|&nbsp; **May 2026**