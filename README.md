# Berrima Diesel - Touring Tools

[![Launch Web App](https://img.shields.io/badge/Launch-Web_App-blue?style=for-the-badge)](https://scottleimroth.github.io/berrima-diesel-app/)

**Cross-Platform Web App** — Works on desktop, tablet, and mobile. Installable as a PWA.

Diesel Price Tracker & 4WD, Caravan & Motorhome Route Planner for Berrima Diesel Service. Working exclusively on diesel since 1956.

---

## Available Platforms

| Platform | How to Get It |
|----------|---------------|
| Web App | [Launch in browser](https://scottleimroth.github.io/berrima-diesel-app/) — no install needed |
| Mobile (PWA) | Open the link above on your phone and tap "Add to Home Screen" |

## Features

### Diesel Price Finder
- Diesel prices across NSW, ACT, QLD, VIC, WA, and TAS (8,300+ stations)
- NSW/ACT: Real-time via FuelCheck API
- QLD: Monthly via Open Data
- VIC: 24h delayed via Servo Saver API
- WA: Daily via FuelWatch
- TAS: Real-time via TAS FuelCheck
- State selector or search all states at once
- Sort by price or distance, filter by radius
- Map and list views
- Price alerts and station bookmarking

### 4WD, Caravan & Motorhome Route Planner
- Weight-aware routing via HERE Routing API
- Vehicle presets (4WD + Caravan, Motorhome, Campervan, etc.)
- Avoid tolls, ferries, and unpaved roads
- Fuel consumption calculator
- Turn-by-turn directions
- Save favourite routes

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Maps**: Leaflet.js
- **Routing**: HERE Platform API (weight-aware routing for caravans & motorhomes)
- **Fuel Prices**: NSW FuelCheck API, QLD Open Data CKAN API, VIC Servo Saver API, WA FuelWatch RSS, TAS FuelCheck API
- **Styling**: Australian heritage color scheme (Berrima sandstone, ochre, eucalyptus)

## Local Development

```bash
cd frontend/web
npm install
npm run dev
```

Create a `.env` file in `frontend/web/`:

```env
VITE_HERE_API_KEY=your_here_api_key
VITE_NSW_FUEL_API_KEY=optional_not_currently_used
VITE_DEFAULT_LAT=-34.4794
VITE_DEFAULT_LNG=150.3369
```

## Deployment

Automatically deployed to GitHub Pages on push to `main` via GitHub Actions.

---

*Berrima Diesel Service - 3483 Old Hume Hwy, Berrima NSW 2577 - (02) 4877 1256*
