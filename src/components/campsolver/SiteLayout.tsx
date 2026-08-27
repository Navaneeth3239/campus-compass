import { Link } from "@tanstack/react-router";
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

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-lg font-bold">
            <ShieldCheck aria-hidden="true" className="size-6 text-primary" />
            CampSolver
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium lg:hidden"
          >
            <Menu aria-hidden="true" className="size-4" />
            Menu
          </button>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary data-[status=active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border bg-sidebar">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="inline-flex items-center gap-2 font-display text-base font-bold">
              <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
              CampSolver
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A public transparency record of campus issues, their progress, and the improvements
              they lead to. No account needed — ever.
            </p>
          </div>
          <nav aria-label="Footer" className="text-sm">
            <h2 className="font-semibold">Explore</h2>
            <ul className="mt-3 space-y-2">
              {navigation.slice(1).map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-sm">
            <h2 className="font-semibold">Privacy first</h2>
            <p className="mt-3 text-muted-foreground">
              Reporter names, emails, phone numbers, exact GPS coordinates and internal staff
              comments are never published on this site.
            </p>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CampSolver — campus accountability, in the open.
        </div>
      </footer>
    </div>
  );
}
