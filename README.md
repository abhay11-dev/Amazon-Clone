# ShopNest — Full-Stack E-Commerce Platform

> MERN Stack · v1.0.0 · Production Ready · May 2026

---

## Overview

This is a full-stack e-commerce app built on the MERN stack — MongoDB, Express, React 18, and Node.js. It covers everything you'd expect from a shopping platform: product catalog with search and filtering, cart, multi-step checkout, order history, reviews, and wishlists. The backend is a REST API with JWT auth, rate limiting, and request validation. The frontend is a Redux-managed React app using Material-UI v5.

Version 1.0.0 features a complete MERN stack implementation with Redux Toolkit state management, Material-UI v5 components, and production-ready security.

### What's new in v2.0.0

- React 18 with Redux Toolkit replacing legacy Redux patterns
- Material-UI v5 — component API changes from v4 are significant, check the migration guide if you're upgrading an existing project
- Cart now persists across sessions (stored server-side on the user record)
- Wishlist and review endpoints fully wired up end-to-end
- Helmet + rate limiting added to the Express layer
- `express-validator` on every mutating route

---

## Features

### Product Catalog

Products paginate at 12 per page. Search runs against name and description fields. Filters stack — category, price range, and minimum rating can all be combined. Sort options cover price (asc/desc), rating, and newest-first. Product detail pages include an image carousel and a specs table.

### Cart

Cart state lives on the server tied to the user account, so it survives browser refreshes and re-logins. Quantity updates are real-time. The summary recalculates tax (8% flat) and shipping on each change.

### Checkout and Orders

Checkout runs three steps: shipping address → payment method → order confirmation. Payment options are Cash on Delivery and card (card is a placeholder — wire in Stripe or PayPal as needed). Orders get a unique ID on creation. Users can cancel orders that haven't shipped.

### Auth and User Management

Registration requires email, password (min 8 chars, at least one number), and display name. Passwords are hashed with bcryptjs at 10 salt rounds. JWTs expire after 7 days. Profile updates and password changes are separate endpoints.

### Reviews

One review per user per product. Reviews show a verified purchase badge if the reviewer has an order containing that item. Other users can vote reviews as helpful. Admins can delete any review.

### Wishlist

Wishlist is per-user and persists server-side. A move-to-cart action transfers a product from wishlist to cart in a single request.

### Security

| Measure | Detail |
|---|---|
| Password hashing | bcryptjs, 10 salt rounds |
| Authentication | JWT, 7-day expiry |
| Rate limiting | 100 requests / 15 min / IP |
| CORS | Restricted to configured origins |
| Security headers | Helmet |
| Input validation | express-validator on all POST/PUT routes |

---

## Tech Stack

### Backend

| Package | Version |
|---|---|
| Express | 4.18.2 |
| Mongoose | 7.x |
| bcryptjs | 2.4.3 |
| jsonwebtoken | 9.x |
| express-validator | 7.x |
| helmet | 7.x |
| morgan | 1.10.x |
| express-rate-limit | 6.x |

### Frontend

| Package | Version |
|---|---|
| React | 18.2 |
| Redux Toolkit | 1.9.x |
| React Router | v6 |
| Material-UI | v5 |
| Axios | 1.x |
| Framer Motion | 10.x |
| React Slick | 0.29.x |

---

## Project Structure

```
shopnest/
├── shopnest-backend/
│   ├── controllers/        # Route handlers — one file per resource
│   ├── models/             # Mongoose schemas
│   ├── routers/            # Express routers, maps paths to controllers
│   ├── middlewares/        # Auth middleware, error handler, validators
│   ├── utils.js            # Shared helpers (token generation, etc.)
│   ├── server.js           # Entry point, Express setup, DB connection
│   ├── .env.example        # Copy this to .env before starting
│   └── package.json
│
├── shopnest-frontend/
│   ├── src/
│   │   ├── components/     # Shared UI components (Navbar, ProductCard, etc.)
│   │   ├── pages/          # Page-level components (Home, Product, Cart, etc.)
│   │   ├── redux/          # Store config, slices, async thunks
│   │   ├── services/       # Axios instance, API helper functions
│   │   ├── hooks/          # Custom hooks (useDebounce, useCart, etc.)
│   │   ├── constants/      # App-wide constants (routes, categories, etc.)
│   │   ├── utils/          # Pure helper functions
│   │   └── styles/         # Global CSS and theme overrides
│   ├── public/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- MongoDB 7.x (local or Atlas)

The app won't run on older Node versions — some syntax used in the backend requires Node 18 minimum.

### 1. Clone

```bash
git clone <repository-url>
cd shopnest
```

### 2. Backend

```bash
cd shopnest-backend
cp .env.example .env
# Edit .env — see Environment Variables below
npm install
npm run dev
```

Server starts on `http://localhost:5000`. Watch the console — if MongoDB isn't reachable it'll throw immediately.

### 3. Frontend

```bash
cd shopnest-frontend
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start
```

Opens at `http://localhost:3000`. Hot reload is on by default.

---

## Environment Variables

### Backend — `shopnest-backend/.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/shopnest
JWT_SECRET=your-random-string-minimum-32-characters
JWT_REFRESH_SECRET=another-random-string
CORS_ORIGIN=http://localhost:3000
PAYPAL_CLIENT_ID=your-paypal-id
```

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URL` | Yes | Full MongoDB connection string |
| `JWT_SECRET` | Yes | Min 32 chars — use `openssl rand -hex 32` |
| `CORS_ORIGIN` | Yes | Must exactly match frontend URL, no trailing slash |
| `PORT` | No | Defaults to 5000 |
| `PAYPAL_CLIENT_ID` | No | Only needed if wiring up PayPal checkout |

### Frontend — `shopnest-frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## API Reference

All endpoints return JSON. Auth-required routes expect an `Authorization: Bearer <token>` header. Admin routes also check the `isAdmin` flag on the user record.

### Users — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | None | Create new account |
| POST | `/signin` | None | Returns JWT |
| POST | `/logout` | None | Clears session |
| GET | `/profile` | User | Fetch own profile |
| PUT | `/profile` | User | Update name, email |
| GET | `/` | Admin | All users |
| DELETE | `/:id` | Admin | Delete user |

### Products — `/api/products`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | None | Paginated list |
| GET | `/search` | None | Text search |
| GET | `/filter` | None | Category, price, rating filters |
| GET | `/category/:slug` | None | Products in a category |
| GET | `/similar/:id` | None | Related products |
| GET | `/:id` | None | Single product detail |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Cart — `/api/cart`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | User | Fetch cart |
| POST | `/add` | User | Add product, specify quantity |
| PUT | `/update` | User | Change quantity |
| DELETE | `/remove/:productId` | User | Remove line item |
| DELETE | `/clear` | User | Empty cart |

### Orders — `/api/orders`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | User | Create order from cart |
| GET | `/mine` | User | User's order history |
| GET | `/` | Admin | All orders |
| GET | `/:id` | User | Order detail |
| PUT | `/:id/pay` | User | Mark as paid |
| PUT | `/:id/deliver` | Admin | Mark as delivered |
| DELETE | `/:id` | User | Cancel — pre-delivery only |

### Wishlist — `/api/wishlist`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | User | Fetch wishlist |
| POST | `/add` | User | Add product |
| DELETE | `/remove/:productId` | User | Remove product |
| GET | `/check/:productId` | User | Check if saved |
| PUT | `/move-to-cart/:productId` | User | Transfer to cart |

### Reviews — `/api/reviews`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | User | Create review |
| GET | `/:productId` | None | Product reviews |
| PUT | `/:reviewId` | User | Edit own review |
| DELETE | `/:reviewId` | User/Admin | Delete review |
| PUT | `/:reviewId/helpful` | User | Vote helpful |

### Categories — `/api/categories`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | None | All categories |
| GET | `/:slug` | None | Category by slug |
| POST | `/` | Admin | Create category |
| PUT | `/:id` | Admin | Update category |
| DELETE | `/:id` | Admin | Delete category |

---

## Database

MongoDB 7.x with Mongoose. Single database — `shopnest` by default.

| Collection | Key Fields | Indexes |
|---|---|---|
| `users` | email, isAdmin, createdAt | email (unique) |
| `products` | name, category, price, rating | name text, category, price |
| `orders` | user, status, createdAt | user, createdAt |
| `cart` | user, items.product | user (unique) |
| `wishlist` | user, products | user (unique) |
| `reviews` | product, user, rating | product, user |
| `categories` | name, slug | slug (unique) |

---

## Troubleshooting

| Error | Likely Cause | Fix |
|---|---|---|
| `MongoServerSelectionError: connect ECONNREFUSED` | MongoDB not running | Start `mongod`; check `MONGO_URL` in `.env` |
| CORS error in browser | Origin mismatch | Set `CORS_ORIGIN` to exact frontend URL — no trailing slash |
| JWT invalid / expired | Token issue | Clear localStorage, sign in again; verify `JWT_SECRET` |
| `EADDRINUSE: address already in use :::5000` | Port conflict | `lsof -i :5000` then `kill -9 <PID>` |
| npm install fails with engine error | Old Node version | `nvm install 18 && nvm use 18` |
| White screen on frontend | Wrong API URL | Check `REACT_APP_API_URL` in frontend `.env` |

---

## Deployment

### Frontend — Vercel

1. Push repository to GitHub
2. Connect to Vercel, set the root to `shopnest-frontend`
3. Add `REACT_APP_API_URL` pointing to your production backend
4. Deploy — Vercel rebuilds on every push to `main`

### Backend — Railway or Render

1. Create account, connect GitHub repo
2. Set root directory to `shopnest-backend`
3. Set start command: `node server.js`
4. Add all variables from `.env.example`
5. Deploy — restarts automatically on push

### Database — MongoDB Atlas

1. Create a free or paid cluster
2. Create a database user with readWrite access
3. Whitelist your backend service IP (or `0.0.0.0/0` for all — less secure)
4. Copy the connection string into `MONGO_URL`

---

## Performance

| Metric | Target | Notes |
|---|---|---|
| Page load | < 2s | Measured on fast 3G in Lighthouse |
| API response | < 200ms | Excludes DB cold start on free hosting tiers |
| Search debounce | 500ms | Configured in `useDebounce` hook |
| Rate limit | 100 req / 15 min | Per IP, applied globally |
| JWT expiry | 7 days | No refresh token flow by default |

---

## What's Not Done Yet

These features are stubbed or planned but not implemented in v2.0.0:

- Email notifications — no mailer configured
- PayPal / Stripe — card checkout is a placeholder UI only
- Bulk product import — no CSV or spreadsheet upload
- Admin analytics dashboard — order data exists, no reporting view
- PWA / service worker — not set up
- SMS alerts
- Inventory tracking (stock levels)
- Shipping carrier integration
- Mobile app (React Native)

---

## Test Credentials

```
Email:    test@example.com
Password: Test@12345
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

MIT License — open for personal and commercial use.

---

**Version:** 1.0.0 &nbsp;|&nbsp; **Last Updated:** May 2026 &nbsp;|&nbsp; **Status:** Production Ready