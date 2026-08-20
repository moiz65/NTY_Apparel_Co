import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import productImage from "@/assets/product-founders-tee-back-cream.png";

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const couponCode = "WELCOME10";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("nty_welcome_seen")) return;
    setOpen(true);
    localStorage.setItem("nty_welcome_seen", "1");
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-foreground border-none text-background max-w-[90vw] md:max-w-[680px] p-0 overflow-hidden gap-0 [&>button]:text-background/40 [&>button]:hover:text-background">
        <DialogTitle className="sr-only">Welcome – Get 10% Off</DialogTitle>

        <div className="grid grid-cols-2">
          {/* Left — Product Image */}
          <div className="relative min-h-[280px] md:min-h-[360px]">
            <img
              src={productImage}
              alt="Natty Apparel"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Right — Content */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-background/40 mb-3">
              Welcome to Natty
            </p>
            <h2 className="font-heading text-3xl md:text-4xl tracking-wider text-background leading-[0.9] mb-2">
              GET 10% OFF
            </h2>
            <p className="font-body text-xs text-background/50 leading-relaxed mb-6">
              Enter your email to unlock your exclusive welcome discount.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/10 border border-background/20 text-background placeholder:text-background/30 font-body text-sm px-4 py-3 focus:outline-none focus:border-background/50 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-background text-foreground font-body text-xs tracking-[0.2em] uppercase py-3 hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                >
                  Unlock My Discount
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <button
                  onClick={handleCopy}
                  className="group inline-flex items-center gap-3 border-2 border-dashed border-background/30 hover:border-background/60 transition-colors duration-300 px-6 py-3"
                >
                  <span className="font-heading text-2xl tracking-[0.3em] text-background">
                    {couponCode}
                  </span>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-background/40 group-hover:text-background/80 transition-colors" />
                  )}
                </button>
                <p className="font-body text-xs text-background/30">
                  {copied ? "Copied!" : "Click to copy"}
                </p>
              </div>
            )}

            <p className="font-body text-[10px] text-background/20 mt-5">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
