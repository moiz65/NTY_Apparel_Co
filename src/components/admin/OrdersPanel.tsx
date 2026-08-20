import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, Search } from "lucide-react";

type Order = {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  billing_email: string | null;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  status: string;
  payment_method: string | null;
  payment_verified: boolean;
  coupon_code: string | null;
  line_items: any;
  subtotal: number;
  total: number;
  amount: number;
  tracking_number: string | null;
};

const PAGE_SIZE = 25;

const statusOptions = ["all", "pending", "processing", "shipped", "completed", "cancelled"];
const sourceOptions = ["all", "organic", "affiliate", "promo"];

function orderSource(o: Order): string {
  if (!o.coupon_code) return "organic";
  const c = o.coupon_code.toUpperCase();
  if (c.startsWith("LOYAL") || c.startsWith("AFF")) return "affiliate";
  return "promo";
}

function statusBadgeClass(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "completed" || s === "shipped")
    return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
  if (s === "processing") return "bg-blue-100 text-blue-700 hover:bg-blue-100";
  if (s === "pending") return "bg-amber-100 text-amber-700 hover:bg-amber-100";
  if (s === "cancelled") return "bg-red-100 text-red-700 hover:bg-red-100";
  return "bg-muted text-muted-foreground";
}

function itemsCount(li: any): number {
  if (!Array.isArray(li)) return 0;
  return li.reduce((sum: number, it: any) => sum + (Number(it?.quantity || it?.qty || 1) || 0), 0);
}

function formatMoney(n: number) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function formatDate(d: string) {
  const date = new Date(d);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      setError(error.message);
      setOrders([]);
    } else {
      setOrders((data as Order[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && (o.status || "").toLowerCase() !== statusFilter) return false;
      if (sourceFilter !== "all" && orderSource(o) !== sourceFilter) return false;
      if (q) {
        const blob = `${o.order_number} ${o.customer_name ?? ""} ${o.customer_email ?? ""} ${o.billing_email ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [orders, search, statusFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sourceFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
          Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length.toLocaleString()} orders</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, order number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-48 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="md:w-44 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            {sourceOptions.map((s) => (
              <SelectItem key={s} value={s}>{s === "all" ? "All Sources" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Couldn't load orders</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={load}>Retry</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border border-border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))}
            {!loading && pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                  No orders match your filters.
                </TableCell>
              </TableRow>
            )}
            {!loading && pageItems.map((o) => (
              <TableRow key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                <TableCell className="font-medium text-primary">{o.order_number}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(o.created_at)}</TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-foreground">{o.customer_name || o.shipping_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{o.customer_email || o.billing_email}</div>
                </TableCell>
                <TableCell className="text-center text-sm">{itemsCount(o.line_items)}</TableCell>
                <TableCell className="text-right font-medium">{formatMoney(o.total || o.amount)}</TableCell>
                <TableCell>
                  <Badge className={o.payment_verified ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}>
                    {o.payment_verified ? "Paid" : "Unpaid"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusBadgeClass(o.status)}>{(o.status || "pending").toUpperCase()}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelected(o); }}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
        {!loading && pageItems.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No orders match your filters.</div>
        )}
        {!loading && pageItems.map((o) => (
          <div key={o.id} onClick={() => setSelected(o)} className="bg-white border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium text-primary">{o.order_number}</div>
              <Badge className={statusBadgeClass(o.status)}>{(o.status || "pending").toUpperCase()}</Badge>
            </div>
            <div className="text-sm font-medium">{o.customer_name || o.shipping_name || "—"}</div>
            <div className="text-xs text-muted-foreground">{o.customer_email || o.billing_email}</div>
            <div className="flex items-center justify-between text-sm pt-1">
              <span className="text-muted-foreground">{itemsCount(o.line_items)} items · {formatDate(o.created_at)}</span>
              <span className="font-medium">{formatMoney(o.total || o.amount)}</span>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next</Button>
          </div>
        </div>
      )}

      <OrderDetailsDialog order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function OrderDetailsDialog({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const [notes, setNotes] = useState("");
  useEffect(() => { setNotes(""); }, [order?.id]);

  if (!order) return null;
  const li = Array.isArray(order.line_items) ? order.line_items : [];
  const subtotal = Number(order.subtotal || 0);
  const total = Number(order.total || order.amount || 0);
  const discount = Math.max(0, subtotal - total);

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order {order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge className={statusBadgeClass(order.status)}>{(order.status || "pending").toUpperCase()}</Badge>
            <Badge className={order.payment_verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
              {order.payment_verified ? "Paid" : "Unpaid"}
            </Badge>
            {order.payment_method && <Badge variant="outline">{order.payment_method}</Badge>}
            {order.coupon_code && <Badge variant="outline">Coupon: {order.coupon_code}</Badge>}
          </div>

          <section>
            <h3 className="font-medium mb-1">Customer</h3>
            <div>{order.customer_name || order.shipping_name}</div>
            <div className="text-muted-foreground">{order.customer_email || order.billing_email}</div>
          </section>

          <section>
            <h3 className="font-medium mb-1">Shipping</h3>
            <div className="text-muted-foreground">
              {[order.shipping_address, order.shipping_city, order.shipping_state, order.shipping_zip, order.shipping_country].filter(Boolean).join(", ") || "—"}
            </div>
          </section>

          <section>
            <h3 className="font-medium mb-2">Line items</h3>
            <div className="border border-border rounded-md divide-y divide-border">
              {li.length === 0 && <div className="p-3 text-muted-foreground">No line items</div>}
              {li.map((it: any, i: number) => (
                <div key={i} className="p-3 flex justify-between">
                  <div>
                    <div className="font-medium">{it.name || it.title || "Item"}</div>
                    <div className="text-xs text-muted-foreground">Qty {it.quantity || it.qty || 1}</div>
                  </div>
                  <div>{formatMoney(Number(it.price || it.amount || 0) * Number(it.quantity || it.qty || 1))}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border pt-3 space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatMoney(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{formatMoney(discount)}</span></div>}
            <div className="flex justify-between font-medium text-base pt-1"><span>Total</span><span>{formatMoney(total)}</span></div>
          </section>

          <section>
            <label className="block font-medium mb-1">Admin notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[80px] rounded-md border border-border bg-white p-2 text-sm"
              placeholder="Internal notes (not saved)"
            />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrdersPanel;
