import { NavLink } from 'react-router-dom'
import { Compass, Menu, Smartphone, X, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

const BASE_URL = import.meta.env.BASE_URL || '/'

const TOOL_LINKS = [
  { to: '/weather', label: 'Weather Forecast', icon: '🌤️' },
  { to: '/bushfires', label: 'Bushfire Info', icon: '🔥' },
  { to: '/campgrounds', label: 'Campgrounds', icon: '⛺' },
  { to: '/rest-areas', label: 'Rest Areas', icon: '🅿️' },
  { to: '/dump-points', label: 'Dump Points', icon: '🚮' },
  { to: '/tyre-pressure', label: 'Tyre Pressure', icon: '🛞' },
  { to: '/weight-calculator', label: 'Weight Calculator', icon: '⚖️' },
  { to: '/fuel-economy', label: 'Fuel Economy', icon: '⛽' },
  { to: '/solar-estimator', label: 'Solar Estimator', icon: '☀️' },
  { to: '/service-tracker', label: 'Service Tracker', icon: '🔧' },
  { to: '/trip-journal', label: 'Trip Journal', icon: '📓' },
  { to: '/towing-speed-limits', label: 'Speed Limits', icon: '🚦' },
  { to: '/checklists', label: 'Checklists', icon: '✅' },
]

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const { canInstall, promptInstall } = useInstallPrompt()
  const dropdownRef = useRef(null)

  const showBanner = canInstall && !bannerDismissed

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

            {/* Tools Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors font-semibold ${
                  toolsOpen ? 'bg-brand-yellow/20' : 'hover:bg-brand-yellow/20'
                } text-white`}
              >
                <span>Tools</span>
                <ChevronDown size={16} className={`transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {toolsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-brand-tan/50 py-2 z-50">
                  {TOOL_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setToolsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? 'bg-brand-yellow/20 text-brand-navy font-bold'
                            : 'text-brand-brown hover:bg-brand-cream'
                        }`
                      }
                    >
                      <span className="text-base">{link.icon}</span>
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
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

            {/* Mobile Tools Section */}
            <div className="border-t border-brand-yellow/20 mt-2 pt-2">
              <p className="px-4 py-1 text-xs text-brand-yellow/60 uppercase tracking-wide">Touring Tools</p>
              {TOOL_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium ${
                      isActive
                        ? 'bg-brand-yellow text-brand-navy'
                        : 'text-white hover:bg-brand-yellow/20'
                    }`
                  }
                >
                  <span className="text-base">{link.icon}</span>
                  <span className="text-sm">{link.label}</span>
                </NavLink>
              ))}
            </div>
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
