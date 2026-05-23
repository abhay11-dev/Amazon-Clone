# ShopNest Deployment Guide — Vercel

> Complete step-by-step instructions to deploy ShopNest to production on Vercel.

---

## **Prerequisites**

Before you start, make sure you have:

- ✅ MongoDB Atlas account with a production cluster running
- ✅ GitHub account with the ShopNest repository pushed
- ✅ Vercel account (https://vercel.com — sign up with GitHub for easier setup)
- ✅ All environment variables ready

---

## **STEP 1: Prepare MongoDB Atlas Connection String**

### Get your MongoDB URL

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Select your production cluster
4. Click **"Connect"**
5. Choose **"Connect your application"**
6. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/shopnest?retryWrites=true&w=majority
   ```
7. Replace `username`, `password`, and `cluster` with your actual values

**Save this** — you'll need it in the next steps.

---

## **STEP 2: Deploy Backend to Vercel**

### 2.1 Create a Vercel Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Find your ShopNest repository and click **"Import"**
5. When prompted, select the root directory as the project root

### 2.2 Configure Backend Environment Variables

1. You'll be taken to the **"Configure Project"** screen
2. Scroll to **"Environment Variables"**
3. Add these variables:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URL` | `mongodb+srv://...` (your Atlas URL from Step 1) |
| `JWT_SECRET` | Generate: `openssl rand -hex 32` (paste the result) |
| `CORS_ORIGIN` | Keep empty for now — you'll set this after frontend deployment |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX` | `100` |

4. Click **"Deploy"** — Vercel will start building

> **Wait 3-5 minutes** for the build to complete.

### 2.3 Get Your Backend URL

1. After deployment, you'll see a success screen
2. Your backend URL will look like:
   ```
   https://shopnest-backend-abhay.vercel.app
   ```
3. **Save this URL** — you need it for the frontend

### 2.4 Verify Backend Works

Open `https://your-backend-url/` in your browser. You should see:

```json
{
  "success": true,
  "message": "ShopNest - E-commerce Backend API",
  "version": "1.0.0"
}
```

**If you see an error about missing `CORS_ORIGIN`:**
- Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
- Add: `CORS_ORIGIN=http://localhost:3000` (temporary — we'll update this after frontend deploys)

---

## **STEP 3: Deploy Frontend to Vercel**

### 3.1 Create a New Vercel Project for Frontend

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Find your ShopNest repository again and click **"Import"**
4. This time, select **"amazon-frontend"** as the root directory

### 3.2 Configure Frontend Environment Variables

1. On the **"Configure Project"** screen, add:

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | `https://your-backend-url/api` (from Step 2.3) |

2. Click **"Deploy"** — Vercel will build the React app (takes 2-5 minutes)

### 3.3 Get Your Frontend URL

After deployment:
   ```
   https://shopnest-frontend-abhay.vercel.app
   ```

**Save this URL.**

---

## **STEP 4: Update Backend CORS Origin**

Now that both are deployed, configure CORS properly:

1. Go to Vercel dashboard → Backend project → **Settings** → **Environment Variables**
2. Find `CORS_ORIGIN` and update it to your **frontend URL**:
   ```
   https://shopnest-frontend-abhay.vercel.app
   ```
3. **Redeploy** the backend:
   - Click **Deployments** tab
   - Click the latest deployment
   - Scroll down and click **"Redeploy"**

The backend will redeploy in ~1-2 minutes with the correct CORS origin.

---

## **STEP 5: Test the Live Deployment**

### Test Backend

```bash
curl https://your-backend-url/health
```

Should return:
```json
{ "success": true, "message": "Server is running" }
```

### Test Frontend

1. Open `https://your-frontend-url` in your browser
2. You should see the ShopNest home page
3. Try these actions:
   - **Register**: Create a new account
   - **Browse**: View product listings (empty until seeded)
   - **Sign in**: Log in with your account
   - **Account**: Click account → edit profile → test password verification
   - **Network tab**: Open DevTools → Network tab to verify API calls go to your backend URL

### If you see "Cannot POST /api/users/register"

This means CORS isn't working. Go back to **STEP 4** and ensure:
- Backend `CORS_ORIGIN` matches your frontend URL exactly
- Backend was redeployed after changing CORS_ORIGIN
- Frontend `REACT_APP_API_URL` points to your backend URL with `/api` at the end

---

## **STEP 6: Seed Initial Products (Optional)**

To add sample products to your database:

### Option A: Via MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Select your cluster → **Collections**
3. Click **"Insert Document"** on the `categories` collection
4. Add sample categories and products manually

### Option B: Via API (Requires Admin User)

1. Make your test user an admin:
   - Go to MongoDB Atlas → Collections → `users`
   - Find your user document
   - Set `isAdmin: true`

2. Use Postman or curl to seed data:
   ```bash
   curl -X POST https://your-backend-url/api/products \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Product","price":99.99,"category":"Electronics"}'
   ```

---

## **STEP 7: Custom Domain (Optional)**

To use your own domain instead of vercel.app subdomain:

1. **For Backend:**
   - Vercel dashboard → Backend project → Settings → Domains
   - Add your domain (e.g., `api.shopnest.com`)
   - Follow Vercel's DNS instructions

2. **For Frontend:**
   - Vercel dashboard → Frontend project → Settings → Domains
   - Add your domain (e.g., `www.shopnest.com`)
   - Follow Vercel's DNS instructions

3. **Update CORS:**
   - Backend environment variable: `CORS_ORIGIN=https://www.shopnest.com`
   - Redeploy backend

---

## **Troubleshooting**

### Backend returns "Cannot GET /"

✅ **Solution:** Restart the deployment (redeploy)

### Frontend shows blank page

✅ **Solution:** 
- Check `REACT_APP_API_URL` in Vercel environment variables
- Verify it ends with `/api`
- Check DevTools console for errors

### API calls fail with 401 Unauthorized

✅ **Solution:** JWT_SECRET mismatch
- Backend `JWT_SECRET` must be the same on all instances
- If you changed it, redeploy

### "CORS: origin not allowed"

✅ **Solution:**
- Check backend `CORS_ORIGIN` environment variable
- Must match frontend URL exactly (including `https://`)
- Redeploy backend after changing

### MongoDB connection timeout

✅ **Solution:**
- Check `MONGO_URL` in Vercel environment variables
- Verify MongoDB Atlas cluster is running
- Check IP whitelist: Go to MongoDB Atlas → Network Access → add `0.0.0.0/0` (less secure but for development)

---

## **Security Notes for Production**

1. ✅ **Always use environment variables** — never hardcode secrets
2. ✅ **Keep JWT_SECRET random** — use `openssl rand -hex 32`
3. ✅ **Whitelist only your frontend domain** in CORS — don't use `*`
4. ✅ **Rotate passwords** — especially `MONGO_URL` and `JWT_SECRET` monthly
5. ✅ **Monitor logs** — Check Vercel dashboard for errors regularly
6. ✅ **Set up email notifications** — Vercel will alert you of deployment failures

---

## **Environment Variables Reference**

Keep these handy for any redeployments:

### Backend (.env.example)
```env
NODE_ENV=production
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/shopnest
JWT_SECRET=your-32-char-random-string
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

---

## **Next Steps After Deployment**

1. ✅ Test all user flows (register, sign in, add to cart, checkout, password change)
2. ✅ Monitor backend logs for errors
3. ✅ Add more products and categories
4. ✅ Test payment gateway (if integrated)
5. ✅ Set up email notifications (if available)
6. ✅ Back up MongoDB regularly

---

**Deployment Version:** 1.0.0 | **Date:** May 2026 | **Platform:** Vercel
