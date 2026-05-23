# 🚀 ShopNest Deployment Guide

## Live Deployment

**Frontend:** http://51.21.196.14:3000  
**Backend:** http://51.21.196.14:5000  
**Database:** MongoDB Atlas (Cloud)

---

## Docker Setup (Production-Ready)

### Prerequisites
- Docker and Docker CLI installed
- Git (to clone repo)

### Build & Run on Local Machine

**Step 1: Backend**
```bash
cd amazon-backend
docker build -t shopnest-backend .
docker run -d -p 5000:5000 shopnest-backend
```

**Step 2: Frontend**
```bash
cd amazon-frontend
docker build -t shopnest-frontend --legacy-peer-deps .
docker run -d -p 3000:3000 shopnest-frontend
```

Access at `http://localhost:3000`

### Deploy to Remote Server (AWS EC2, DigitalOcean, Linode, etc.)

```bash
# SSH into your VM
ssh -i your-key.pem ubuntu@your-server-ip

# Clone repo
git clone <repository-url>
cd Amazon-Clone

# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker

# Build and run backend
cd amazon-backend
docker build -t shopnest-backend .
docker run -d -p 5000:5000 shopnest-backend

# Build and run frontend (in new terminal)
cd ../amazon-frontend
docker build -t shopnest-frontend .
docker run -d -p 3000:3000 shopnest-frontend
```

Access app at `http://your-server-ip:3000`

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB 7+ (local or Atlas)

### Backend

```bash
cd amazon-backend
npm install
npm run dev
```

Runs on `http://localhost:5000`

### Frontend

```bash
cd amazon-frontend
npm install --legacy-peer-deps
npm start
```

Opens at `http://localhost:3000`

### Seed Database

```bash
cd amazon-backend
npm run seed
```

---

## Environment Files

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secure-jwt-secret-key-minimum-32-characters-long
PAYPAL_CLIENT_ID=sb
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

**For remote deployment, change to your server IP:**
```env
REACT_APP_API_URL=http://your-server-ip:5000
```

---

## Docker Commands

```bash
# List running containers
docker ps

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Rebuild without cache
docker build --no-cache -t shopnest-frontend .
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Port already in use | `docker stop $(docker ps -q)` |
| CORS errors | Verify `REACT_APP_API_URL` matches backend address |
| npm install fails | Use `--legacy-peer-deps` for frontend |
| MongoDB connection error | Check connection string |
| Docker permission denied | Run `sudo usermod -aG docker $USER` |

---

## Architecture

```
┌─────────────────────────────────────────┐
│     Frontend (React + Redux)            │
│     :3000                               │
│                                         │
│  - Product Catalog                      │
│  - Shopping Cart                        │
│  - User Authentication                  │
│  - Order Management                     │
│  - Reviews & Wishlist                   │
└────────────────┬────────────────────────┘
                 │ HTTP/REST (Axios)
                 │
┌────────────────▼────────────────────────┐
│      Backend (Express.js)               │
│      :5000                              │
│                                         │
│  - JWT Authentication                   │
│  - Rate Limiting                        │
│  - Input Validation                     │
│  - CORS Policy                          │
│  - API Routes                           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    MongoDB Atlas (Cloud)                │
│                                         │
│  - Users                                │
│  - Products                             │
│  - Orders                               │
│  - Cart                                 │
│  - Wishlist                             │
│  - Reviews                              │
└─────────────────────────────────────────┘
```

---

## Security

✅ Helmet headers  
✅ Rate limiting (100 req/15 min)  
✅ JWT authentication  
✅ bcryptjs password hashing (10 rounds)  
✅ Input validation (express-validator)  
✅ CORS restricted  
✅ XSS protection  
✅ MongoDB injection protection  

---

## Performance

| Metric | Target |
|---|---|
| Page Load | < 2s |
| API Response | < 200ms |
| Rate Limit | 100 req/15 min |
| JWT Expiry | 7 days |

---

**Ready for production! 🎉**
