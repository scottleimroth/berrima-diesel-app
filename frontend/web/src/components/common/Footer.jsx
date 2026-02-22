import { Link } from 'react-router-dom'
import { Phone, MapPin, Globe, Clock } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-brand-navy to-brand-dark text-white">
      {/* Gold accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-ochre via-brand-yellow to-brand-gold"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="bg-white rounded-lg p-1.5 shadow inline-block mb-4">
              <img
                src={`${import.meta.env.BASE_URL}berrima-logo.jpg`}
                alt="Berrima Diesel Service"
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://www.berrimadiesel.com/image/cache/catalog/icons/berrima-logo-280x78_0.png'
                }}
              />
            </div>
            <p className="text-white/80 text-sm">
              Working exclusively on diesel since 1956. Australia's Premier 4WD Diesel Turbo Centre.
            </p>
            <p className="text-white/60 text-xs mt-2">
              Helping tourers, caravanners, and adventurers since 1956.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-headline font-bold text-lg mb-4 text-brand-gold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white">
                <Phone size={16} className="text-brand-yellow" />
                <a href="tel:0248771256" className="hover:text-brand-yellow transition-colors">
                  (02) 4877 1256
                </a>
              </li>
              <li className="flex items-start gap-2 text-white">
                <MapPin size={16} className="text-brand-yellow mt-0.5" />
                <span>3483 Old Hume Hwy<br />Berrima NSW 2577</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <Globe size={16} className="text-brand-yellow" />
                <a
                  href="https://berrimadiesel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-yellow transition-colors"
                >
                  berrimadiesel.com
                </a>
              </li>
            </ul>
          </div>

          {/* Tagline Section */}
          <div>
            <h3 className="font-headline font-bold text-lg mb-4 text-brand-gold">The Diesel Experts</h3>
            <p className="text-brand-yellow font-semibold text-lg mb-2 italic">
              "When You Think Diesel – Think Berrima Diesel"
            </p>
            <div className="flex items-center gap-2 text-white/80 text-sm mt-4">
              <Clock size={16} />
              <span>Serving tourers & adventurers since 1956</span>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-t border-brand-yellow/30 mt-8 pt-6 text-center text-white/60 text-xs space-y-2">
          <p>
            All tools and information on this site are provided for general guidance only and should not be relied
            upon as a substitute for professional advice, manufacturer specifications, or official government sources.
            Location data is crowd-sourced from OpenStreetMap and may be incomplete or outdated.
            Use all tools at your own risk.
          </p>
          <p className="flex items-center justify-center gap-3">
            <Link to="/privacy" className="underline hover:text-brand-yellow transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="underline hover:text-brand-yellow transition-colors">Terms of Use</Link>
          </p>
          <p>&copy; {currentYear} DEEZELPRO Pty Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
