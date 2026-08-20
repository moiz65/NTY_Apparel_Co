import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtMoney, textStyle } from "./types";

type Row = {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  order_amount: number;
  commission_amount: number;
  status: string;
  referral_code: string | null;
  created_at: string;
  affiliates?: { name: string } | null;
};

export function ReferralsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("affiliate_referrals")
        .select("*, affiliates(name)")
        .order("created_at", { ascending: false })
        .limit(200);
      setRows((data as Row[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div style={textStyle}>
      {loading ? (
        <p className="text-sm text-[hsl(215,16%,47%)]">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-12 text-center">
          <p className="text-sm text-[hsl(215,16%,47%)]">No referrals tracked yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(210,40%,96%)] text-[hsl(215,16%,47%)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Affiliate</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Commission</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(214,32%,91%)]">
              {rows.map((r) => (
                <tr key={r.id} className="text-[hsl(222,47%,11%)]">
                  <td className="px-4 py-3 text-[hsl(215,16%,47%)]">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{r.affiliates?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-mono">{r.referral_code ?? "—"}</td>
                  <td className="px-4 py-3">{r.order_number ?? "—"}</td>
                  <td className="px-4 py-3 text-[hsl(215,16%,47%)]">{r.customer_email ?? "—"}</td>
                  <td className="px-4 py-3">{fmtMoney(r.order_amount)}</td>
                  <td className="px-4 py-3 font-semibold">{fmtMoney(r.commission_amount)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      {r.status}
                    </span>
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
