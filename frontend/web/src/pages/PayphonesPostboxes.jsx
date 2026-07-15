import { ExternalLink, Mailbox, MapPin, Phone, ShieldCheck, Wifi } from 'lucide-react'

const MAP_URL = 'https://payphones.scottleimroth.com/'

function PayphonesPostboxes() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-brand-ochre">
                Touring Tools
              </p>
              <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
                Payphones & Postboxes
              </h1>
              <p className="max-w-3xl text-brand-gray">
                Find public payphones, Telstra Wi-Fi hotspots, and Australia Post street posting
                boxes while you travel. Useful when mobile coverage is patchy, you need a backup
                contact option, or you still have something that needs a proper red box.
              </p>
            </div>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-yellow px-5 py-3 text-sm font-bold text-brand-navy shadow transition-colors hover:bg-brand-gold"
            >
              <ExternalLink size={18} />
              Open full map
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-lg border border-brand-tan/50 bg-white p-4 shadow">
            <div className="mb-2 flex items-center gap-2 text-brand-brown">
              <Phone size={18} className="text-blue-600" />
              <h2 className="font-headline text-lg font-bold">Payphones</h2>
            </div>
            <p className="text-sm text-brand-gray">
              Telstra payphone locations across Australia for emergency backup and low-coverage
              travel planning.
            </p>
          </div>
          <div className="rounded-lg border border-brand-tan/50 bg-white p-4 shadow">
            <div className="mb-2 flex items-center gap-2 text-brand-brown">
              <Wifi size={18} className="text-green-600" />
              <h2 className="font-headline text-lg font-bold">Wi-Fi Hotspots</h2>
            </div>
            <p className="text-sm text-brand-gray">
              Public hotspot points shown alongside payphones where Telstra data includes them.
            </p>
          </div>
          <div className="rounded-lg border border-brand-tan/50 bg-white p-4 shadow">
            <div className="mb-2 flex items-center gap-2 text-brand-brown">
              <Mailbox size={18} className="text-red-600" />
              <h2 className="font-headline text-lg font-bold">Postboxes</h2>
            </div>
            <p className="text-sm text-brand-gray">
              Street posting boxes sourced from the approved Australia Post Locations V3 data
              export.
            </p>
          </div>
          <div className="rounded-lg border border-brand-tan/50 bg-white p-4 shadow">
            <div className="mb-2 flex items-center gap-2 text-brand-brown">
              <ShieldCheck size={18} className="text-brand-eucalyptus" />
              <h2 className="font-headline text-lg font-bold">Canonical Data</h2>
            </div>
            <p className="text-sm text-brand-gray">
              The map below is the live Aussie Payphones map, so this app does not keep a second
              copy of the location data.
            </p>
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-lg border border-brand-tan/50 bg-white shadow-lg">
          <div className="flex flex-col gap-3 border-b border-brand-tan/50 bg-brand-light px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-brand-brown">
              <MapPin size={18} className="text-brand-ochre" />
              <h2 className="font-headline text-lg font-bold">Australia-wide map</h2>
            </div>
            <p className="text-xs text-brand-gray">
              If the embedded map feels cramped on mobile, use the full map button.
            </p>
          </div>
          <iframe
            title="Aussie Payphones, Wi-Fi Hotspots and Post Boxes map"
            src={MAP_URL}
            className="h-[72vh] min-h-[560px] w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>

        <p className="mt-5 text-center text-xs text-brand-gray/70">
          Location data is provided by the Aussie Payphones project from Telstra public data and
          Australia Post Locations V3. Always verify critical services locally when travelling.
        </p>
      </div>
    </div>
  )
}

export default PayphonesPostboxes
