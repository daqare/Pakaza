import "./globals.css";
import Link from "next/link";
import RoleSwitcher from "../components/RoleSwitcher";
import SmsToast from "../components/SmsToast";
import ClientOnly from "../components/ClientOnly";

export const metadata = {
  title: "PAKAZA | Send • Track • Delivered",
  description: "Kenya's premier matatu-powered parcel delivery network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col relative">
        {/* Professional Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group">
              {/* PAKAZA Logo SVG */}
              <svg width="48" height="48" viewBox="0 0 100 100" className="group-hover:scale-105 transition">
                {/* Speed lines */}
                <rect x="5" y="35" width="25" height="6" rx="3" fill="#00A651"/>
                <rect x="10" y="48" width="20" height="6" rx="3" fill="#ED1C24"/>
                <rect x="5" y="61" width="25" height="6" rx="3" fill="#00A651"/>
                {/* P shape */}
                <path d="M 35 20 L 70 20 Q 85 20 85 35 Q 85 50 70 50 L 50 50 L 50 80 L 35 80 Z" fill="#0047AB"/>
                {/* 3D Box */}
                <path d="M 55 25 L 75 25 L 80 35 L 60 35 Z" fill="#00A651"/>
                <path d="M 75 25 L 80 35 L 80 50 L 75 40 Z" fill="#ED1C24"/>
                <path d="M 60 35 L 80 35 L 80 50 L 60 50 Z" fill="#0047AB"/>
              </svg>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black text-[#0047AB] tracking-tight">PAKAZA</h1>
                <p className="text-xs text-gray-500 font-medium -mt-1">Parcel Network</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-[#00A651] font-semibold">SEND</span>
              <span className="text-gray-400">•</span>
              <span className="text-[#0047AB] font-semibold">TRACK</span>
              <span className="text-gray-400">•</span>
              <span className="text-[#ED1C24] font-semibold">DELIVERED</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ClientOnly>{children}</ClientOnly>
        </main>

        {/* Professional Footer */}
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto no-print">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3 text-sm">
              <span className="text-[#00A651] font-semibold">SEND</span>
              <span className="text-gray-400">•</span>
              <span className="text-[#0047AB] font-semibold">TRACK</span>
              <span className="text-gray-400">•</span>
              <span className="text-[#ED1C24] font-semibold">DELIVERED</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 PAKAZA Parcel Network. Demo Environment.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Fast • Safe • Nationwide
            </p>
          </div>
        </footer>

        {/* Global Components */}
        <div className="no-print">
          <SmsToast />
          <RoleSwitcher />
        </div>
      </body>
    </html>
  );
}
