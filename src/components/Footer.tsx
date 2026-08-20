import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-heading text-4xl tracking-widest text-foreground">NTY</span>
            <p className="font-body text-xs text-muted-foreground mt-3 leading-relaxed max-w-[200px]">
              Premium apparel for natural athletes. Earned, not given.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-foreground mb-4 font-semibold">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-foreground mb-4 font-semibold">Info</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/story" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/partners" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Partner Program
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-foreground mb-4 font-semibold">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@ntygear.com" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
                  support@ntygear.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            © 2026 NTY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
