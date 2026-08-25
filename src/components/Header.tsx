// components/Header.tsx
import { useEffect, useState } from "react";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { to: "https://ntygear.com/collections/all", label: "Shop" },
  { to: "https://ntygear.com/pages/the-nty-story", label: "The NTY Story" },
  { to: "https://ntygear.com/pages/partners", label: "Partner Program" },
  { to: "https://ntygear.com/pages/natty-verified", label: "Natty Verified" },
  { to: "https://ntygear.com/pages/contact-us", label: "Contact Us" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // ✅ Detect if on subdomain
  const isSubdomain = window.location.hostname.includes('login.');
  const mainDomain = 'https://ntygear.com';

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      // ✅ If on main domain, go to login subdomain
      if (!isSubdomain) {
        window.location.href = 'https://login.ntygear.com/auth';
        return;
      }
      navigate("/auth");
      return;
    }

    // ✅ Role based redirect
    if (user.role === 'admin') {
      // ✅ If on subdomain, redirect to main domain admin
      if (isSubdomain) {
        window.location.href = `${mainDomain}/admin`;
        return;
      }
      navigate("/admin");
    } else {
      // ✅ If on subdomain, redirect to main domain account
      if (isSubdomain) {
        window.location.href = `${mainDomain}/account`;
        return;
      }
      navigate("/account");
    }
  };

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
            <a href="https://ntygear.com" className="text-[1.35rem] lg:text-[1.65rem] tracking-widest text-foreground leading-none -ml-3" style={{ fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif" }}>
              NATTY
            </a>
          </div>

          {/* Center — Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="font-body text-sm tracking-[0.15em] uppercase text-foreground hover:text-accent transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right — Icons */}
          <div className="flex items-center gap-5">
            <button aria-label="Search" className="text-foreground hover:text-accent transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleAccountClick}
              aria-label="Account" 
              className="text-foreground hover:text-accent transition-colors relative"
            >
              <User className="w-5 h-5" />
              {user && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
            
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
            <a
              key={link.to}
              href={link.to}
              className="font-body text-sm tracking-[0.15em] uppercase text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;