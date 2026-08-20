import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Mail, Instagram, Music2 } from "lucide-react";
import { toast } from "sonner";
import { fmtMoney, fmtNum, SITE_URL, textStyle } from "./types";

type Aff = {
  id: string;
  name: string;
  email: string;
  status: string;
  earnings: number;
  referral_code: string | null;
  instagram_handle: string | null;
  instagram_followers: number | null;
  tiktok_handle: string | null;
  tiktok_followers: number | null;
  approved_at: string | null;
};

export function AffiliatesTab() {
  const [rows, setRows] = useState<Aff[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("affiliates")
      .select("*")
      .eq("status", "approved")
      .order("earnings", { ascending: false });
    setRows((data as Aff[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("affs")
      .on("postgres_changes", { event: "*", schema: "public", table: "affiliates" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`${SITE_URL}/?ref=${code}`);
    toast.success("Link copied");
  };

  return (
    <div style={textStyle}>
      {loading ? (
        <p className="text-sm text-[hsl(215,16%,47%)]">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-12 text-center">
          <p className="text-sm text-[hsl(215,16%,47%)]">No active affiliates yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((a) => (
            <div key={a.id} className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-[hsl(222,47%,11%)]">{a.name}</p>
                  <div className="flex items-center gap-2 text-sm text-[hsl(215,16%,47%)] mt-1">
                    <Mail className="w-3.5 h-3.5" /> {a.email}
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm mt-2">
                    <span className="flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-500" />
                      {a.instagram_handle ? `@${a.instagram_handle}` : "—"} · {fmtNum(a.instagram_followers)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Music2 className="w-3.5 h-3.5" />
                      {a.tiktok_handle ? `@${a.tiktok_handle}` : "—"} · {fmtNum(a.tiktok_followers)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[hsl(215,16%,47%)]">Earnings</p>
                  <p className="text-xl font-semibold text-[hsl(222,47%,11%)]">{fmtMoney(a.earnings)}</p>
                </div>
              </div>
              {a.referral_code && (
                <div className="mt-4 pt-4 border-t border-[hsl(214,32%,91%)] flex items-center justify-between gap-3 bg-[hsl(210,40%,96%)] -mx-5 -mb-5 px-5 py-3 rounded-b-lg">
                  <div className="min-w-0">
                    <p className="text-xs text-[hsl(215,16%,47%)]">
                      Code <span className="font-semibold text-[hsl(222,47%,11%)]">{a.referral_code}</span>
                    </p>
                    <p className="text-sm font-mono text-[hsl(222,47%,11%)] truncate">
                      {SITE_URL}/?ref={a.referral_code}
                    </p>
                  </div>
                  <button
                    onClick={() => copyLink(a.referral_code!)}
                    className="bg-white border border-[hsl(214,32%,91%)] text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/70 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
