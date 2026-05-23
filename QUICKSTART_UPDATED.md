# Quick Start — ShopNest v1.0.0

Get the app running in under 5 minutes.

---

## ⚡ Fastest Way: Docker

### Prerequisites
- Docker installed

### Run Locally

```bash
# Backend
cd amazon-backend
docker build -t shopnest-backend .
docker run -d -p 5000:5000 shopnest-backend

# Frontend (new terminal)
cd amazon-frontend
docker build -t shopnest-frontend .
docker run -d -p 3000:3000 shopnest-frontend
```

Open `http://localhost:3000` ✅

---

## 📦 Traditional: Node.js

### Prerequisites
- Node.js 18+
- npm 9+

### Backend (Terminal 1)

```bash
cd amazon-backend
npm install
npm run dev
```

Server on `http://localhost:5000`

### Frontend (Terminal 2)

```bash
cd amazon-frontend
npm install --legacy-peer-deps
npm start
```

App on `http://localhost:3000`

### Seed Database (Terminal 3 - First Time Only)

```bash
cd amazon-backend
npm run seed
```

---

## ✅ What You Get

- ✅ Full product catalog (12 items per page)
- ✅ Search & filtering (category, price, rating)
- ✅ Shopping cart (persistent)
- ✅ Multi-step checkout
- ✅ Order history
- ✅ User reviews
- ✅ Wishlist
- ✅ Admin features

---

## 🔗 Key URLs

| Component | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| Health Check | http://localhost:5000/health |

---

## 🚀 Deploy to Cloud

See `DEPLOYMENT_GUIDE.md` for step-by-step instructions for AWS, Render, Vercel, etc.

---

## ❓ Issues?

- **Port in use?** Run `docker stop $(docker ps -q)`
- **npm errors?** Use `npm install --legacy-peer-deps`
- **MongoDB error?** Connection is hardcoded to Atlas in `server.js`

---

**That's it! Start building. 🎉**
