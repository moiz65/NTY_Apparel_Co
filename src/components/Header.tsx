import { useEffect, useState } from "react";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { to: "https://ntygear.com/collections/all", label: "Shop" },
  { to: "https://ntygear.com/pages/the-nty-story", label: "The NTY Story" },
  { to: "https://ntygear.com/pages/partners", label: "Partner Program" },
  { to: "https://ntygear.com/pages/natty-verified", label: "Natty Verified" },
  { to: "https://ntygear.com/pages/contact-us", label: "Contact Us" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="px-6 lg:px-12 py-5">
        <div className="flex items-center justify-between">
          {/* Left — Logo + Mobile/Tablet toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-foreground"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="https://ntygear.com" className="text-[1.35rem] lg:text-[1.65rem] tracking-widest text-foreground leading-none -ml-3" style={{ fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif" }}>
              NATTY
            </Link>
          </div>

          {/* Center — Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — Icons */}
          <div className="flex items-center gap-5">
            <button aria-label="Search" className="text-foreground hover:text-accent transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to={authed ? "/account" : "/auth"} aria-label="Account" className="text-foreground hover:text-accent transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button aria-label="Cart" className="relative text-foreground hover:text-accent transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet nav */}
      {mobileOpen && (
        <nav className="lg:hidden bg-background border-t border-border px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-body text-sm tracking-[0.15em] uppercase text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;



