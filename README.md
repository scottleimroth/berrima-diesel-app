# Berrima Diesel - Touring Tools

[![Launch App](https://img.shields.io/badge/Launch-Touring_Tools-blue?style=for-the-badge)](https://scottleimroth.github.io/berrima-diesel-app/)

Diesel Price Tracker & Heavy Vehicle Route Planner for Berrima Diesel Service. Working exclusively on diesel since 1956.

> Installable as a mobile app — open the link above on your phone and tap "Add to Home Screen".

## Features

### Diesel Price Finder
- Diesel prices across NSW, WA, QLD, and TAS (5,000+ stations)
- NSW: Real-time via FuelCheck API | WA: Daily via FuelWatch | QLD: Monthly via Open Data | TAS: Real-time via TAS FuelCheck
- State selector or search all states at once
- Sort by price or distance, filter by radius
- Map and list views
- Price alerts and station bookmarking

### Heavy Vehicle Route Planner
- Truck-safe routing via HERE Routing API
- Vehicle dimension presets (4WD + Caravan, Motorhome, B-Double, etc.)
- Avoid tolls, ferries, and unpaved roads
- Fuel consumption calculator
- Turn-by-turn directions
- Save favourite routes

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Maps**: Leaflet.js
- **Routing**: HERE Platform API (truck routing)
- **Fuel Prices**: NSW FuelCheck API, WA FuelWatch RSS, QLD Open Data CKAN API, TAS FuelCheck API
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
