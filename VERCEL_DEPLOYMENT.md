# Vercel Deployment Guide

This guide explains how to deploy the full-stack MERN application on Vercel.

## Architecture Overview

- **Backend**: Express.js API + Static Frontend Serving (Node.js Runtime on Vercel)
- **Frontend**: React App (Built during backend build process)
- **Database**: MongoDB Atlas (separate cloud service)

## Deployment Structure

```
Backend (Vercel):
├── API Routes: /api/*
├── Static Files: Served from amazon-frontend/build/
└── SPA Fallback: Serves index.html for all non-API routes
```

## Setup Instructions

### 1. Backend Setup (amazon-backend)

The backend now serves the React frontend build files automatically.

**Key Files:**
- `server.js` - Now includes static middleware and SPA fallback
- `vercel.json` - Routes configuration for Vercel
- `package.json` - Includes build script that builds frontend

### 2. Vercel Deployment Steps

#### Step 1: Create Vercel Account
- Sign up at https://vercel.com
- Link your GitHub repository

#### Step 2: Deploy Backend with Frontend

1. Go to Vercel Dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Root Directory**: `amazon-backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start` (pre-filled)
   - **Output Directory**: Empty (not needed for Node.js)

#### Step 3: Add Environment Variables

In Vercel Dashboard under "Settings > Environment Variables":

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
CORS_ORIGIN=https://your-project.vercel.app
PAYPAL_CLIENT_ID=your_paypal_sandbox_or_production_client_id
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

#### Step 4: Deploy

- Click "Deploy"
- Vercel will automatically:
  1. Install backend dependencies
  2. Run the build script (which installs frontend deps and builds React)
  3. Start the server

### 3. Verify Deployment

Test these endpoints:

```bash
# Health check
https://your-project.vercel.app/health

# API endpoint
https://your-project.vercel.app/api/products

# Frontend (should load React app)
https://your-project.vercel.app/
```

## Environment Configuration

### .env.production File (Backend)

Copy `.env.production.example` to `.env.production`:

```bash
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
NODE_ENV=production
CORS_ORIGIN=https://your-project.vercel.app
PAYPAL_CLIENT_ID=your_client_id_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend Configuration

The frontend uses environment variables from:
- Development: `amazon-frontend/.env` (for local development)
- Production: Backend serves frontend build, uses `REACT_APP_API_URL` from backend environment if needed

Current setup assumes API calls use relative paths:
```
/api/products → https://your-project.vercel.app/api/products
```

## Build Process

When you deploy to Vercel:

1. Backend `package.json` build script executes:
   ```bash
   npm run build  # Defined as: cd ../amazon-frontend && npm install && npm run build
   ```

2. This:
   - Changes to frontend directory
   - Installs frontend dependencies
   - Builds React app → generates `amazon-frontend/build/`

3. Backend server starts and serves:
   - API routes from `/api/*`
   - Static files from `amazon-frontend/build/`
   - SPA fallback (React Router compatibility)

## Development vs Production

### Local Development (localhost:3000 + localhost:5000)

Frontend (port 3000):
```bash
cd amazon-frontend
npm start
```

Backend (port 5000):
```bash
cd amazon-backend
npm run dev
```

Frontend proxy in `package.json` forwards API calls to backend.

### Production (Vercel)

Single domain:
```
https://your-project.vercel.app/
  ├── API: /api/* → Express routes
  └── Frontend: /* → React build (static files)
```

## Troubleshooting

### Issue: "Cannot GET /"
**Solution**: Ensure frontend build exists. Check Vercel logs for build errors.

### Issue: "404 on API routes"
**Solution**: Verify CORS_ORIGIN environment variable matches your Vercel URL.

### Issue: "Module not found" errors
**Solution**: Clear Vercel cache and redeploy:
- Project Settings > Git > Ignore Build Cache

### Issue: Frontend build too large
**Solution**: Optimize bundle size or increase Vercel resources.

## Redeployment

Push changes to your repository, and Vercel automatically:
1. Detects changes
2. Runs build script (rebuilds frontend)
3. Deploys new version

## Next Steps

1. Set up MongoDB Atlas for production database
2. Configure PayPal production credentials
3. Set up domain/custom domain in Vercel
4. Enable automatic deployments from GitHub
5. Monitor logs in Vercel Dashboard
