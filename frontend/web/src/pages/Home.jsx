import { Link } from 'react-router-dom'
import { Clock, Phone, Award, Users, Compass } from 'lucide-react'

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
              Australia's Premier 4WD Diesel Turbo Centre. Helping tourers, caravanners, and adventurers
              get the most out of their diesel vehicles since 1956.
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

      {/* Features Section - Warm cream background */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold text-center mb-4 text-brand-brown">
            Tools for Touring Travellers
          </h2>
          <p className="text-center text-brand-gray mb-12 max-w-2xl mx-auto">
            Free tools to help you plan your next adventure - find cheap diesel and plan routes for your caravan, motorhome, or 4WD
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
                Find the cheapest diesel near you or along your route. Real-time prices from NSW FuelCheck
                sorted by price or distance.
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
                Caravan Route Planner
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

      {/* About Section - Heritage earth tones */}
      <section className="py-16 bg-brand-light">
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
