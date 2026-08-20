import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "nty_ref";
const SESSION_KEY = "nty_ref_logged";

export function RefTracker() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem(STORAGE_KEY, ref);
    }
    const code = ref || localStorage.getItem(STORAGE_KEY);
    if (!code) return;

    // log one visit per code per session+path
    const key = `${SESSION_KEY}:${code}:${location.pathname}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    supabase
      .from("affiliate_visits")
      .insert({
        referral_code: code,
        path: location.pathname,
        user_agent: navigator.userAgent.slice(0, 200),
      })
      .then(() => {});
  }, [location.pathname, location.search]);

  return null;
}
