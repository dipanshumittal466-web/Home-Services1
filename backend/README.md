# HomeServicesEtc Dynamic (Render Ready)

Full-stack dynamic features included:
- Auth (register/login, JWT)
- Job posting & applications
- Real-time chat (Socket.io)
- Document upload & verification (multer)
- Notifications
- EJS pages + CSS
- MongoDB via Mongoose

## Setup
1) Copy `.env.example` to `.env` and set:
- MONGODB_URI=...
- JWT_SECRET=...
- ORIGIN=https://your-site.onrender.com (or http://localhost:10000 for local)

2) Install & Run
```
npm install
npm start
```

Open http://localhost:10000

## Deploy to Render
- Create a Node Web Service
- Build: `npm install`
- Start: `npm start`
- Add Environment:
  - MONGODB_URI
  - JWT_SECRET
  - ORIGIN


## Payments (Stripe)
- Set STRIPE keys and PRICE IDs in `.env`
- `POST /api/payments/create-checkout-session` for subscriptions
- `POST /api/payments/create-payment-intent` for one-time verification fee
- Add webhook endpoint `/api/payments/webhook` to Stripe Dashboard

## Storage (S3 / Cloudinary)
- Choose provider via `STORAGE_PROVIDER=s3|cloudinary`
- Set respective credentials in `.env`

## Admin Panel
- Visit `/admin` for verification approvals and overviews.

