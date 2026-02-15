# Berrima Diesel - Touring Tools

[![Launch Web App](https://img.shields.io/badge/Launch-Web_App-blue?style=for-the-badge)](https://scottleimroth.github.io/berrima-diesel-app/)

**Cross-Platform Web App** — Works on desktop, tablet, and mobile. Installable as a PWA.

Diesel Price Tracker, Route Planner & Touring Tools for 4WD, Caravan & Motorhome travellers. Built by Berrima Diesel Service — working exclusively on diesel since 1956.

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

### Weather Forecast
- 7-day Australian forecast from Bureau of Meteorology data (via Open-Meteo)
- Current conditions: temperature, humidity, wind, UV index
- Location search and GPS support

### Bushfire & Emergency Info
- Live incident data from NSW Rural Fire Service
- Emergency warning, Watch & Act, and Advice alerts
- Links to all 8 state/territory fire services
- Auto-refreshes every 5 minutes

### Campground Finder
- Search campgrounds and caravan parks from OpenStreetMap
- Filter by: free/paid, toilets, water, power, pet-friendly, showers
- Distance-based search with adjustable radius

### Rest Areas
- Find roadside rest stops and lay-bys
- Facility info: toilets, water, shelter, picnic tables, BBQ
- Driver fatigue tips

### Tyre Pressure Calculator
- Recommended pressures for highway, gravel, sand, mud, and rock
- Adjusts for temperature, altitude, and towing load
- Presets for popular 4WD tyres (BFG KO2, Cooper AT3, Toyo AT3, etc.)

### Weight Distribution Calculator
- GVM and GCM compliance checking
- Visual progress bars with overweight warnings
- Vehicle presets for popular 4WDs (LandCruiser, HiLux, Ranger, Patrol, etc.)
- Payload breakdown with accessories, cargo, passengers, and towing

### Dump Points
- Find sanitary dump stations for RVs, caravans, and motorhomes
- Data from OpenStreetMap (grey water, chemical toilet, cassette)
- Filter by free/paid, adjustable search radius

### Fuel Economy Tracker
- Log fill-ups with odometer, litres, cost, and station
- Calculates L/100km between full-tank fill-ups
- Tracks best, worst, and average economy plus total spending

### Solar Panel Estimator
- Calculate daily solar production vs power consumption
- Panel and battery presets for common touring setups
- Australian peak sun hours by region
- Add common or custom power loads (fridge, lights, Starlink, CPAP, etc.)

### Vehicle Service Tracker
- Log oil changes, services, tyre rotations, and more
- Service reminders by km and time interval
- Vehicle presets for popular 4WDs (LandCruiser, HiLux, Ranger, Patrol, etc.)

### Trip Journal
- Record daily travel entries with location, rating, tags, and notes
- Track distance via odometer readings
- Edit, delete, and expand entries

### Towing Speed Limits
- State-by-state speed limits for vehicles towing trailers/caravans
- Quick reference table plus detailed state rules
- SA is the only state with a specific 100 km/h towing limit

### Pre-Trip Checklists
- Vehicle, caravan, packing, and campsite setup checklists
- Add custom items, progress saved to localStorage
- Reset individual lists or all at once

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Maps**: Leaflet.js
- **Routing**: HERE Platform API (weight-aware routing for caravans & motorhomes)
- **Fuel Prices**: NSW FuelCheck, QLD Open Data CKAN, VIC Servo Saver, WA FuelWatch RSS, TAS FuelCheck
- **Weather**: Open-Meteo BOM API
- **Bushfires**: NSW RFS GeoJSON feed
- **Campgrounds/Rest Areas**: OpenStreetMap Overpass API
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
