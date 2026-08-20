import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Ticket } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string; code: string; amount: number; discount_type: string;
  source: string | null; expires_at: string | null;
  times_used: number; usage_limit: number;
}

export function MyCodes({ email }: { email: string }) {
  const [codes, setCodes] = useState<Coupon[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("generated_coupons")
        .select("*")
        .ilike("email", email)
        .order("created_at", { ascending: false });
      const now = Date.now();
      const valid = ((data as any[]) || []).filter((c) => {
        if (c.times_used >= c.usage_limit) return false;
        if (c.expires_at && new Date(c.expires_at).getTime() < now) return false;
        if (c.discount_type === "percent" && Number(c.amount) > 30) return false;
        return true;
      });
      setCodes(valid);
    };
    load();
  }, [email]);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success("Code copied");
    setTimeout(() => setCopied(null), 1500);
  };

  const label = (c: Coupon) => {
    if (c.discount_type === "percent") return `${c.amount}% off`;
    if (c.discount_type === "fixed") return `$${Number(c.amount).toFixed(2)} off`;
    return "Free shipping";
  };

  if (codes.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Ticket className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm tracking-wider uppercase text-muted-foreground">No active codes</p>
        <p className="text-xs text-muted-foreground mt-2">Earn loyalty codes after each order, or redeem points for credit.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {codes.map((c) => (
        <Card key={c.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <code className="text-sm font-mono tracking-wider bg-muted px-2 py-1">{c.code}</code>
              <Badge variant="outline" className="text-[10px] tracking-widest uppercase">{label(c)}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {c.source === "loyalty_ladder" ? "Loyalty reward" : c.source === "points_redemption" ? "Points redemption" : "Available"}
              {c.expires_at && ` · Expires ${new Date(c.expires_at).toLocaleDateString()}`}
            </p>
          </div>
          <button
            onClick={() => copy(c.code)}
            className="text-xs tracking-[0.2em] uppercase border border-border px-3 py-2 hover:bg-foreground hover:text-background transition flex items-center gap-1.5"
          >
            {copied === c.code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied === c.code ? "Copied" : "Copy"}
          </button>
        </Card>
      ))}
    </div>
  );
}
