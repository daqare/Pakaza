'use client';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* PAKAZA Logo SVG */}
            <svg width="40" height="40" viewBox="0 0 100 100">
              <rect x="5" y="35" width="25" height="6" rx="3" fill="#00A651"/>
              <rect x="10" y="48" width="20" height="6" rx="3" fill="#ED1C24"/>
              <rect x="5" y="61" width="25" height="6" rx="3" fill="#00A651"/>
              <path d="M 35 20 L 70 20 Q 85 20 85 35 Q 85 50 70 50 L 50 50 L 50 80 L 35 80 Z" fill="#0047AB"/>
              <path d="M 55 25 L 75 25 L 80 35 L 60 35 Z" fill="#00A651"/>
              <path d="M 75 25 L 80 35 L 80 50 L 75 40 Z" fill="#ED1C24"/>
              <path d="M 60 35 L 80 35 L 80 50 L 60 50 Z" fill="#0047AB"/>
            </svg>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-[#0047AB] tracking-tight">PAKAZA</h1>
              <p className="text-[10px] text-gray-500 font-medium -mt-1">Parcel Network</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-[#0047AB] transition">
            Access Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#0047AB] text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text & CTAs */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-4">
                  Kenya's Premier <br/>
                  <span className="text-[#00A651]">Matatu-Powered</span> <br/>
                  Parcel Network
                </h1>
                <p className="text-xl text-blue-100 font-medium">
                  Send. Track. Delivered.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/new" className="bg-[#00A651] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#008F45] transition shadow-xl text-center">
                  Book a Parcel
                </Link>
                <Link href="/dashboard" className="bg-white text-[#0047AB] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl text-center">
                  Track Shipment
                </Link>
              </div>
            </div>

            {/* Right: Device Mockups (CSS Representation) */}
            <div className="relative hidden lg:block">
              {/* Laptop Mockup */}
              <div className="bg-gray-800 rounded-2xl p-2 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition duration-500">
                <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video relative">
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-white flex flex-col">
                    <div className="h-8 bg-[#0047AB] flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/20"></div>
                      <div className="text-[10px] text-white font-bold">PAKAZA DASHBOARD</div>
                    </div>
                    <div className="flex-1 p-4 grid grid-cols-3 gap-2">
                      <div className="col-span-2 bg-gray-100 rounded h-20"></div>
                      <div className="bg-[#00A651]/10 rounded h-20 border border-[#00A651]/20"></div>
                      <div className="col-span-3 bg-gray-100 rounded h-12"></div>
                    </div>
                  </div>
                </div>
                {/* Laptop Base */}
                <div className="h-3 bg-gray-700 rounded-b-lg mx-4"></div>
              </div>

              {/* Phone Mockup */}
              <div className="absolute -bottom-10 -right-4 w-32 bg-gray-900 rounded-3xl p-2 shadow-2xl border-4 border-gray-800 transform rotate-[5deg]">
                <div className="bg-white rounded-2xl overflow-hidden aspect-[9/16] relative">
                  <div className="absolute inset-0 flex flex-col items-center pt-8 px-2">
                    <div className="text-[8px] font-bold text-[#0047AB] mb-4">CLIENT TRACKING</div>
                    <div className="w-full space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-[#00A651] rounded w-2/3"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="mt-4 w-8 h-8 rounded-full bg-[#0047AB] flex items-center justify-center text-white text-[10px]">✓</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Why Choose PAKAZA?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We leverage Kenya's extensive matatu network to provide fast, affordable, and reliable parcel delivery nationwide.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition text-center group">
              <div className="w-16 h-16 bg-[#0047AB]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-[#0047AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-600 text-sm">Book your parcel in seconds. Our digital waybill system generates tracking IDs and receipts instantly.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition text-center group">
              <div className="w-16 h-16 bg-[#00A651]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-[#00A651]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live SMS Updates</h3>
              <p className="text-gray-600 text-sm">Receive real-time SMS notifications at every stage: from pickup to in-transit, arrival, and final collection.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition text-center group">
              <div className="w-16 h-16 bg-[#ED1C24]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-[#ED1C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure M-Pesa Payments</h3>
              <p className="text-gray-600 text-sm">Integrated M-Pesa STK push for seamless payments. Automatic revenue splitting ensures fair operator payouts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003380] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-sm font-bold">
            <span className="text-[#00A651]">SEND</span>
            <span className="text-gray-400">•</span>
            <span className="text-white">TRACK</span>
            <span className="text-gray-400">•</span>
            <span className="text-[#ED1C24]">DELIVERED</span>
          </div>
          <p className="text-blue-200 text-sm">© 2026 PAKAZA Parcel Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
