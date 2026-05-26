# E-Commerce (React + Node/Express + JazzCash)

Single-repo project containing:
- **Backend**: Express API (JWT auth + Orders/Products + JazzCash checkout + JazzCash webhook/IPN)
- **Frontend**: React (Vite) SPA with admin dashboard + user storefront

---

## Project Structure

```text
.
├─ backened/               # Node/Express backend
│  ├─ server.mjs          # API entrypoint
│  ├─ routes/             # API routes
│  ├─ database/           # mongoose models + controllers
│  ├─ middleware/         # auth
│  └─ utils/              # integrations (email, JazzCash, etc.)
│
├─ frontend/              # React (Vite) frontend
│  ├─ src/                # React app + components
│  ├─ pages/             # Route-level page components
│  └─ public/            # static assets
└─ README.md              # single source of truth for deployment/docs
```

---

## Backend (backened)

### Runtime
- Entry: `backened/server.mjs`
- Express + dotenv + mongoose
- CORS enabled
- JSON/urlencoded body limits: `50mb`

### JWT Auth
Auth middleware: `backened/middleware/isAuthenticated.js`
- Reads JWT from headers: `Authorization: Bearer <token>` or `token` or `access_token`
- Verifies using env secret (supports both `JWT_SECRET` and `SECRET_KEY`, with fallback)

> Production note: standardize a single env var for JWT secret.

### API Base
Mounted by `backened/server.mjs` under:
- `/api/v1/users`
- `/api/v1/products`
- `/api/v1/admin`
- `/api/v1/orders`
- `/api/v1/orders/jazzcash`

### Important Routes

#### JazzCash
`backened/routes/jazzcashRoutes.js` (mounted at `/api/v1/orders/jazzcash`)
- **POST** `/callback`
  - Handler: `backened/database/controllers/jazzcashController.js#handleJazzCashCallback`
  - Marks order paid/failed and updates stock on failure.
  - Hash verification: if `JAZZCASH_INTEGRITY_SALT` is set and JazzCash sends `pp_SecureHash`, it verifies integrity.

- **POST** `/initiate-jazzcash`
  - Handler: `backened/database/controllers/orderController.js#initiateJazzcashPayment`
  - Auth bypass in **test mode**:
    - If request body `paymentToken === 'test123'`, it skips auth and initiates payment.
  - Otherwise it runs `isAuthenticated` then initiates payment.

> Frontend checkout sends `paymentToken` and uses the above test mode values.

#### Orders (User)
`backened/routes/orderRoutes.js` (mounted at `/api/v1/orders`)
- **POST** `/` → create order (auth required)
- **GET** `/my-orders` → list my orders (auth required)
- **GET** `/:id` → get order by id (auth required)

### Non-production Helper Endpoint
- **GET** `/test-email`
  - Sends a test OTP email via `backened/utils/emailService.js`

> Production note: remove/disable this endpoint in production deployments.

### PM2 (Production)
PM2 config: `backened/ecosystem.config.cjs`
- Cluster mode: `instances: 'max'`
- `PORT: 8000`
- Logs configured under `backened/logs/`

---

## Frontend (frontend)

### Runtime
- React app (Vite)
- Routing: `react-router-dom` (`createBrowserRouter`)

### Key Routes
Defined in `frontend/src/App.jsx` with pages from `frontend/pages/*`:
- `/`, `/home`
- `/products`, `/products/:id`
- `/signup`, `/login`, `/verify`
- `/cart`, `/profile`
- Admin: `/admin/*`
- `/checkout`
- `/payment-success/:orderNumber`

### JazzCash Checkout UI
`frontend/pages/Checkout.jsx`
- Collects shipping address + JazzCash **payment token**
- Calls backend:
  - `POST http://localhost:8000/api/v1/orders/jazzcash/initiate-jazzcash`

---

## Environment Variables (.env)

### Backend env (backened/.env)
Create `backened/.env`.

Minimum recommended variables:
- **Server**: `PORT` (PM2 uses `8000`)
- **JWT auth**: `JWT_SECRET` (recommended) OR `SECRET_KEY` (supported)
- **Email (OTP/test-email)**: `MAIL_USER`, `MAIL_PASS`
- **JazzCash**:
  - `JAZZCASH_MERCHANT_ID`
  - `JAZZCASH_PASSWORD`
  - `JAZZCASH_INTEGRITY_SALT`
  - `JAZZCASH_RETURN_URL`

> Current server prints some env debug values at boot. Remove/guard debug logs for production.

---

## Deployment / Production Readiness

### Backend deployment
1. Create `backened/.env`
2. Install deps:
   - `cd backened && npm install`
3. Start with PM2:
   - `pm2 start ecosystem.config.cjs --env production`
4. Ensure logs directory exists:
   - `backened/logs/`

### Frontend deployment
1. Install deps:
   - `cd frontend && npm install`
2. Build:
   - `npm run build`
3. Serve `frontend/dist` with your hosting (or use a reverse proxy).

### Hardening checklist
- Remove/disable `GET /test-email`
- Standardize JWT secret env var
- Validate JazzCash callback payload/hash verification against real gateway spec
- Remove/guard boot-time console logs
- Add rate limiting for public endpoints

---

## Notes on Cleanup
This README is the **single source of truth** for the project.

