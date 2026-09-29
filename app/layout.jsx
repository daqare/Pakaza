import "./globals.css";
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
        <header className="bg-pakaza-blue text-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-pakaza-blue font-black text-xl">P</div>
              <h1 className="text-xl font-bold tracking-tight">PAKAZA</h1>
            </div>
            <p className="text-sm text-blue-100 hidden sm:block">Fast • Safe • Nationwide</p>
          </div>
        </header>

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ClientOnly>{children}</ClientOnly>
        </main>

        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            © 2026 PAKAZA Parcel Network. Demo Environment.
          </div>
        </footer>

        <SmsToast />
        <RoleSwitcher />
      </body>
    </html>
  );
}
