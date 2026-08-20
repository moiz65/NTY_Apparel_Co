import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { textStyle } from "./types";

type Row = {
  id: string;
  code: string;
  discount_percent: number;
  commission_percent: number;
  active: boolean;
  uses_count: number;
  affiliate_id: string;
  affiliates?: { name: string; email: string } | null;
};

export function CouponsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("affiliate_coupon_links")
      .select("*, affiliates(name,email)")
      .order("created_at", { ascending: false });
    setRows((data as Row[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (r: Row) => {
    await supabase.from("affiliate_coupon_links").update({ active: !r.active }).eq("id", r.id);
    toast.success(r.active ? "Disabled" : "Enabled");
    load();
  };

  return (
    <div style={textStyle}>
      {loading ? (
        <p className="text-sm text-[hsl(215,16%,47%)]">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-12 text-center">
          <p className="text-sm text-[hsl(215,16%,47%)]">No coupons yet — approve an application to provision one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(210,40%,96%)] text-[hsl(215,16%,47%)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Affiliate</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Commission</th>
                <th className="px-4 py-3 font-medium">Uses</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(214,32%,91%)]">
              {rows.map((r) => (
                <tr key={r.id} className="text-[hsl(222,47%,11%)]">
                  <td className="px-4 py-3 font-mono font-semibold">{r.code}</td>
                  <td className="px-4 py-3">{r.affiliates?.name ?? "—"}</td>
                  <td className="px-4 py-3">{r.discount_percent}%</td>
                  <td className="px-4 py-3">{r.commission_percent}%</td>
                  <td className="px-4 py-3">{r.uses_count}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        r.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggle(r)}
                      className="text-sm text-[hsl(211,100%,50%)] hover:underline"
                    >
                      {r.active ? "Disable" : "Enable"}
                    </button>
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
