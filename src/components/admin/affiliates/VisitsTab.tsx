import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { textStyle } from "./types";

type Row = {
  id: string;
  referral_code: string;
  path: string | null;
  country: string | null;
  created_at: string;
};

export function VisitsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("affiliate_visits")
        .select("*")
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
          <p className="text-sm text-[hsl(215,16%,47%)]">No visits tracked yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(210,40%,96%)] text-[hsl(215,16%,47%)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Path</th>
                <th className="px-4 py-3 font-medium">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(214,32%,91%)]">
              {rows.map((r) => (
                <tr key={r.id} className="text-[hsl(222,47%,11%)]">
                  <td className="px-4 py-3 text-[hsl(215,16%,47%)]">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono">{r.referral_code}</td>
                  <td className="px-4 py-3">{r.path ?? "—"}</td>
                  <td className="px-4 py-3">{r.country ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
