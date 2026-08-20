import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fmtMoney, textStyle } from "./types";

type Aff = { id: string; name: string; email: string; earnings: number };
type Payout = {
  id: string;
  amount: number;
  status: string;
  payout_method: string | null;
  reference: string | null;
  created_at: string;
  paid_at: string | null;
  affiliates?: { name: string } | null;
};

export function PayoutsTab() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [affs, setAffs] = useState<Aff[]>([]);
  const [affId, setAffId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("PayPal");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [p, a] = await Promise.all([
      supabase.from("affiliate_payouts").select("*, affiliates(name)").order("created_at", { ascending: false }),
      supabase.from("affiliates").select("id,name,email,earnings").eq("status", "approved").order("name"),
    ]);
    setPayouts((p.data as Payout[]) || []);
    setAffs((a.data as Aff[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affId || !amount) return;
    const { error } = await supabase.from("affiliate_payouts").insert({
      affiliate_id: affId,
      amount: parseFloat(amount),
      payout_method: method,
      status: "pending",
    });
    if (error) return toast.error("Failed");
    toast.success("Payout queued");
    setAmount("");
    load();
  };

  const markPaid = async (id: string) => {
    await supabase
      .from("affiliate_payouts")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", id);
    toast.success("Marked paid");
    load();
  };

  return (
    <div style={textStyle} className="space-y-6">
      <form onSubmit={create} className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-[hsl(215,16%,47%)] mb-1">Affiliate</label>
          <select
            value={affId}
            onChange={(e) => setAffId(e.target.value)}
            className="w-full bg-white border border-[hsl(214,32%,91%)] rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select…</option>
            {affs.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({fmtMoney(a.earnings)} earned)
              </option>
            ))}
          </select>
        </div>
        <div className="w-32">
          <label className="block text-xs text-[hsl(215,16%,47%)] mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white border border-[hsl(214,32%,91%)] rounded-lg px-3 py-2 text-sm"
            placeholder="0.00"
          />
        </div>
        <div className="w-36">
          <label className="block text-xs text-[hsl(215,16%,47%)] mb-1">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full bg-white border border-[hsl(214,32%,91%)] rounded-lg px-3 py-2 text-sm"
          >
            <option>PayPal</option>
            <option>Bank transfer</option>
            <option>Stripe</option>
            <option>Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-[hsl(211,100%,50%)] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[hsl(211,100%,45%)]"
        >
          Queue payout
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-[hsl(215,16%,47%)]">Loading…</p>
      ) : payouts.length === 0 ? (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-12 text-center">
          <p className="text-sm text-[hsl(215,16%,47%)]">No payouts yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(210,40%,96%)] text-[hsl(215,16%,47%)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Affiliate</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(214,32%,91%)]">
              {payouts.map((p) => (
                <tr key={p.id} className="text-[hsl(222,47%,11%)]">
                  <td className="px-4 py-3 text-[hsl(215,16%,47%)]">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{p.affiliates?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold">{fmtMoney(p.amount)}</td>
                  <td className="px-4 py-3">{p.payout_method ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status !== "paid" && (
                      <button
                        onClick={() => markPaid(p.id)}
                        className="text-sm text-[hsl(211,100%,50%)] hover:underline"
                      >
                        Mark paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
