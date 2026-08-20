import { useState } from "react";
import { MessageCircle, X, Mail, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUPPORT_EMAIL = "support@ntyapparel.com";

const SupportTab = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-72 bg-foreground text-background border border-foreground/20 shadow-2xl"
          >
            <div className="p-5 border-b border-background/10">
              <h3 className="font-heading text-lg tracking-wider">TALK TO A SPECIALIST</h3>
              <p className="font-body text-xs text-background/60 mt-1">We're here to help with any questions.</p>
            </div>
            <div className="p-5 space-y-3">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="group flex items-center justify-between w-full py-3 px-4 bg-background text-foreground font-body text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Support
                </span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Order%20Tracking%20Request`}
                className="group flex items-center justify-between w-full py-3 px-4 border border-background/20 text-background font-body text-xs tracking-[0.15em] uppercase hover:bg-background/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Track an Order
                </span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="px-5 pb-4">
              <p className="font-body text-[10px] text-background/40 text-center">
                Typically respond within 24 hours
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Talk to a specialist"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default SupportTab;
