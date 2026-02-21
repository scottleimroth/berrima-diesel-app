import { Link } from 'react-router-dom'
import { Clock, Phone, Award, Users, Compass } from 'lucide-react'

const TOOL_CARDS = [
  {
    to: '/weather',
    icon: '🌤️',
    color: 'bg-blue-500',
    borderHover: 'hover:border-blue-400',
    title: 'Weather Forecast',
    description: '7-day Australian forecast from BOM data. Check conditions before you travel.',
  },
  {
    to: '/bushfires',
    icon: '🔥',
    color: 'bg-red-500',
    borderHover: 'hover:border-red-400',
    title: 'Bushfire Info',
    description: 'Live emergency incidents from NSW RFS. Links to all state fire services.',
  },
  {
    to: '/campgrounds',
    icon: '⛺',
    color: 'bg-brand-eucalyptus',
    borderHover: 'hover:border-brand-eucalyptus',
    title: 'Campground Finder',
    description: 'Find campgrounds and caravan parks. Filter by facilities, fees, and distance.',
  },
  {
    to: '/rest-areas',
    icon: '🅿️',
    color: 'bg-brand-ochre',
    borderHover: 'hover:border-brand-ochre',
    title: 'Rest Areas',
    description: 'Find roadside rest stops for a safe break. Facilities and distance info.',
  },
  {
    to: '/dump-points',
    icon: '🚮',
    color: 'bg-amber-600',
    borderHover: 'hover:border-amber-500',
    title: 'Dump Points',
    description: 'Find sanitary dump stations for RVs, caravans, and motorhomes.',
  },
  {
    to: '/tyre-pressure',
    icon: '🛞',
    color: 'bg-brand-brown',
    borderHover: 'hover:border-brand-brown',
    title: 'Tyre Pressure Calculator',
    description: 'Pressure recommendations for highway, gravel, sand, and mud. Tyre presets included.',
  },
  {
    to: '/weight-calculator',
    icon: '⚖️',
    color: 'bg-brand-navy',
    borderHover: 'hover:border-brand-navy',
    title: 'Weight Calculator',
    description: 'Check GVM and GCM compliance. Vehicle presets for popular 4WDs.',
  },
  {
    to: '/fuel-economy',
    icon: '⛽',
    color: 'bg-emerald-600',
    borderHover: 'hover:border-emerald-500',
    title: 'Fuel Economy Tracker',
    description: 'Log fill-ups to track L/100km, costs, and consumption trends.',
  },
  {
    to: '/solar-estimator',
    icon: '☀️',
    color: 'bg-yellow-500',
    borderHover: 'hover:border-yellow-400',
    title: 'Solar Estimator',
    description: 'Calculate if your solar setup can keep up with off-grid power needs.',
  },
  {
    to: '/service-tracker',
    icon: '🔧',
    color: 'bg-slate-600',
    borderHover: 'hover:border-slate-500',
    title: 'Service Tracker',
    description: 'Track vehicle service history and see when next service is due.',
  },
  {
    to: '/trip-journal',
    icon: '📓',
    color: 'bg-indigo-500',
    borderHover: 'hover:border-indigo-400',
    title: 'Trip Journal',
    description: 'Record your travels, favourite camps, road conditions, and memories.',
  },
  {
    to: '/towing-speed-limits',
    icon: '🚦',
    color: 'bg-rose-600',
    borderHover: 'hover:border-rose-500',
    title: 'Towing Speed Limits',
    description: 'Speed limits by state for vehicles towing caravans and trailers.',
  },
  {
    to: '/flood-warnings',
    icon: '🌊',
    color: 'bg-cyan-600',
    borderHover: 'hover:border-cyan-500',
    title: 'Flood Warnings',
    description: 'BOM flood and severe weather warnings. Check before you travel.',
  },
  {
    to: '/water-points',
    icon: '💧',
    color: 'bg-sky-500',
    borderHover: 'hover:border-sky-400',
    title: 'Water Points',
    description: 'Find drinking water refill points across Australia.',
  },
  {
    to: '/gas-refills',
    icon: '🔥',
    color: 'bg-orange-500',
    borderHover: 'hover:border-orange-400',
    title: 'Gas Bottle Refills',
    description: 'Find LPG and camping gas refill stations near you.',
  },
  {
    to: '/wifi',
    icon: '📶',
    color: 'bg-violet-500',
    borderHover: 'hover:border-violet-400',
    title: 'WiFi Hotspots',
    description: 'Find free public WiFi — libraries, cafes, caravan parks.',
  },
  {
    to: '/laundromats',
    icon: '👕',
    color: 'bg-teal-500',
    borderHover: 'hover:border-teal-400',
    title: 'Laundromat Finder',
    description: 'Find laundromats and laundry facilities for long-term touring.',
  },
  {
    to: '/checklists',
    icon: '✅',
    color: 'bg-brand-gold',
    borderHover: 'hover:border-brand-gold',
    title: 'Pre-Trip Checklists',
    description: 'Vehicle, caravan, packing, and campsite checklists. Add your own items.',
  },
]

function Home() {
  return (
    <div>
      {/* Hero Section - Navy with gold accents */}
      <section className="bg-gradient-to-b from-brand-navy to-brand-blue text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-yellow px-4 py-2 rounded-full mb-6 shadow-lg">
              <Clock size={16} className="text-brand-brown" />
              <span className="text-sm font-bold text-brand-brown">Est. 1956 - Over 70 Years of Expertise</span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 text-white">
              The Diesel Experts
            </h1>
            <p className="text-xl text-brand-yellow font-semibold mb-8">
              When You Think Diesel – Think Berrima Diesel
            </p>
            <p className="text-white mb-10 max-w-2xl mx-auto text-lg">
              Australia's Premier 4WD Diesel Turbo Centre. Free touring tools for caravanners,
              motorhomers, and 4WD adventurers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/fuel"
                className="inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-gold text-brand-navy px-8 py-4 rounded-lg font-bold transition-colors text-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m-6 0H6V5h6m7.77 2.23l.01-.01l-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16h10v-7.5h1.5v5a3 3 0 0 0 3 3a3 3 0 0 0 3-3V9c0-.69-.28-1.32-.73-1.77Z"/>
                </svg>
                Find Diesel Prices
              </Link>
              <Link
                to="/route"
                className="inline-flex items-center justify-center gap-2 bg-brand-cream hover:bg-white text-brand-brown px-8 py-4 rounded-lg font-bold transition-colors text-lg border-2 border-brand-cream hover:border-brand-tan"
              >
                <Compass size={24} />
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features - 2 columns */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold text-center mb-4 text-brand-brown">
            Tools for Touring Travellers
          </h2>
          <p className="text-center text-brand-gray mb-12 max-w-2xl mx-auto">
            Free tools to help you plan your next adventure — find cheap diesel, plan routes, check weather, and more.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Diesel Price Tracker */}
            <Link
              to="/fuel"
              className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all border-2 border-brand-tan hover:border-brand-yellow shadow-md"
            >
              <div className="w-14 h-14 bg-brand-yellow rounded-lg flex items-center justify-center mb-4 shadow">
                <svg className="w-8 h-8 text-brand-brown" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m-6 0H6V5h6m7.77 2.23l.01-.01l-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16h10v-7.5h1.5v5a3 3 0 0 0 3 3a3 3 0 0 0 3-3V9c0-.69-.28-1.32-.73-1.77Z"/>
                </svg>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-3 text-brand-brown group-hover:text-brand-ochre transition-colors">
                Diesel Price Finder
              </h3>
              <p className="text-brand-gray mb-4">
                Find the cheapest diesel across Australia. 8,300+ stations across NSW, ACT, QLD, VIC, WA, and TAS.
              </p>
              <ul className="text-sm text-brand-gray space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-ochre rounded-full"></span>
                  GPS location or manual search
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-ochre rounded-full"></span>
                  Sort by price or distance
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-ochre rounded-full"></span>
                  Bookmark favorite stops
                </li>
              </ul>
            </Link>

            {/* Route Planner */}
            <Link
              to="/route"
              className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all border-2 border-brand-tan hover:border-brand-eucalyptus shadow-md"
            >
              <div className="w-14 h-14 bg-brand-eucalyptus rounded-lg flex items-center justify-center mb-4 shadow">
                <svg className="w-8 h-8 text-brand-cream" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 4h-3V2h-4v2H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m-5 16a4 4 0 0 1-4-4c0-1.57.92-2.93 2.25-3.57l2.25 3.57l2.25-3.57A4.003 4.003 0 0 1 16 16a4 4 0 0 1-4 4m0-14a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z"/>
                </svg>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-3 text-brand-brown group-hover:text-brand-eucalyptus transition-colors">
                4WD, Caravan & Motorhome Route Planner
              </h3>
              <p className="text-brand-gray mb-4">
                Plan routes for your caravan, motorhome, or 4WD rig. Accounts for height and weight restrictions.
              </p>
              <ul className="text-sm text-brand-gray space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-eucalyptus rounded-full"></span>
                  Save your rig dimensions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-eucalyptus rounded-full"></span>
                  Low bridge warnings
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-eucalyptus rounded-full"></span>
                  Diesel stops along route
                </li>
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* Touring Tools Grid - Categorized */}
      <section className="py-16 bg-brand-light">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold text-center mb-4 text-brand-brown">
            Touring Tools
          </h2>
          <p className="text-center text-brand-gray mb-12 max-w-2xl mx-auto">
            {TOOL_CARDS.length} free tools for a safe and well-planned trip across Australia.
          </p>

          {/* Safety & Weather */}
          <div className="max-w-5xl mx-auto mb-10">
            <h3 className="font-headline text-lg font-bold text-brand-ochre mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-brand-ochre"></span>
              Safety & Weather
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {TOOL_CARDS.filter(t => ['/weather', '/bushfires', '/flood-warnings'].includes(t.to)).map((tool) => (
                <Link key={tool.to} to={tool.to}
                  className={`group bg-white rounded-xl p-5 hover:shadow-lg transition-all border-2 border-brand-tan ${tool.borderHover} shadow`}
                >
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-3 shadow text-2xl`}>{tool.icon}</div>
                  <h3 className="font-headline text-lg font-bold mb-2 text-brand-brown group-hover:text-brand-ochre transition-colors">{tool.title}</h3>
                  <p className="text-sm text-brand-gray">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Find Nearby */}
          <div className="max-w-5xl mx-auto mb-10">
            <h3 className="font-headline text-lg font-bold text-brand-ochre mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-brand-ochre"></span>
              Find Nearby
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {TOOL_CARDS.filter(t => ['/campgrounds', '/rest-areas', '/dump-points', '/water-points', '/gas-refills', '/wifi', '/laundromats'].includes(t.to)).map((tool) => (
                <Link key={tool.to} to={tool.to}
                  className={`group bg-white rounded-xl p-5 hover:shadow-lg transition-all border-2 border-brand-tan ${tool.borderHover} shadow`}
                >
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-3 shadow text-2xl`}>{tool.icon}</div>
                  <h3 className="font-headline text-lg font-bold mb-2 text-brand-brown group-hover:text-brand-ochre transition-colors">{tool.title}</h3>
                  <p className="text-sm text-brand-gray">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Vehicle & Trip */}
          <div className="max-w-5xl mx-auto">
            <h3 className="font-headline text-lg font-bold text-brand-ochre mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-brand-ochre"></span>
              Vehicle & Trip
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {TOOL_CARDS.filter(t => ['/tyre-pressure', '/weight-calculator', '/fuel-economy', '/solar-estimator', '/service-tracker', '/trip-journal', '/towing-speed-limits', '/checklists'].includes(t.to)).map((tool) => (
                <Link key={tool.to} to={tool.to}
                  className={`group bg-white rounded-xl p-5 hover:shadow-lg transition-all border-2 border-brand-tan ${tool.borderHover} shadow`}
                >
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-3 shadow text-2xl`}>{tool.icon}</div>
                  <h3 className="font-headline text-lg font-bold mb-2 text-brand-brown group-hover:text-brand-ochre transition-colors">{tool.title}</h3>
                  <p className="text-sm text-brand-gray">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Heritage earth tones */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock size={32} className="text-brand-brown" />
                </div>
                <h3 className="font-headline text-xl font-bold mb-2 text-brand-brown">Since 1956</h3>
                <p className="text-brand-gray text-sm">
                  Over 70 years working exclusively on diesel engines
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-ochre rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users size={32} className="text-white" />
                </div>
                <h3 className="font-headline text-xl font-bold mb-2 text-brand-brown">Family Business</h3>
                <p className="text-brand-gray text-sm">
                  Three generations of the Leimroth family
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-eucalyptus rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award size={32} className="text-white" />
                </div>
                <h3 className="font-headline text-xl font-bold mb-2 text-brand-brown">4WD Specialists</h3>
                <p className="text-brand-gray text-sm">
                  Australia's Premier 4WD Diesel Turbo Centre
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border-l-4 border-brand-ochre overflow-hidden">
              <div className="md:flex">
                {/* Shop Photo */}
                <div className="md:w-2/5 flex-shrink-0">
                  <img
                    src={`${import.meta.env.BASE_URL}berrima-shop.jpg`}
                    alt="Berrima Diesel Service Workshop"
                    className="w-full h-full object-cover min-h-[250px]"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
                {/* Story Content */}
                <div className="p-8 md:w-3/5">
                  <h3 className="font-headline text-2xl font-bold mb-4 text-brand-brown">Our Story</h3>
                  <p className="text-brand-gray mb-4">
                    Berrima Diesel Service began in 1956 when Reinhard Leimroth was sent to Australia
                    by Robert Bosch to troubleshoot problem diesel engines. What started as a
                    troubleshooting mission became a family legacy.
                  </p>
                  <p className="text-brand-gray mb-6">
                    Today, sons Andrew and Scott, along with grandsons Trent and Baden, continue the
                    tradition in the historic township of Berrima, NSW. We've helped thousands of
                    tourers get their rigs running perfectly for their next adventure.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="tel:0248771256"
                      className="inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-gold text-brand-brown px-6 py-3 rounded-lg font-bold transition-colors shadow"
                    >
                      <Phone size={20} />
                      (02) 4877 1256
                    </a>
                    <a
                      href="https://berrimadiesel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-brand-brown hover:bg-brand-ochre text-white px-6 py-3 rounded-lg font-bold transition-colors shadow"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
