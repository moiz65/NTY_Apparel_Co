import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { Link } from "react-router-dom";

interface Order {
  id: string; order_number: string; status: string; payment_method: string | null;
  total: number; subtotal: number; created_at: string;
  billing_email: string | null; line_items: any; tracking_number: string | null; coupon_code: string | null;
  shipping_name: string | null; shipping_address: string | null; shipping_city: string | null;
  shipping_state: string | null; shipping_zip: string | null; shipping_country: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
};

export function MyOrders({ email }: { email: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .ilike("billing_email", email)
      .neq("status", "suspicious")
      .order("created_at", { ascending: false })
      .limit(50);
    setOrders((data as any) || []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`orders-${email}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [email]);

  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Package className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">No orders yet</p>
        <Link to="/shop" className="inline-block text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-70">
          Start shopping
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => {
        const items = Array.isArray(o.line_items) ? o.line_items : [];
        const isOpen = expanded === o.id;
        const statusClass = STATUS_COLORS[o.status] || "bg-muted text-muted-foreground border-border";
        return (
          <Card key={o.id} className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <p className="text-sm tracking-wider">#{o.order_number}</p>
                  <Badge variant="outline" className={`text-[10px] tracking-[0.2em] uppercase ${statusClass}`}>{o.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()} · {o.payment_method || "Card"}</p>
              </div>
              <div className="text-right">
                <p className="text-lg" style={{ fontFamily: "'Arial Black', sans-serif" }}>${Number(o.total).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {items.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {items.slice(0, 4).map((it: any, i: number) => (
                  <div key={i} className="text-xs px-2.5 py-1 bg-muted rounded">
                    {it.name || it.title || "Item"} × {it.quantity || it.qty || 1}
                  </div>
                ))}
                {items.length > 4 && <div className="text-xs px-2.5 py-1 text-muted-foreground">+{items.length - 4} more</div>}
              </div>
            )}

            {o.tracking_number && (
              <a
                href={`https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(o.tracking_number)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs tracking-widest uppercase underline hover:opacity-70"
              >
                Track: {o.tracking_number}
              </a>
            )}

            <button
              onClick={() => setExpanded(isOpen ? null : o.id)}
              className="mt-4 flex items-center gap-1 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
            >
              {isOpen ? "Hide" : "View"} details
              {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {isOpen && (
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Shipping</p>
                  {o.shipping_name && <p>{o.shipping_name}</p>}
                  {o.shipping_address && <p className="text-muted-foreground">{o.shipping_address}</p>}
                  {(o.shipping_city || o.shipping_state) && (
                    <p className="text-muted-foreground">
                      {[o.shipping_city, o.shipping_state, o.shipping_zip].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {o.shipping_country && <p className="text-muted-foreground">{o.shipping_country}</p>}
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Summary</p>
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${Number(o.subtotal).toFixed(2)}</span></div>
                  {o.coupon_code && <div className="flex justify-between"><span className="text-muted-foreground">Coupon</span><span>{o.coupon_code}</span></div>}
                  <div className="flex justify-between font-medium pt-1 mt-1 border-t border-border"><span>Total</span><span>${Number(o.total).toFixed(2)}</span></div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
