import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShieldCheck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/dashboard", label: "Public Dashboard" },
  { to: "/improvements", label: "Campus Improvements" },
  { to: "/statistics", label: "Statistics" },
] as const;

export function LightSiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold text-gray-900">
            <div className="w-8 h-8 bg-[#0A3019] rounded-md flex items-center justify-center">
              <ShieldCheck aria-hidden="true" className="size-5 text-white" />
            </div>
            CampSolver
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-2 lg:flex">
            {navigation.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all rounded-full",
                    isActive 
                      ? "bg-green-50 text-green-800" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium lg:hidden text-gray-700"
          >
            <Menu aria-hidden="true" className="size-4" />
          </button>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className={cn("border-t border-gray-200 lg:hidden bg-white", open ? "block" : "hidden")}
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6 space-y-1">
            {navigation.map((item) => {
               const isActive = location.pathname === item.to;
               return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium",
                    isActive ? "bg-green-50 text-green-800" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
               )
            })}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#F3F4F6] text-gray-900 border-t border-gray-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold text-gray-900">
              <div className="w-8 h-8 bg-[#FBBF24] rounded-md flex items-center justify-center">
                <ShieldCheck aria-hidden="true" className="size-5 text-[#0A3019]" />
              </div>
              CampSolver
            </Link>
            <p className="mt-4 max-w-sm text-sm text-gray-600 leading-relaxed">
              A secure, open-records infrastructure for tracking, resolving, and displaying modern campus infrastructure improvements. Built for student reassurance and operational accountability.
            </p>
          </div>
          
          <nav aria-label="Footer Platform" className="text-sm">
            <h2 className="font-bold text-[#0A3019] uppercase tracking-wider text-xs mb-4">Platform</h2>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Public Dashboard</Link></li>
              <li><Link to="/improvements" className="text-gray-600 hover:text-gray-900">Improvements Map</Link></li>
              <li><Link to="/statistics" className="text-gray-600 hover:text-gray-900">System Statistics</Link></li>
            </ul>
          </nav>
          
          <nav aria-label="Footer Transparency" className="text-sm">
            <h2 className="font-bold text-[#0A3019] uppercase tracking-wider text-xs mb-4">Transparency</h2>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">Open Records</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">Privacy Charter</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">Resolution SLA</Link></li>
            </ul>
          </nav>
          
          <nav aria-label="Footer Administration" className="text-sm">
            <h2 className="font-bold text-[#0A3019] uppercase tracking-wider text-xs mb-4">Administration</h2>
            <ul className="space-y-3">
              <li><Link to="/admin/login" className="text-gray-600 hover:text-gray-900">Faculty Access</Link></li>
              <li><Link to="/admin/login" className="text-gray-600 hover:text-gray-900">Facilities Portal</Link></li>
              <li><Link to="/admin/login" className="text-gray-600 hover:text-gray-900">Support Desk</Link></li>
            </ul>
          </nav>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 sm:px-6 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} CampSolver Inc. All information published on public dashboards is sourced from verified institutional reporting feeds.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
