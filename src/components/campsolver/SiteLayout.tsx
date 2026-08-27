import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShieldCheck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report an Issue" },
  { to: "/issues", label: "Issues" },
  { to: "/track", label: "Track Issue" },
  { to: "/about", label: "About" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
      <header className="sticky top-0 z-40 bg-[#0A3019] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold uppercase tracking-wide">
            <ShieldCheck aria-hidden="true" className="size-6 text-[#FBBF24]" />
            CAMPSOLVER
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {navigation.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#FBBF24]",
                    isActive ? "text-[#FBBF24] border-b-2 border-[#FBBF24] pb-1" : "text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse"></span>
              Live Campus Issues
            </div>
            <Link
              to="/admin/login"
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Admin
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 px-3 py-2 text-sm font-medium lg:hidden text-white"
          >
            <Menu aria-hidden="true" className="size-4" />
          </button>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className={cn("border-t border-white/10 lg:hidden bg-[#0A3019]", open ? "block" : "hidden")}
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[#FBBF24] hover:bg-white/10"
            >
              Admin Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0A3019] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold uppercase tracking-wide">
              <ShieldCheck aria-hidden="true" className="size-6 text-[#FBBF24]" />
              CAMPSOLVER
            </Link>
            <p className="mt-4 max-w-sm text-sm text-white/70 leading-relaxed">
              A secure, open-records infrastructure for tracking, resolving, and displaying modern campus infrastructure improvements. Built for student reassurance and operational accountability.
            </p>
          </div>
          
          <nav aria-label="Footer Platform" className="text-sm">
            <h2 className="font-semibold text-[#FBBF24] uppercase tracking-wider text-xs mb-4">Platform</h2>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-white/70 hover:text-white">Public Dashboard</Link></li>
              <li><Link to="/improvements" className="text-white/70 hover:text-white">Improvements Map</Link></li>
              <li><Link to="/statistics" className="text-white/70 hover:text-white">System Statistics</Link></li>
            </ul>
          </nav>
          
          <nav aria-label="Footer Transparency" className="text-sm">
            <h2 className="font-semibold text-[#FBBF24] uppercase tracking-wider text-xs mb-4">Transparency</h2>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-white/70 hover:text-white">Open Records</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-white">Privacy Charter</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-white">Resolution SLA</Link></li>
            </ul>
          </nav>
          
          <nav aria-label="Footer Administration" className="text-sm">
            <h2 className="font-semibold text-[#FBBF24] uppercase tracking-wider text-xs mb-4">Administration</h2>
            <ul className="space-y-3">
              <li><Link to="/admin/login" className="text-white/70 hover:text-white">Faculty Access</Link></li>
              <li><Link to="/admin/login" className="text-white/70 hover:text-white">Facilities Portal</Link></li>
              <li><Link to="/admin/login" className="text-white/70 hover:text-white">Support Desk</Link></li>
            </ul>
          </nav>
        </div>
        
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 sm:px-6 text-xs text-white/50">
            <p>© {new Date().getFullYear()} CampSolver Inc. All information published on public dashboards is sourced from verified institutional reporting feeds.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
