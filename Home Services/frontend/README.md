# HomeServicesEtc – Vue Frontend (SPA)

This is a Vue 3 + Vite frontend to pair with your existing Express/Mongo backend.

## Quick Start
```bash
cd client
npm install
cp .env.example .env
# set VITE_API_BASE_URL to your server (e.g. https://your-render-service.onrender.com)
npm run dev
```

## Pages
- Home (hero, latest jobs)
- Login / Register
- Poster Dashboard
- Tradie Dashboard (docs upload, subscriptions, browse/apply)
- Admin Dashboard (analytics, disputes, verification)

## Integrations
- Axios pre-configured with `VITE_API_BASE_URL`
- Pinia stores: auth, jobs, subscriptions
- Router lazy-loading

## Next Steps
- Wire each page to your existing API routes
- Add protected routes & role-based guards
- Replace sample components with real data & forms
