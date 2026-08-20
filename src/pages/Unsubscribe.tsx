import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State = "loading" | "valid" | "invalid" | "already" | "success" | "submitting" | "error";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const r = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await r.json().catch(() => ({}));
        if (!r.ok) { setState("invalid"); return; }
        if (data.already_unsubscribed) { setState("already"); setEmail(data.email || ""); return; }
        setEmail(data.email || "");
        setState("valid");
      } catch {
        setState("invalid");
      }
    })();
  }, [token]);

  const confirm = async () => {
    setState("submitting");
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ token }),
      });
      if (!r.ok) throw new Error();
      setState("success");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="font-heading text-3xl tracking-wider mb-6">NATTY APPAREL</h1>
        {state === "loading" && <p className="text-muted-foreground">Verifying…</p>}
        {state === "invalid" && (
          <>
            <h2 className="text-xl font-semibold mb-3">Invalid or expired link</h2>
            <p className="text-muted-foreground">This unsubscribe link is no longer valid.</p>
          </>
        )}
        {state === "already" && (
          <>
            <h2 className="text-xl font-semibold mb-3">You're already unsubscribed</h2>
            <p className="text-muted-foreground">{email} will not receive further emails.</p>
          </>
        )}
        {(state === "valid" || state === "submitting") && (
          <>
            <h2 className="text-xl font-semibold mb-3">Unsubscribe</h2>
            <p className="text-muted-foreground mb-6">
              Stop sending emails to {email || "this address"}?
            </p>
            <button
              onClick={confirm}
              disabled={state === "submitting"}
              className="bg-foreground text-background font-medium px-6 py-3 rounded-md disabled:opacity-60"
            >
              {state === "submitting" ? "Unsubscribing…" : "Confirm unsubscribe"}
            </button>
          </>
        )}
        {state === "success" && (
          <>
            <h2 className="text-xl font-semibold mb-3">You're unsubscribed</h2>
            <p className="text-muted-foreground">{email} won't receive further emails.</p>
          </>
        )}
        {state === "error" && (
          <>
            <h2 className="text-xl font-semibold mb-3">Something went wrong</h2>
            <p className="text-muted-foreground">Please try again later.</p>
          </>
        )}
        <div className="mt-10">
          <Link to="/" className="text-sm underline text-muted-foreground">Back to NTY</Link>
        </div>
      </div>
    </div>
  );
}
