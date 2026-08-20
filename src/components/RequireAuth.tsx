import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getPreviewModeFromSearch } from "@/lib/previewAccess";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ok" | "anon">("loading");
  useEffect(() => {
    if (getPreviewModeFromSearch(window.location.search) === "customer") {
      setState("ok");
      return;
    }

    supabase.auth.getSession().then(({ data }) => setState(data.session ? "ok" : "anon"));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setState(s ? "ok" : "anon"));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (state === "loading")
    return <div className="min-h-screen bg-background flex items-center justify-center text-xs tracking-widest uppercase text-muted-foreground">Loading...</div>;
  if (state === "anon") return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
