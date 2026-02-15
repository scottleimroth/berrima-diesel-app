# Berrima Diesel Touring Tools - Development Log & TODO

## Last Session

- **Date:** 2026-02-16
- **Summary:** Built 6 more touring tools — app now has 22 pages total!
- **Key achievements:**
  - ✅ Built Water Points locator (OSM Overpass API, potable/non-potable)
  - ✅ Built Gas Bottle Refills locator (OSM Overpass API, LPG stations + gas shops)
  - ✅ Built Workshop Finder (OSM Overpass API, diesel/4WD specialist tags, Berrima Diesel featured)
  - ✅ Built WiFi Hotspots locator (OSM Overpass API, venue types, free filter)
  - ✅ Built Laundromat Finder (OSM Overpass API, self-service indicators)
  - ✅ Built Flood & Weather Warnings (BOM RSS feeds via proxy, severity levels)
  - ✅ Extended overpassApi.js with 5 new functions (water, gas, workshops, wifi, laundromats)
  - ✅ Updated App.jsx with 6 new routes (22 total)
  - ✅ Updated Header.jsx tools dropdown (19 tool links)
  - ✅ Updated Home.jsx touring tools grid (19 tool cards)
  - ✅ Updated README.md with all new features
  - ✅ Clean production build verified
- **New pages:** 6 (WaterPoints, GasRefills, WorkshopFinder, WifiHotspots, Laundromats, FloodWarnings)
- **Total pages:** 22
- **Stopped at:** All features built and building clean. Committed and pushed.
- **Blockers:**
  - SA: No free public fuel API (Informed Sources is private, fuelprice.io is $99/mo)
  - NT: MyFuelNT still down, no public API, no recent datasets on data.nt.gov.au
  - WA FuelWatch has no CORS headers — still using allorigins.win proxy
- **Next steps:**
  - Phase 2 remaining: pet-friendly filter
  - Phase 3 remaining: road conditions, mobile coverage, water crossing depth
  - Phase 5 remaining: multi-stop planner, vehicle profiles, offline improvements
  - Phase 6 remaining: community data, speed cameras, Play Store TWA, push notifications, elevation profile, fuel price history

---

## Current Status

### Working Features
- **Diesel Price Finder** — National diesel prices covering NSW (3,200+ stations, real-time), ACT (via NSW), QLD (1,500+ stations, monthly), VIC (2,000+ stations, 24h delayed), WA (500+ stations, daily), TAS (75+ stations, real-time). Total: 8,300+ stations across 6 states/territories! State selector, map/list views, price alerts, bookmarks, radius filter, data attribution footer.
- **4WD, Caravan & Motorhome Route Planner** — HERE Routing API with weight-aware routing (works nationally), vehicle presets, avoid options, fuel consumption calc, turn-by-turn, saved routes
- **Weather Forecast** — 7-day Australian forecast via Open-Meteo BOM API. Current conditions, temperature, humidity, wind, UV index. Location search and GPS support.
- **Bushfire & Emergency Info** — Live NSW RFS incident feed with alert levels (Emergency, Watch & Act, Advice). Links to all 8 state/territory fire services. Auto-refreshes every 5 minutes.
- **Campground Finder** — OSM Overpass API campground/caravan park search. Filter by free/paid, toilets, water, power, pet-friendly, showers. Adjustable radius.
- **Rest Areas** — OSM Overpass API rest area search. Facility info (toilets, water, shelter, BBQ). Driver fatigue tips.
- **Tyre Pressure Calculator** — Terrain-adjusted pressure recommendations (highway, gravel, sand, mud, rock). Tyre presets for popular 4WD tyres. Temperature and altitude adjustment.
- **Weight Distribution Calculator** — GVM/GCM compliance checker. Vehicle presets for popular 4WDs. Payload breakdown with visual progress bars.
- **Pre-Trip Checklists** — 4 default checklists (vehicle, caravan, packing, campsite). Custom items. Progress saved to localStorage.
- **PWA** — Installable on Android/iOS, offline caching, fullscreen mode
- **GitHub Pages Deployment** — Auto-deploys on push to main via GitHub Actions

### Known Issues
- HERE Autosuggest API returns 400 errors sometimes (geocoding fallback works)
- Some FuelCheck station prices may be weeks old (data quality issue upstream)

---

## Development Roadmap

### Phase 1: National Diesel Prices
Expand diesel price coverage from NSW-only to all Australian states. Each state has its own API/data source.

1. [x] **Queensland diesel prices** — QLD Open Data CKAN DataStore API
   - API: `https://www.data.qld.gov.au/api/3/action/datastore_search_sql`
   - Format: JSON REST API, free, no auth, CORS enabled
   - Data: Monthly fuel prices with lat/lng (Jan 2026 latest)
   - Implementation: `qldFuelApi.js` with SQL query for diesel, dedup by station

2. [x] **Western Australia diesel prices** — FuelWatch WA
   - API: `https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS?Product=4`
   - Format: RSS/XML feed, free, no auth, NO CORS (proxied via allorigins.win)
   - Data: Daily regulated fuel prices, metro + 9 regional areas
   - Implementation: `waFuelApi.js` with DOMParser XML parsing, 1hr cache

3. [x] **Tasmania diesel prices** — TAS FuelCheck API
   - API: `https://www.fuelcheck.tas.gov.au/fuel/api/v1/fuel/prices/bylocation`
   - Format: JSON REST API, free, no auth, CORS enabled
   - Data: Real-time diesel prices with lat/lng (~75+ stations)
   - Implementation: `tasFuelApi.js` — same format as NSW FuelCheck

4. [x] **Victoria diesel prices** — Servo Saver API (Service Victoria)
   - API: `https://api.fuel.service.vic.gov.au/open-data/v1/fuel/prices`
   - Format: JSON, CC-BY-4.0 licence, 24-hour data delay
   - Implementation: `vicFuelApi.js` with UUID transaction IDs, distance calculation, 1hr cache
   - Rate limit: 10 requests per 60 seconds
   - Contact: fuel.program@service.vic.gov.au
   - Completed: 2026-02-11

5. [ ] **South Australia diesel prices** — Informed Sources aggregator
   - No public government API — SA uses private aggregator model (Informed Sources)
   - ~~fuelprice.io~~ — NOT free, A$99/month (Visser Associates), too expensive
   - Remaining options: (a) Register as data publisher via CBS, (b) Scrape SA govt site, (c) Find alternative free API
   - Blocked: No free public API found yet

6. [ ] **Northern Territory diesel prices** — MyFuel NT
   - Website myfuelnt.nt.gov.au currently experiencing service outage
   - No public developer API found; ASP.NET MVC app with no exposed endpoints
   - Historical monthly XLSX data on data.nt.gov.au (2018-2024)
   - ~~fuelprice.io~~ — NOT free, A$99/month, too expensive
   - Remaining options: (a) Wait for site recovery + inspect XHR calls, (b) Find alternative free API
   - Blocked: Site down, no free API

7. [x] **Unified fuel price interface** — `nationalFuelApi.js`
   - Merges NSW, WA, QLD, TAS into single price feed
   - Common data format: `{ code, name, lat, lng, price, fueltype, lastupdated, state, source }`
   - State selector in UI (ALL, NSW, ACT, QLD, WA, TAS)
   - Cross-border price comparison near state boundaries
   - Handle different update frequencies (real-time NSW/TAS vs daily WA)

8. [ ] **Fuel stops along route** — Show cheapest diesel along planned routes
   - Query fuel prices within corridor of planned route
   - Suggest optimal fuel stops based on tank range and prices
   - Factor in detour distance vs price savings
   - Integration with existing route planner

---

### Phase 2: Touring Infrastructure
Essential services and facilities for diesel vehicle tourers.

9. [x] **Rest areas database** — National Rest Areas (2026-02-15)
   - API: National Freight Data Hub / data.gov.au
   - URL: `https://data.gov.au/dataset/` (search "rest areas")
   - Data: Locations, facilities (toilets, water, shade, parking bays), vehicle suitability
   - Implementation: New page `RestAreas.jsx` with map markers and list view
   - Filter by facilities, distance from route, vehicle size suitability

10. [x] **Dump points locator** — Caravan/motorhome waste disposal (2026-02-15)
    - API: National Public Toilet Map + community databases
    - URL: `https://toiletmap.gov.au/api/` (Australian Government)
    - Data: Dump point locations, types (black water, grey water), access restrictions
    - Supplement with: Camps Australia Wide data, WikiCamps community data
    - Implementation: Page `DumpPoints.jsx` with map, filter by type

11. [x] **Campground finder** — Free camps and caravan parks (2026-02-15)
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

13. [x] **Water points and potable water** — Drinking water refill locations (2026-02-16)
    - Source: National Public Toilet Map (many list water availability)
    - Source: OSM nodes tagged `amenity=drinking_water`
    - Implementation: Layer on existing map or dedicated section
    - Show distance from current location or along route

14. [x] **Gas bottle refill locator** — LPG/camping gas refill stations (2026-02-16)
    - Source: LPG station data from fuel price APIs (filter for LPG fuel type)
    - Source: OSM nodes tagged `fuel:lpg=yes` or `shop=gas`
    - Source: Swap'n'Go locator data
    - Implementation: Map layer showing LPG/gas refill points
    - Filter by: refill vs swap, bottle sizes accepted

---

### Phase 3: Safety & Conditions
Real-time safety information for touring.

15. [x] **Weather forecasts along route** — BOM weather via Open-Meteo (2026-02-15)
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

17. [x] **Bushfire information** — Emergency fire feeds (2026-02-15)
    - API: NSW RFS GeoJSON feed for current fires
    - URL: `https://www.rfs.nsw.gov.au/feeds/majorIncidents.json`
    - Similar feeds available from CFA (VIC), QFES (QLD), DFES (WA)
    - Implementation: Fire incident markers on map with danger ratings
    - Total fire ban day alerts
    - Smoke/air quality warnings

18. [x] **Flood warnings** — BOM flood data (2026-02-16)
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

21. [x] **Tyre pressure calculator** — Altitude and load adjusted (2026-02-15)
    - Input: Tyre size, load weight, altitude, temperature
    - Calculate: Recommended PSI adjusting for conditions
    - Reference tables for common 4WD tyres (BFG KO2, Cooper AT3, etc.)
    - Separate pressures for highway vs off-road vs sand
    - Implementation: Tool page `TyrePressure.jsx`

22. [x] **Weight distribution calculator** — GVM/GCM compliance (2026-02-15)
    - Input: Vehicle tare, accessories, cargo, tow ball weight
    - Calculate: Axle loads, GVM remaining, GCM compliance
    - Vehicle presets matching existing route planner profiles
    - Visual weight distribution diagram
    - Warning when approaching or exceeding limits
    - Implementation: Tool page `WeightCalculator.jsx`

23. [x] **Enhanced fuel economy tracker** — Trip logging (2026-02-15)
    - Log fill-ups: litres, cost, odometer reading
    - Calculate: L/100km, cost/km, running averages
    - Compare economy across different conditions (highway vs towing vs off-road)
    - Store in localStorage, export as CSV
    - Chart fuel economy trends over time
    - Implementation: Enhance existing fuel consumption calculator

24. [x] **Vehicle service tracker** — Maintenance reminders (2026-02-15)
    - Log: Oil changes, filter replacements, tyre rotations
    - Set interval reminders by km or time
    - Common diesel service intervals as presets
    - Store in localStorage
    - Implementation: Page `ServiceTracker.jsx`

25. [x] **Solar panel output estimator** (2026-02-15)
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

26. [x] **Pre-trip checklists** — Customisable departure checklists (2026-02-15)
    - Default checklists: Vehicle check, caravan check, packing list, campsite setup
    - Customisable items (add/remove/reorder)
    - Check-off with timestamps
    - Reset for next trip
    - Store in localStorage
    - Implementation: Page `Checklists.jsx`

27. [x] **Trip journal** — Log entries along the way (2026-02-15)
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

32. [ ] **Speed camera and weigh station alerts**
    - Source: Community databases, OSM data
    - Alert when approaching known locations
    - Useful for caravans and motorhomes at weigh stations

33. [ ] **Google Play Store TWA** — Wrap PWA as Android app
    - Trusted Web Activity wraps existing website in Android shell
    - Distribute via Google Play Store
    - Wait for user base feedback on web app first

34. [ ] **Push notifications** — Price drop and weather alerts
    - Requires service worker push subscription
    - Alert on: price drops at bookmarked stations, severe weather on saved routes
    - Would need simple notification backend

35. [ ] **Elevation profile along route** — Grade warnings for towing
    - Show elevation changes along planned route
    - Highlight steep grades (important for caravans, motorhomes, heavy tow rigs)
    - Source: Open-Meteo elevation API or HERE route elevation data
    - Warn about long descents (brake fade risk) and steep climbs (fuel/power impact)
    - Implementation: Chart component below route map

36. [x] **Diesel mechanic / workshop locator** — Find help on the road (2026-02-16)
    - Find diesel mechanics and workshops near current location or along route
    - Source: Google Places API or OSM `shop=car_repair` / `service:vehicle:diesel=yes`
    - Filter by: diesel specialist, 4WD specialist, caravan/trailer service
    - Particularly relevant for Berrima Diesel — link back to the business for Southern Highlands area
    - Implementation: Page `WorkshopFinder.jsx` with map and list

37. [ ] **Fuel price history and trends** — Track price movements
    - Show historical price charts for bookmarked stations
    - Indicate if prices are trending up or down
    - Best day of the week to fill up (by state)
    - Source: Store price snapshots in localStorage over time, or use fuelprice.io historical API
    - Implementation: Chart on station detail view

38. [x] **Towing speed limit reference by state** — Quick legal reference (2026-02-15)
    - Speed limits vary by state for vehicles towing trailers/caravans
    - Table: state-by-state speed limits for towing (highway, rural, urban)
    - Include GVM/ATM thresholds that trigger different limits
    - Source: State road authority regulations (static reference data)
    - Implementation: Reference page `TowingLimits.jsx`

39. [x] **Free WiFi hotspot locator** — Stay connected on the road (2026-02-16)
    - Find free public WiFi near current location or along route
    - Source: OSM nodes tagged `internet_access=wlan` / `internet_access:fee=no`
    - Libraries, shopping centres, McDonald's, caravan parks
    - Useful for remote area travellers needing to upload/download
    - Implementation: Map layer or dedicated section

40. [x] **Laundromat locator** — Essential for long-term tourers (2026-02-16)
    - Find laundromats and laundry facilities near current location
    - Source: OSM nodes tagged `shop=laundry` or `amenity=laundry`
    - Include caravan park laundry facilities where known
    - Implementation: Map layer or dedicated section

---

## Completed

- [x] NSW diesel price tracker with FuelCheck API (2026-01)
- [x] Caravan route planner with HERE Routing API (2026-01)
- [x] PWA with offline caching and install prompt (2026-01)
- [x] GitHub Pages auto-deployment via Actions (2026-01)
- [x] Vehicle dimension presets for route planner (2026-01)
- [x] Fuel consumption calculator (2026-01)
- [x] Station bookmarking and price alerts (2026-01)
- [x] README launch badge added (2026-02-04)
- [x] SECURITY_AUDIT.md created (2026-02-04)
- [x] Comprehensive development roadmap written (2026-02-04)
- [x] WA FuelWatch diesel prices via RSS + CORS proxy (2026-02-04)
- [x] QLD diesel prices via Open Data CKAN DataStore API (2026-02-04)
- [x] Unified national fuel service (nationalFuelApi.js) (2026-02-04)
- [x] State selector in Fuel Tracker UI (2026-02-04)
- [x] State badges on station cards (2026-02-04)
- [x] TAS FuelCheck API integration — real-time TAS diesel prices (2026-02-04)
- [x] Deep API research for VIC, SA, NT fuel data sources (2026-02-04)
- [x] VIC Servo Saver API integration — 24h delayed VIC diesel prices (2026-02-11)
- [x] Weather Forecast page — Open-Meteo BOM API, 7-day forecast (2026-02-15)
- [x] Bushfire & Emergency Info page — NSW RFS live incidents (2026-02-15)
- [x] Campground Finder page — OSM Overpass API with facility filters (2026-02-15)
- [x] Rest Areas page — OSM Overpass API with driver fatigue tips (2026-02-15)
- [x] Tyre Pressure Calculator — terrain, temperature, altitude, load adjustments (2026-02-15)
- [x] Weight Distribution Calculator — GVM/GCM compliance with vehicle presets (2026-02-15)
- [x] Pre-Trip Checklists — 4 default lists with custom items, localStorage (2026-02-15)
- [x] Header navigation dropdown for all touring tools (2026-02-15)
- [x] Home page updated with full touring tools grid (2026-02-15)
- [x] PWA caching for weather, bushfire, and overpass APIs (2026-02-15)
- [x] Dump Points locator — OSM Overpass API with findDumpPoints() (2026-02-15)
- [x] Fuel Economy Tracker — fill-up logging, L/100km, cost tracking (2026-02-15)
- [x] Trip Journal — entries with location, rating, tags, odometer (2026-02-15)
- [x] Solar Panel Estimator — panel/battery presets, AU sun hours, load calc (2026-02-15)
- [x] Towing Speed Limits reference — all 8 states/territories (2026-02-15)
- [x] Vehicle Service Tracker — service history, reminders, vehicle presets (2026-02-15)
- [x] Header navigation expanded to 13 tool links (2026-02-15)
- [x] Home page expanded to 13 touring tool cards (2026-02-15)
- [x] Water Points locator — OSM Overpass API with potable/non-potable (2026-02-16)
- [x] Gas Bottle Refills locator — OSM Overpass API for LPG stations (2026-02-16)
- [x] Workshop Finder — OSM Overpass API with diesel/4WD specialist tags (2026-02-16)
- [x] WiFi Hotspots locator — OSM Overpass API with venue types (2026-02-16)
- [x] Laundromat Finder — OSM Overpass API with self-service indicators (2026-02-16)
- [x] Flood & Weather Warnings — BOM RSS feeds via proxy (2026-02-16)
- [x] Extended overpassApi.js with 5 new finder functions (2026-02-16)
- [x] Header navigation expanded to 19 tool links (2026-02-16)
- [x] Home page expanded to 19 touring tool cards (2026-02-16)

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
| allorigins.win CORS proxy for WA | FuelWatch has no CORS headers; free proxy is simplest for static site | 2026-02-04 |
| QLD CKAN DataStore over CSV | SQL queries via API; no need to download/parse full CSV files | 2026-02-04 |
| TAS FuelCheck direct API | Discovered TAS has its own FuelCheck API with CORS; no V2 auth needed | 2026-02-04 |
| SA via fuelprice.io (future) | SA has no public gov API; Informed Sources aggregator is private | 2026-02-04 |

---

## API Reference

| API | URL | Auth | Format | Used For |
|-----|-----|------|--------|----------|
| NSW FuelCheck | `fuelcheck.nsw.gov.au` | None (public) | JSON | NSW diesel prices |
| HERE Routing | `router.hereapi.com` | API key | JSON | Caravan/motorhome routing |
| QLD Open Data | `data.qld.gov.au` | None | JSON | QLD diesel prices |
| TAS FuelCheck | `fuelcheck.tas.gov.au` | None | JSON | TAS diesel prices |
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
| `frontend/web/src/services/nationalFuelApi.js` | Unified national fuel price service |
| `frontend/web/src/services/nswFuelApi.js` | NSW+ACT FuelCheck API integration |
| `frontend/web/src/services/waFuelApi.js` | WA FuelWatch RSS integration |
| `frontend/web/src/services/qldFuelApi.js` | QLD Open Data CKAN DataStore integration |
| `frontend/web/src/services/tasFuelApi.js` | TAS FuelCheck API integration |
| `frontend/web/src/services/hereRoutingApi.js` | HERE Routing API integration |
| `frontend/web/src/hooks/useFuelPrices.js` | Fuel prices hook (supports state filter) |
| `frontend/web/src/hooks/useVehicleProfile.js` | Vehicle dimension presets |
| `frontend/web/src/pages/RoutePlanner.jsx` | Main route planner page |
| `frontend/web/src/pages/FuelTracker.jsx` | Main fuel tracker page (national) |
| `frontend/web/src/services/weatherApi.js` | Open-Meteo BOM weather API |
| `frontend/web/src/services/bushfireApi.js` | NSW RFS bushfire incidents |
| `frontend/web/src/services/overpassApi.js` | OSM Overpass API for campgrounds/rest areas/dump points |
| `frontend/web/src/hooks/useChecklists.js` | Pre-trip checklist localStorage hook |
| `frontend/web/src/pages/Weather.jsx` | Weather forecast page |
| `frontend/web/src/pages/Bushfires.jsx` | Bushfire & emergency info page |
| `frontend/web/src/pages/Campgrounds.jsx` | Campground finder page |
| `frontend/web/src/pages/RestAreas.jsx` | Rest areas page |
| `frontend/web/src/pages/TyrePressure.jsx` | Tyre pressure calculator page |
| `frontend/web/src/pages/WeightCalculator.jsx` | Weight distribution calculator page |
| `frontend/web/src/pages/Checklists.jsx` | Pre-trip checklists page |
| `frontend/web/src/pages/DumpPoints.jsx` | Dump points locator page |
| `frontend/web/src/pages/FuelEconomy.jsx` | Fuel economy tracker page |
| `frontend/web/src/pages/TripJournal.jsx` | Trip journal page |
| `frontend/web/src/pages/SolarEstimator.jsx` | Solar panel estimator page |
| `frontend/web/src/pages/TowingSpeedLimits.jsx` | Towing speed limits reference page |
| `frontend/web/src/pages/ServiceTracker.jsx` | Vehicle service tracker page |
| `frontend/web/src/pages/WaterPoints.jsx` | Water points locator page |
| `frontend/web/src/pages/GasRefills.jsx` | Gas bottle refill locator page |
| `frontend/web/src/pages/WorkshopFinder.jsx` | Workshop/mechanic finder page |
| `frontend/web/src/pages/WifiHotspots.jsx` | WiFi hotspot locator page |
| `frontend/web/src/pages/Laundromats.jsx` | Laundromat finder page |
| `frontend/web/src/pages/FloodWarnings.jsx` | Flood & weather warnings page |
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

*Last updated: 16 Feb 2026 (22 pages total — 6 new: water points, gas refills, workshop finder, WiFi hotspots, laundromats, flood warnings)*
