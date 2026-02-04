# Berrima Diesel Touring Tools - Development Log & TODO

## Last Session

- **Date:** 2026-02-04
- **Summary:** Researched and planned comprehensive feature expansion for diesel touring app
- **Key changes:**
  - Added launch badge to README.md
  - Created SECURITY_AUDIT.md with project-specific audit
  - Researched Australian APIs for diesel touring features
  - Wrote comprehensive phased development roadmap
- **Stopped at:** Roadmap complete, ready to pick a phase and start building
- **Blockers:** None — all planned APIs are publicly accessible or free-tier

---

## Current Status

### Working Features
- **Diesel Price Tracker** — Live NSW prices from FuelCheck API (3,200+ stations), map/list views, price alerts, bookmarks, radius filter
- **Heavy Vehicle Route Planner** — HERE Routing API with truck-safe routing, vehicle presets, avoid options, fuel consumption calc, turn-by-turn, saved routes
- **PWA** — Installable on Android/iOS, offline caching, fullscreen mode
- **GitHub Pages Deployment** — Auto-deploys on push to main via GitHub Actions

### Known Issues
- HERE Autosuggest API returns 400 errors sometimes (geocoding fallback works)
- Some FuelCheck station prices may be weeks old (data quality issue upstream)

---

## Development Roadmap

### Phase 1: National Diesel Prices
Expand diesel price coverage from NSW-only to all Australian states. Each state has its own API/data source.

1. [ ] **Queensland diesel prices** — QLD Open Data Portal
   - API: `https://www.data.qld.gov.au/dataset/fuel-price-reporting`
   - Format: JSON REST API, free, no auth required
   - Data: Real-time fuel prices reported by stations across QLD
   - Implementation: New service `qldFuelApi.js`, merge results into existing fuel tracker UI
   - Filter for diesel (DL/PDL) fuel types only

2. [ ] **Western Australia diesel prices** — FuelWatch WA
   - API: `https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS`
   - Format: RSS/XML feed, free, no auth required
   - Data: Tomorrow's and today's fuel prices, updated daily
   - Implementation: XML parser service `waFuelApi.js`, convert to common price format
   - Note: Prices are set day-ahead (unique to WA regulated market)

3. [ ] **Victoria diesel prices** — Servo Saver / Victorian fuel data
   - API: Victorian fuel comparison service
   - Format: JSON, may need reverse-engineering or scraping
   - Implementation: Service `vicFuelApi.js` with appropriate parsing
   - Research required: Confirm current public endpoint availability

4. [ ] **Tasmania diesel prices** — Extends NSW FuelCheck coverage
   - API: NSW FuelCheck V2 may include TAS stations
   - Implementation: Extend existing `nswFuelApi.js` or create `tasFuelApi.js`
   - Research required: Confirm TAS coverage in FuelCheck data

5. [ ] **South Australia diesel prices** — SA fuel pricing
   - Research required: Identify available API or data source
   - May require scraping or Freedom of Information data
   - Implementation: Service `saFuelApi.js` if data source found

6. [ ] **Northern Territory diesel prices** — NT fuel pricing
   - Research required: Limited data availability expected
   - MyFuel NT app may have accessible endpoints
   - Implementation: Service `ntFuelApi.js` if data source found

7. [ ] **Unified fuel price interface** — Combine all state data
   - Merge all state APIs into single price feed
   - Common data format: `{ stationId, name, lat, lng, price, fuelType, updatedAt, state, source }`
   - State selector in UI (default to user's location)
   - Cross-border price comparison near state boundaries
   - Handle different update frequencies (real-time NSW vs daily WA)

8. [ ] **Fuel stops along route** — Show cheapest diesel along planned routes
   - Query fuel prices within corridor of planned route
   - Suggest optimal fuel stops based on tank range and prices
   - Factor in detour distance vs price savings
   - Integration with existing route planner

---

### Phase 2: Touring Infrastructure
Essential services and facilities for diesel vehicle tourers.

9. [ ] **Rest areas database** — National Heavy Vehicle Rest Areas
   - API: National Freight Data Hub / data.gov.au
   - URL: `https://data.gov.au/dataset/` (search "rest areas" or "heavy vehicle")
   - Data: Locations, facilities (toilets, water, shade, parking bays), vehicle size limits
   - Implementation: New page `RestAreas.jsx` with map markers and list view
   - Filter by facilities, distance from route, vehicle size suitability

10. [ ] **Dump points locator** — Caravan/motorhome waste disposal
    - API: National Public Toilet Map + community databases
    - URL: `https://toiletmap.gov.au/api/` (Australian Government)
    - Data: Dump point locations, types (black water, grey water), access restrictions
    - Supplement with: Camps Australia Wide data, WikiCamps community data
    - Implementation: Page `DumpPoints.jsx` with map, filter by type

11. [ ] **Campground finder** — Free camps and caravan parks
    - API: OpenStreetMap Overpass API for campground POIs
    - URL: `https://overpass-api.de/api/interpreter`
    - Query: `node["tourism"="camp_site"](bbox);` for campgrounds in area
    - Data: Name, location, facilities, cost (free/paid)
    - Supplement with: Camps Australia Wide, WikiCamps
    - Implementation: Page `Campgrounds.jsx` with map and filters
    - Filter by: free/paid, pet-friendly, powered sites, dump point on-site

12. [ ] **Pet-friendly camping filter**
    - Add pet-friendly attribute to campground data
    - Filter campgrounds by pet policy (dogs allowed, on-lead, off-lead areas)
    - Source: OSM tags, community databases, park websites
    - Implementation: Filter toggle on campground finder page

13. [ ] **Water points and potable water** — Drinking water refill locations
    - Source: National Public Toilet Map (many list water availability)
    - Source: OSM nodes tagged `amenity=drinking_water`
    - Implementation: Layer on existing map or dedicated section
    - Show distance from current location or along route

14. [ ] **Gas bottle refill locator** — LPG/camping gas refill stations
    - Source: LPG station data from fuel price APIs (filter for LPG fuel type)
    - Source: OSM nodes tagged `fuel:lpg=yes` or `shop=gas`
    - Source: Swap'n'Go locator data
    - Implementation: Map layer showing LPG/gas refill points
    - Filter by: refill vs swap, bottle sizes accepted

---

### Phase 3: Safety & Conditions
Real-time safety information for touring.

15. [ ] **Weather forecasts along route** — BOM weather via Open-Meteo
    - API: Open-Meteo (free, no auth, uses BOM data for Australia)
    - URL: `https://api.open-meteo.com/v1/bom`
    - Data: Temperature, rain, wind, UV index, storm warnings
    - Implementation: Weather overlay on route planner
    - Show weather at waypoints along planned route
    - Highlight severe weather warnings

16. [ ] **Road conditions** — State road authority feeds
    - NSW: Live Traffic NSW API (`https://www.livetraffic.com/`)
    - QLD: QLDTraffic API (`https://qldtraffic.qld.gov.au/`)
    - VIC: VicRoads / Regional Roads Victoria
    - WA: Main Roads WA travel map
    - Implementation: Road closure/incident markers on route map
    - Alert if planned route has current closures or incidents
    - Show flood/fire road closures

17. [ ] **Bushfire information** — Emergency fire feeds
    - API: NSW RFS GeoJSON feed for current fires
    - URL: `https://www.rfs.nsw.gov.au/feeds/majorIncidents.json`
    - Similar feeds available from CFA (VIC), QFES (QLD), DFES (WA)
    - Implementation: Fire incident markers on map with danger ratings
    - Total fire ban day alerts
    - Smoke/air quality warnings

18. [ ] **Flood warnings** — BOM flood data
    - API: BOM warning feeds (RSS/JSON)
    - Data: Current flood warnings by river catchment
    - Implementation: Flood warning overlay on map
    - Alert if route passes through flood-warned area

19. [ ] **Water crossing depth database**
    - Source: Community-contributed crossing data
    - Source: State road authority depth indicators
    - Source: OSM ford/crossing data (`highway=ford`)
    - Implementation: Map markers for known water crossings
    - Show: typical depth, last reported depth, seasonal notes
    - Warning system for crossings after rain events
    - Link to upstream river gauge data (BOM)

20. [ ] **Mobile coverage maps** — Telco coverage overlay
    - Source: Telstra/Optus/Vodafone published coverage maps
    - Alternative: RFNSA tower location database (`https://www.rfnsa.com.au/`)
    - Implementation: Coverage overlay on map (toggle by carrier)
    - Show dead zones along planned route
    - Highlight sections with no coverage for trip planning
    - Note: Coverage map data may need periodic manual updates or scraping

---

### Phase 4: Vehicle Tools
Calculators and references specific to diesel vehicles.

21. [ ] **Tyre pressure calculator** — Altitude and load adjusted
    - Input: Tyre size, load weight, altitude, temperature
    - Calculate: Recommended PSI adjusting for conditions
    - Reference tables for common 4WD tyres (BFG KO2, Cooper AT3, etc.)
    - Separate pressures for highway vs off-road vs sand
    - Implementation: Tool page `TyrePressure.jsx`

22. [ ] **Weight distribution calculator** — GVM/GCM compliance
    - Input: Vehicle tare, accessories, cargo, tow ball weight
    - Calculate: Axle loads, GVM remaining, GCM compliance
    - Vehicle presets matching existing route planner profiles
    - Visual weight distribution diagram
    - Warning when approaching or exceeding limits
    - Implementation: Tool page `WeightCalculator.jsx`

23. [ ] **Enhanced fuel economy tracker** — Trip logging
    - Log fill-ups: litres, cost, odometer reading
    - Calculate: L/100km, cost/km, running averages
    - Compare economy across different conditions (highway vs towing vs off-road)
    - Store in localStorage, export as CSV
    - Chart fuel economy trends over time
    - Implementation: Enhance existing fuel consumption calculator

24. [ ] **Vehicle service tracker** — Maintenance reminders
    - Log: Oil changes, filter replacements, tyre rotations
    - Set interval reminders by km or time
    - Common diesel service intervals as presets
    - Store in localStorage
    - Implementation: Page `ServiceTracker.jsx`

25. [ ] **Solar panel output estimator**
    - Input: Panel wattage, panel type (mono/poly), angle, location
    - API: Open-Meteo solar radiation data (`shortwave_radiation`)
    - Calculate: Expected daily output (Wh) based on location and season
    - Show: sunrise/sunset times, peak solar hours
    - Factor in cloud cover from weather forecast
    - Useful for planning off-grid camping duration
    - Implementation: Tool page `SolarEstimator.jsx`

---

### Phase 5: Trip Planning
Pre-trip preparation and on-trip recording tools.

26. [ ] **Pre-trip checklists** — Customisable departure checklists
    - Default checklists: Vehicle check, caravan check, packing list, campsite setup
    - Customisable items (add/remove/reorder)
    - Check-off with timestamps
    - Reset for next trip
    - Store in localStorage
    - Implementation: Page `Checklists.jsx`

27. [ ] **Trip journal** — Log entries along the way
    - Date/time stamped entries with location
    - Photo references (store filenames, not actual photos)
    - Campsite ratings and notes
    - Export as text/markdown
    - Store in localStorage
    - Implementation: Page `TripJournal.jsx`

28. [ ] **Multi-stop trip planner** — Extended route planning
    - Plan multi-day routes with overnight stops
    - Integrate campground/rest area suggestions at stop points
    - Daily distance targets
    - Fuel stop planning across multiple days
    - Save/load trip plans
    - Implementation: Enhance existing route planner with waypoint management

29. [ ] **Vehicle profiles** — Multiple vehicle configurations
    - Save multiple vehicle setups (e.g., "Solo 4WD", "4WD + Van", "Motorhome")
    - Each profile stores: dimensions, weight, fuel consumption, tyre specs
    - Quick-switch between profiles
    - Profiles used across route planner, fuel calc, tyre pressure, weight calc
    - Implementation: Extend `useVehicleProfile.js` hook

30. [ ] **Offline mode improvements** — Cache critical data for remote areas
    - Download map tiles for planned route corridor
    - Cache fuel prices for offline reference
    - Cache rest area and campground data along route
    - Sync when back online
    - Implementation: Enhance service worker caching strategy

---

### Phase 6: Future / Community Features
Longer-term features requiring more infrastructure.

31. [ ] **Community-contributed data** — User submissions
    - Allow users to submit/update: dump points, water crossings, campsite info
    - Would require backend server (currently static site)
    - Consider: Firebase, Supabase, or similar serverless backend
    - Moderation system for submissions

32. [ ] **Speed camera and RMS weigh station alerts**
    - Source: Community databases, OSM data
    - Alert when approaching known locations
    - Particularly useful for heavy vehicle weigh stations

33. [ ] **Google Play Store TWA** — Wrap PWA as Android app
    - Trusted Web Activity wraps existing website in Android shell
    - Distribute via Google Play Store
    - Wait for user base feedback on web app first

34. [ ] **Push notifications** — Price drop and weather alerts
    - Requires service worker push subscription
    - Alert on: price drops at bookmarked stations, severe weather on saved routes
    - Would need simple notification backend

---

## Completed

- [x] NSW diesel price tracker with FuelCheck API (2026-01)
- [x] Heavy vehicle route planner with HERE Routing API (2026-01)
- [x] PWA with offline caching and install prompt (2026-01)
- [x] GitHub Pages auto-deployment via Actions (2026-01)
- [x] Vehicle dimension presets for route planner (2026-01)
- [x] Fuel consumption calculator (2026-01)
- [x] Station bookmarking and price alerts (2026-01)
- [x] README launch badge added (2026-02-04)
- [x] SECURITY_AUDIT.md created (2026-02-04)
- [x] Comprehensive development roadmap written (2026-02-04)

---

## Architecture & Decisions

| Decision | Reason | Date |
|----------|--------|------|
| PWA over native APK | All features require internet for APIs; no value in native shell | 2026-02-04 |
| Diesel fuel types only | App is for Berrima Diesel Service — exclusively diesel since 1956 | 2026-02-04 |
| localStorage for user data | No backend server; keeps app simple and private | 2026-01 |
| Open-Meteo over BOM direct | Free, no auth, structured JSON, uses BOM data under the hood | 2026-02-04 |
| OSM Overpass for campgrounds | Free, comprehensive, no auth, community-maintained | 2026-02-04 |
| Phase 1 priority: national prices | Most requested feature gap; builds on existing fuel tracker | 2026-02-04 |

---

## API Reference

| API | URL | Auth | Format | Used For |
|-----|-----|------|--------|----------|
| NSW FuelCheck | `fuelcheck.nsw.gov.au` | None (public) | JSON | NSW diesel prices |
| HERE Routing | `router.hereapi.com` | API key | JSON | Truck-safe routing |
| QLD Open Data | `data.qld.gov.au` | None | JSON | QLD diesel prices |
| WA FuelWatch | `fuelwatch.wa.gov.au` | None | RSS/XML | WA diesel prices |
| Open-Meteo BOM | `api.open-meteo.com/v1/bom` | None | JSON | Weather forecasts |
| Overpass API | `overpass-api.de` | None | JSON | Campgrounds, POIs |
| National Toilet Map | `toiletmap.gov.au` | None | JSON | Dump points, water |
| NSW RFS | `rfs.nsw.gov.au` | None | GeoJSON | Bushfire incidents |
| NSW Live Traffic | `livetraffic.com` | None | JSON | Road conditions NSW |
| RFNSA | `rfnsa.com.au` | None | HTML | Mobile tower locations |

---

## Files to Know

| File | Purpose |
|------|---------|
| `CREDENTIALS.md` | Private API keys and account info |
| `frontend/web/.env` | Environment variables for Vite |
| `frontend/web/src/services/nswFuelApi.js` | NSW Fuel API integration |
| `frontend/web/src/services/hereRoutingApi.js` | HERE Routing API integration |
| `frontend/web/src/hooks/useVehicleProfile.js` | Vehicle dimension presets |
| `frontend/web/src/pages/RoutePlanner.jsx` | Main route planner page |
| `frontend/web/src/pages/FuelTracker.jsx` | Main fuel tracker page |
| `frontend/web/src/hooks/useInstallPrompt.js` | PWA install prompt hook |
| `frontend/web/vite.config.js` | Vite + PWA config |
| `.github/workflows/deploy.yml` | GitHub Actions deploy workflow |

---

## Tech Stack

- React 18 + Vite + vite-plugin-pwa
- Tailwind CSS (Australian heritage colour scheme)
- TanStack React Query
- Leaflet.js for maps
- HERE Platform API (routing)
- NSW FuelCheck API (prices)
- GitHub Pages (hosting)

---

## Colour Scheme (Berrima Heritage)

```
brand-brown: #6B4423     (Dark timber)
brand-ochre: #CC7722     (Ochre/rust)
brand-gold: #D4A84B      (Wattle gold)
brand-yellow: #F5D547    (Bright yellow)
brand-eucalyptus: #4A6741 (Gum leaf green)
brand-cream: #FDF6E3     (Heritage cream)
brand-tan: #D4C4A8       (Sandstone)
```

---

*Last updated: 4 Feb 2026*
