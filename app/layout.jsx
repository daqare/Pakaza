import "./globals.css";
import Link from "next/link";
import RoleSwitcher from "../components/RoleSwitcher";
import SmsToast from "../components/SmsToast";
import ClientOnly from "../components/ClientOnly";

export const metadata = {
  title: "PAKAZA | Fast. Safe. Nationwide.",
  description: "Matatu-powered parcel delivery network.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-pakaza-light min-h-screen flex flex-col relative">
        {/* Header with Clickable Home Logo */}
        <header className="bg-pakaza-blue text-white shadow-md sticky top-0 z-40 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* NEW: Wrapped in Link to act as Home Button */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-pakaza-blue font-black text-xl group-hover:scale-110 transition">P</div>
              <h1 className="text-xl font-bold tracking-tight">PAKAZA</h1>
            </Link>

            <p className="text-sm text-blue-100 hidden sm:block">Fast • Safe • Nationwide</p>
          </div>
        </header>

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ClientOnly>{children}</ClientOnly>
        </main>

        <footer className="bg-white border-t border-gray-200 py-6 mt-auto no-print">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            © 2026 PAKAZA Parcel Network. Demo Environment.
          </div>
        </footer>

        <div className="no-print">
          <SmsToast />
          <RoleSwitcher />
        </div>
      </body>
    </html>
  );
}
