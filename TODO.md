# Berrima Diesel App - Development TODO

## Current Status (Feb 2026)

### Working Features

- **Route Planner** - Fully functional with HERE Routing API
  - Real road routes with 7,000+ polyline points
  - Vehicle dimension presets (4WD + Caravan, Motorhome, etc.)
  - Avoid options (tolls, ferries, unpaved roads)
  - Save/load favourite routes (localStorage)
  - Fuel consumption calculator
  - Turn-by-turn directions

- **Fuel Price Tracker** - Fully working with real data
  - Live prices from NSW FuelCheck public API (3,282 stations)
  - Uses public FuelCheckApp/v1 endpoint (no auth required)
  - 5-minute in-memory cache to avoid repeated large fetches
  - Price alerts feature
  - Station bookmarking
  - Map and list views
  - Filter by fuel type, sort by price or distance, radius filter

- **PWA (Progressive Web App)** - Installable on phones
  - Service worker with offline caching (map tiles, fonts, fuel data)
  - Install banner on mobile phones
  - App icon on home screen, opens fullscreen
  - Works on Android (Chrome) and iOS (Safari)

- **GitHub Pages Deployment** - Live at https://scottleimroth.github.io/berrima-diesel-app/
  - Auto-deploys on push to main via GitHub Actions
  - API keys stored as encrypted GitHub Secrets

### Known Issues

1. **HERE Autosuggest API** - Returns 400 errors sometimes
   - Geocoding fallback is working
   - Location search still functions via fallback

2. **Fuel data freshness** - Some station prices may be weeks old
   - This is a data quality issue from FuelCheck, not our code
   - Prices show their "last updated" timestamp

### Future - After Staff Assessment

1. **Google Play Store APK (TWA)** - Wrap the web app as a real Android app
   - Trusted Web Activity wraps the existing website in an Android shell
   - Same app, but distributed via Google Play Store
   - Wait for staff feedback on the web app first

2. **Apple App Store** - iOS version if there's demand
   - PWA already works on iPhone via Safari "Add to Home Screen"
   - Native iOS app only needed if PWA isn't sufficient

3. **Push notifications** - Price drop alerts
4. **Fuel stops along route** - Show cheapest diesel along planned routes
5. **Offline mode** - Cache routes and prices for use without internet

### API Credentials

All credentials stored in `CREDENTIALS.md` (gitignored):
- NSW Fuel API key (not currently used - public endpoint doesn't need it)
- HERE Platform API key (used for routing)
- Account details and portal URLs

### Environment Setup

```bash
cd frontend/web
npm install
npm run dev
# Runs on http://localhost:3000 (or 3001 if 3000 is in use)
```

### Files to Know

| File | Purpose |
|------|---------|
| `CREDENTIALS.md` | Private API keys and account info |
| `frontend/web/.env` | Environment variables for Vite |
| `frontend/web/src/services/nswFuelApi.js` | NSW Fuel API integration (public endpoint) |
| `frontend/web/src/services/hereRoutingApi.js` | HERE Routing API integration |
| `frontend/web/src/hooks/useVehicleProfile.js` | Vehicle dimension presets |
| `frontend/web/src/pages/RoutePlanner.jsx` | Main route planner page |
| `frontend/web/src/pages/FuelTracker.jsx` | Main fuel tracker page |
| `frontend/web/src/hooks/useInstallPrompt.js` | PWA install prompt hook |
| `frontend/web/vite.config.js` | Vite + PWA config |
| `.github/workflows/deploy.yml` | GitHub Actions deploy workflow |

### Tech Stack

- React 18 + Vite + vite-plugin-pwa
- Tailwind CSS (Australian heritage color scheme)
- TanStack React Query
- Leaflet.js for maps
- HERE Platform API (routing)
- NSW FuelCheck API (prices - public endpoint)
- GitHub Pages (hosting)

### Color Scheme (Berrima Heritage)

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

*Last updated: 3 Feb 2026*
