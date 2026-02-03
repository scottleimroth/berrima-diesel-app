# Berrima Diesel - Touring Tools

**Diesel Price Tracker & Heavy Vehicle Route Planner for Berrima Diesel Service.**

Working exclusively on diesel since 1956.

## Live Demo

**https://scottleimroth.github.io/berrima-diesel-app/**

## Features

### Diesel Price Finder
- Real-time diesel prices across NSW from FuelCheck API (3,200+ stations)
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
- **Fuel Prices**: NSW FuelCheck API (public endpoint)
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
