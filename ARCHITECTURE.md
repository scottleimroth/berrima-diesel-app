# Berrima Diesel Touring Tools - System Architecture

## Overview

A Progressive Web App (PWA) providing diesel price tracking across multiple Australian states and weight-aware route planning for 4WD, caravan, and motorhome travellers. Built with React + Vite, deployed to GitHub Pages. All processing is client-side with direct API calls to government fuel data sources and HERE routing.

---

## Architecture Diagram

```
┌─────────────────────────────┐
│       React PWA Client      │
│  (Vite + Tailwind + Leaflet)│
│  Hosted on GitHub Pages     │
└──────────┬──────────────────┘
           │
     ┌─────┴─────┬──────────────┬──────────────┐
     ▼           ▼              ▼              ▼
┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────────┐
│ NSW     │ │ WA      │ │ QLD      │ │ TAS         │
│FuelCheck│ │FuelWatch│ │ Open Data│ │ FuelCheck   │
│ API     │ │ RSS     │ │ CKAN API │ │ API         │
└─────────┘ └─────────┘ └──────────┘ └─────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ HERE Platform│
            │ Routing API  │
            │ (weight-     │
            │  aware)      │
            └──────────────┘
```

---

## Technology Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (heritage color scheme)
- **Maps:** Leaflet.js
- **Routing:** HERE Platform API (weight-aware for caravans/motorhomes)

### Fuel Price Sources
- **NSW:** FuelCheck API (real-time)
- **WA:** FuelWatch RSS (daily)
- **QLD:** Open Data CKAN API (monthly)
- **TAS:** FuelCheck API (real-time)

### Deployment
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions (auto-deploy on push to main)

---

## Component Structure

```
berrima-diesel-app/
├── frontend/
│   └── web/
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── services/      # API integrations
│       │   └── assets/        # Static assets
│       ├── .env               # Local env vars (gitignored)
│       ├── package.json
│       └── vite.config.js
├── README.md
├── ARCHITECTURE.md
├── TODO.md
├── SECURITY_AUDIT.md
├── CREDENTIALS.md             # .gitignored
└── .gitignore
```

---

## Key Workflows

### Diesel Price Search
1. User selects state(s) or searches all
2. App queries relevant fuel API(s) for diesel prices
3. Results displayed in list and map views
4. User can sort by price or distance, filter by radius

### Route Planning
1. User selects vehicle preset (4WD + Caravan, Motorhome, etc.)
2. Enters origin and destination
3. HERE API calculates weight-aware route (avoiding low bridges, restricted roads)
4. Route displayed on map with turn-by-turn directions
5. Fuel consumption estimated based on vehicle type and distance

---

## Security Considerations

- **API Keys:** HERE API key loaded via environment variable (VITE_HERE_API_KEY)
- **Government APIs:** NSW, WA, QLD, TAS fuel APIs are public
- **No user data stored server-side:** All preferences in browser localStorage
- **HTTPS:** GitHub Pages enforces HTTPS

---

## Deployment

- **Development:** `npm run dev` in frontend/web/
- **Production:** Push to main triggers GitHub Actions deploy to GitHub Pages
- **Domain:** scottleimroth.github.io/berrima-diesel-app/

---

**Last Updated:** 2026-02-10
