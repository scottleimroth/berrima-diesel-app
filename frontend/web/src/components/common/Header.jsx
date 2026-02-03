import { NavLink } from 'react-router-dom'
import { Compass, Download, Menu, Smartphone, X } from 'lucide-react'
import { useState } from 'react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

const BASE_URL = import.meta.env.BASE_URL || '/'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const { canInstall, promptInstall } = useInstallPrompt()

  const showBanner = canInstall && !bannerDismissed

  return (
    <header className="bg-gradient-to-r from-brand-navy to-brand-blue text-white sticky top-0 z-50 shadow-lg">
      {/* Gold accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-yellow via-brand-gold to-brand-ochre"></div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-white rounded-lg p-1.5 shadow">
              <img
                src={`${BASE_URL}berrima-logo.jpg`}
                alt="Berrima Diesel Service"
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://www.berrimadiesel.com/image/cache/catalog/icons/berrima-logo-280x78_0.png'
                }}
              />
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/fuel"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                  isActive
                    ? 'bg-brand-yellow text-brand-navy'
                    : 'text-white hover:bg-brand-yellow/20'
                }`
              }
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m-6 0H6V5h6m7.77 2.23l.01-.01l-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16h10v-7.5h1.5v5a3 3 0 0 0 3 3a3 3 0 0 0 3-3V9c0-.69-.28-1.32-.73-1.77Z"/>
              </svg>
              <span>Diesel Prices</span>
            </NavLink>
            <NavLink
              to="/route"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                  isActive
                    ? 'bg-brand-yellow text-brand-navy'
                    : 'text-white hover:bg-brand-yellow/20'
                }`
              }
            >
              <Compass size={20} />
              <span>Trip Planner</span>
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-brand-yellow"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 border-t border-brand-yellow/30 pt-4 flex flex-col gap-2">
            <NavLink
              to="/fuel"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors font-semibold ${
                  isActive
                    ? 'bg-brand-yellow text-brand-navy'
                    : 'text-white hover:bg-brand-yellow/20'
                }`
              }
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m-6 0H6V5h6m7.77 2.23l.01-.01l-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16h10v-7.5h1.5v5a3 3 0 0 0 3 3a3 3 0 0 0 3-3V9c0-.69-.28-1.32-.73-1.77Z"/>
              </svg>
              <span>Diesel Prices</span>
            </NavLink>
            <NavLink
              to="/route"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors font-semibold ${
                  isActive
                    ? 'bg-brand-yellow text-brand-navy'
                    : 'text-white hover:bg-brand-yellow/20'
                }`
              }
            >
              <Compass size={20} />
              <span>Trip Planner</span>
            </NavLink>
          </nav>
        )}
      </div>

      {/* Mobile Install App Banner - shown below header */}
      {showBanner && (
        <div className="md:hidden bg-brand-gold">
          <div className="container mx-auto px-4 py-2.5 flex items-center gap-3">
            <Smartphone size={20} className="text-brand-navy flex-shrink-0" />
            <p className="text-sm text-brand-navy font-medium flex-1">
              Install this app on your phone for quick access
            </p>
            <button
              onClick={promptInstall}
              className="flex-shrink-0 bg-brand-navy text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-brand-brown transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              className="flex-shrink-0 text-brand-navy/60 hover:text-brand-navy p-1"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
