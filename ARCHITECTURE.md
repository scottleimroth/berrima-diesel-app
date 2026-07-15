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

### Payphones & Postboxes
1. User opens `/payphones-postboxes` from the Touring Tools "Find Nearby" section
2. The page embeds `https://payphones.scottleimroth.com/` in an iframe
3. The Aussie Payphones repo remains the source of truth for Telstra payphones, Telstra Wi-Fi hotspots, and Australia Post postbox data
4. Users can open the full map in a new tab if the embedded view is too small on mobile

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
- **Embedded traveller map:** CSP allows framing only `https://payphones.scottleimroth.com` for the payphones/postboxes tool

---

## Deployment

- **Development:** `npm run dev` in frontend/web/
- **Production:** Push to main triggers GitHub Actions deploy to GitHub Pages
- **Domain:** app.berrimadiesel.com

---

## Change Notes

### 2026-07-15 - Payphones & Postboxes Integration

The Touring Tools PWA now includes `/payphones-postboxes`, an embedded/link-out view of the Aussie Payphones map. This was intentionally implemented as a canonical iframe integration rather than importing the GeoJSON into this repo, so Telstra and Australia Post refresh behaviour stays in `aussie-payphones`.

Validation expected for this feature:
- `npm run build` in `frontend/web`
- Local browser check that `/payphones-postboxes` loads the branded page
- Local browser check that the iframe renders `payphones.scottleimroth.com`

**Last Updated:** 2026-07-15
