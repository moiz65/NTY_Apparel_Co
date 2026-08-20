import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getPreviewModeFromSearch } from "@/lib/previewAccess";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "allowed" | "denied" | "anon">("loading");

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      if (getPreviewModeFromSearch(window.location.search) === "admin") {
        if (mounted) setState("allowed");
        return;
      }

      try {
        const { data: sess } = await supabase.auth.getSession();
        if (!sess.session) {
          if (mounted) setState("anon");
          return;
        }

        const { data: isAdmin, error } = await supabase.rpc("has_role", {
          _user_id: sess.session.user.id,
          _role: "admin",
        });

        if (!mounted) return;
        if (error) {
          setState("denied");
          return;
        }

        setState(isAdmin ? "allowed" : "denied");
      } catch {
        if (mounted) setState("denied");
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-xs tracking-widest uppercase text-muted-foreground">
        Verifying access...
      </div>
    );
  }
  if (state === "anon") return <Navigate to="/auth" replace />;
  if (state === "denied") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">403</p>
        <h1 className="text-3xl tracking-widest text-center" style={{ fontFamily: "'Arial Black', sans-serif" }}>
          ADMIN ACCESS ONLY
        </h1>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Your account is not authorized for the admin dashboard.
        </p>
        <a href="/account" className="border border-foreground px-5 py-2.5 text-xs tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition">
          Back to Account
        </a>
      </div>
    );
  }
  return <>{children}</>;
}
