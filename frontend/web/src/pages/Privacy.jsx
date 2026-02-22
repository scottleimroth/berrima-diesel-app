function Privacy() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Privacy Policy
          </h1>
          <p className="text-brand-gray">Last updated: 22 February 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto prose prose-sm">
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <h2 className="font-headline text-xl font-bold text-brand-brown mb-3">Who We Are</h2>
            <p className="text-sm text-brand-gray mb-2">
              This app is operated by DEEZELPRO Pty Ltd, trading as Berrima Diesel Service,
              located at 3483 Old Hume Hwy, Berrima NSW 2577.
            </p>
            <p className="text-sm text-brand-gray">
              Contact: (02) 4877 1256 or via{' '}
              <a href="https://berrimadiesel.com" target="_blank" rel="noopener noreferrer" className="text-brand-ochre underline">
                berrimadiesel.com
              </a>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <h2 className="font-headline text-xl font-bold text-brand-brown mb-3">What Data We Collect</h2>
            <p className="text-sm text-brand-gray mb-3">
              <strong>Short answer: we do not collect, store, or transmit your personal data.</strong>
            </p>
            <p className="text-sm text-brand-gray mb-3">
              This app runs entirely in your web browser. There is no user account, no login,
              no registration, and no server-side database. We do not use cookies for tracking.
            </p>
            <h3 className="font-headline text-lg font-bold text-brand-brown mt-4 mb-2">Data Stored on Your Device</h3>
            <p className="text-sm text-brand-gray mb-2">
              The app uses your browser's localStorage to save your preferences. This data never
              leaves your device and is not accessible to us or any third party. It includes:
            </p>
            <ul className="text-sm text-brand-gray space-y-1 list-disc pl-5 mb-3">
              <li>Vehicle profiles (dimensions, weight settings)</li>
              <li>Bookmarked fuel stations</li>
              <li>Saved routes</li>
              <li>Fuel price alert preferences</li>
              <li>Checklist progress</li>
              <li>Fuel economy fill-up logs</li>
              <li>Vehicle service history</li>
            </ul>
            <p className="text-sm text-brand-gray">
              You can clear all stored data at any time by clearing your browser's site data
              for this website.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <h2 className="font-headline text-xl font-bold text-brand-brown mb-3">Location Data</h2>
            <p className="text-sm text-brand-gray mb-2">
              Some features (fuel prices, campgrounds, rest areas, water points, etc.) can use your
              device's GPS location to show nearby results. This requires your explicit permission
              via your browser's location prompt.
            </p>
            <ul className="text-sm text-brand-gray space-y-1 list-disc pl-5">
              <li>Location data is used temporarily and only within your browser session</li>
              <li>Your location is not stored on our servers (we have no servers)</li>
              <li>Your coordinates are sent to third-party APIs (see below) to return nearby results</li>
              <li>You can deny location access and use manual search instead</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <h2 className="font-headline text-xl font-bold text-brand-brown mb-3">Third-Party Services</h2>
            <p className="text-sm text-brand-gray mb-3">
              The app connects to the following external services to provide data. When you use
              these features, your IP address and search coordinates are visible to these providers
              under their own privacy policies:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-brand-gray">
                <thead>
                  <tr className="border-b border-brand-tan/50">
                    <th className="text-left py-2 pr-4 font-bold text-brand-brown">Service</th>
                    <th className="text-left py-2 font-bold text-brand-brown">Used For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-tan/30">
                  <tr>
                    <td className="py-2 pr-4">NSW FuelCheck API</td>
                    <td className="py-2">NSW/ACT fuel prices</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">VIC Servo Saver API</td>
                    <td className="py-2">Victoria fuel prices</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">QLD Open Data</td>
                    <td className="py-2">Queensland fuel prices</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">FuelWatch WA</td>
                    <td className="py-2">Western Australia fuel prices</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">TAS FuelCheck</td>
                    <td className="py-2">Tasmania fuel prices</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">HERE Maps</td>
                    <td className="py-2">Route planning and address search</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">OpenStreetMap / Nominatim</td>
                    <td className="py-2">Location search and map tiles</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Overpass API (OpenStreetMap)</td>
                    <td className="py-2">Campgrounds, rest areas, dump points, water points, gas, WiFi, laundromats</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Open-Meteo</td>
                    <td className="py-2">Weather forecasts</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">NSW Rural Fire Service</td>
                    <td className="py-2">Bushfire incidents</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Bureau of Meteorology (via proxy)</td>
                    <td className="py-2">Flood warnings</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-gray mt-3">
              We do not control how these third-party services handle your data. We encourage
              you to review their privacy policies if you have concerns.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <h2 className="font-headline text-xl font-bold text-brand-brown mb-3">Analytics & Tracking</h2>
            <p className="text-sm text-brand-gray">
              This app does not use Google Analytics, Facebook Pixel, or any other analytics
              or advertising tracking tools. We do not track your usage, build user profiles,
              or share data with advertisers.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <h2 className="font-headline text-xl font-bold text-brand-brown mb-3">Offline & PWA</h2>
            <p className="text-sm text-brand-gray">
              This app can be installed on your device as a Progressive Web App (PWA). When installed,
              a service worker caches API responses and app files locally on your device to enable
              offline access. This cached data stays on your device and is not sent to us.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <h2 className="font-headline text-xl font-bold text-brand-brown mb-3">Children</h2>
            <p className="text-sm text-brand-gray">
              This app is not directed at children under 16. We do not knowingly collect any
              personal information from children.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h2 className="font-headline text-xl font-bold text-brand-brown mb-3">Changes to This Policy</h2>
            <p className="text-sm text-brand-gray">
              We may update this privacy policy from time to time. Changes will be reflected on
              this page with an updated date. Since we don't collect email addresses or contact
              information, we cannot notify you directly of changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
