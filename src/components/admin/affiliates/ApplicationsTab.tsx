import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, Instagram, Music2, Mail, Users as UsersIcon, X, Phone, ChevronDown, ChevronUp, AtSign, Info, HelpCircle, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { fmtNum, generateCode, SITE_URL, textStyle } from "./types";

type App = {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  instagram_handle: string | null;
  instagram_followers: number | null;
  tiktok_handle: string | null;
  tiktok_followers: number | null;
  audience_description: string | null;
  why_join: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  social_handles?: string | null;
  total_followers_range?: string | null;
  platform_info?: string | null;
  how_did_you_find?: string | null;
  additional_notes?: string | null;
};

export function ApplicationsTab() {
  const [rows, setRows] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("affiliate_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as App[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("apps")
      .on("postgres_changes", { event: "*", schema: "public", table: "affiliate_applications" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const [approveDialog, setApproveDialog] = useState<App | null>(null);
  const [approveCode, setApproveCode] = useState("");
  const [approveDiscount, setApproveDiscount] = useState(10);
  const [approveCommission, setApproveCommission] = useState(15);

  const openApprove = (a: App) => {
    setApproveDialog(a);
    setApproveCode(generateCode(a.first_name || a.name) + "10");
    setApproveDiscount(10);
    setApproveCommission(15);
  };

  const confirmApprove = async () => {
    if (!approveDialog) return;
    const a = approveDialog;
    const code = approveCode.trim().toUpperCase();
    if (!code) { toast.error("Code required"); return; }
    setBusy(a.id);
    try {
      const { data: aff, error: e1 } = await supabase
        .from("affiliates")
        .insert({
          name: a.name,
          email: a.email,
          status: "approved",
          instagram_handle: a.instagram_handle,
          instagram_followers: a.instagram_followers,
          tiktok_handle: a.tiktok_handle,
          tiktok_followers: a.tiktok_followers,
          referral_code: code,
          approved_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (e1) throw e1;

      // Deactivate any prior link with this code (idempotent re-approve)
      await supabase.from("affiliate_coupon_links").update({ active: false }).eq("code", code);

      const { error: e2 } = await supabase.from("affiliate_coupon_links").insert({
        affiliate_id: aff!.id,
        code,
        discount_percent: approveDiscount,
        commission_percent: approveCommission,
        active: true,
      });
      if (e2) throw e2;

      // Register as a usable checkout coupon (customer-facing discount)
      const { error: e3 } = await supabase.from("generated_coupons").insert({
        code,
        email: a.email,
        amount: approveDiscount,
        discount_type: "percent",
        source: "affiliate",
        usage_limit: 100000,
      });
      if (e3) console.warn("generated_coupons insert:", e3.message);

      await supabase
        .from("affiliate_applications")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", a.id);

      const link = `${SITE_URL}/?ref=${code}`;
      const tierTemplate =
        approveCommission >= 20
          ? "affiliate-approved-gold"
          : approveCommission >= 15
          ? "affiliate-approved-silver"
          : "affiliate-approved-bronze";
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: tierTemplate,
          recipientEmail: a.email,
          idempotencyKey: `affiliate-approved-${a.id}-${tierTemplate}`,
          templateData: {
            first_name: (a.first_name || a.name || "").split(" ")[0],
            code,
            link,
            commission_percent: approveCommission,
            discount_percent: approveDiscount,
          },
        },
      });

      toast.success(`Approved — ${code} live · ${approveDiscount}% off / ${approveCommission}% commission`);
      setApproveDialog(null);
      load();
    } catch (e) {
      console.error(e);
      toast.error("Approval failed");
    } finally {
      setBusy(null);
    }
  };

  const reject = async (a: App) => {
    setBusy(a.id);
    await supabase
      .from("affiliate_applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", a.id);
    setBusy(null);
    toast.success("Rejected");
    load();
  };

  const filtered = rows.filter((r) => (filter === "all" ? true : r.status === filter));
  const counts = {
    all: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
  };

  return (
    <div style={textStyle}>
      <div className="flex gap-2 mb-6">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
              filter === f
                ? "bg-[hsl(211,100%,50%)] text-white border-[hsl(211,100%,50%)]"
                : "bg-white text-[hsl(222,47%,11%)] border-[hsl(214,32%,91%)] hover:bg-[hsl(210,40%,96%)]"
            }`}
            style={textStyle}
          >
            {f[0].toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-[hsl(215,16%,47%)]">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-12 text-center">
          <UsersIcon className="w-10 h-10 mx-auto text-[hsl(215,16%,47%)] mb-3" />
          <p className="text-sm text-[hsl(215,16%,47%)]">No applications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-base font-semibold text-[hsl(222,47%,11%)]">{a.name}</p>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full ${
                        a.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : a.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[hsl(215,16%,47%)] mb-3">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{a.email}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[hsl(222,47%,11%)]">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span>{a.instagram_handle ? `@${a.instagram_handle}` : "—"}</span>
                      <span className="text-[hsl(215,16%,47%)]">· {fmtNum(a.instagram_followers)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[hsl(222,47%,11%)]">
                      <Music2 className="w-4 h-4" />
                      <span>{a.tiktok_handle ? `@${a.tiktok_handle}` : "—"}</span>
                      <span className="text-[hsl(215,16%,47%)]">· {fmtNum(a.tiktok_followers)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs text-[hsl(215,16%,47%)]">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                  {a.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openApprove(a)}
                        disabled={busy === a.id}
                        className="bg-[hsl(211,100%,50%)] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[hsl(211,100%,45%)] disabled:opacity-50 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => reject(a)}
                        disabled={busy === a.id}
                        className="bg-white text-[hsl(222,47%,11%)] border border-[hsl(214,32%,91%)] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[hsl(210,40%,96%)] disabled:opacity-50 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setExpanded((s) => ({ ...s, [a.id]: !s[a.id] }))}
                className="mt-4 text-xs font-medium text-[hsl(211,100%,50%)] hover:text-[hsl(211,100%,40%)] flex items-center gap-1"
              >
                {expanded[a.id] ? <><ChevronUp className="w-3.5 h-3.5" /> Hide details</> : <><ChevronDown className="w-3.5 h-3.5" /> View full application</>}
              </button>

              {expanded[a.id] && (
                <div className="mt-4 pt-4 border-t border-[hsl(214,32%,91%)] grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <DetailRow icon={<UsersIcon className="w-3.5 h-3.5" />} label="Full Name" value={[a.first_name, a.last_name].filter(Boolean).join(" ") || a.name} />
                  <DetailRow icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={a.phone} />
                  <DetailRow icon={<AtSign className="w-3.5 h-3.5" />} label="Social Handles" value={a.social_handles} fullWidth />
                  <DetailRow icon={<UsersIcon className="w-3.5 h-3.5" />} label="Total Followers Range" value={a.total_followers_range} />
                  <DetailRow icon={<HelpCircle className="w-3.5 h-3.5" />} label="How They Found Us" value={a.how_did_you_find} />
                  <DetailRow icon={<Info className="w-3.5 h-3.5" />} label="Platform / Audience Info" value={a.platform_info} fullWidth />
                  <DetailRow icon={<StickyNote className="w-3.5 h-3.5" />} label="Additional Notes" value={a.additional_notes} fullWidth />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {approveDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setApproveDialog(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" style={textStyle}>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-semibold text-[hsl(222,47%,11%)]">Approve affiliate</h3>
              <button onClick={() => setApproveDialog(null)} className="text-[hsl(215,16%,47%)] hover:text-[hsl(222,47%,11%)]"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-[hsl(215,16%,47%)] mb-5">
              {approveDialog.name} · <span className="text-[hsl(222,47%,11%)]">{approveDialog.email}</span>
            </p>

            <label className="block text-xs font-medium uppercase tracking-wider text-[hsl(215,16%,47%)] mb-1.5">Coupon / Referral code</label>
            <input
              value={approveCode}
              onChange={(e) => setApproveCode(e.target.value.toUpperCase())}
              placeholder="e.g. JANE10"
              className="w-full px-3 py-2.5 border border-[hsl(214,32%,91%)] rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(211,100%,50%)]"
            />
            <p className="text-xs text-[hsl(215,16%,47%)] mt-1.5">Customers use this code at checkout. Link:{" "}
              <a href={`${SITE_URL}/?ref=${approveCode || "CODE"}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[hsl(211,100%,50%)] hover:underline">
                {SITE_URL}/?ref={approveCode || "CODE"}
              </a>
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[hsl(215,16%,47%)] mb-1.5">Customer discount %</label>
                <input
                  type="number" min={0} max={100}
                  value={approveDiscount}
                  onChange={(e) => setApproveDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-[hsl(214,32%,91%)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(211,100%,50%)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[hsl(215,16%,47%)] mb-1.5">Affiliate commission %</label>
                <input
                  type="number" min={0} max={100}
                  value={approveCommission}
                  onChange={(e) => setApproveCommission(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-[hsl(214,32%,91%)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(211,100%,50%)]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setApproveDialog(null)}
                className="px-4 py-2 text-sm font-medium text-[hsl(222,47%,11%)] border border-[hsl(214,32%,91%)] rounded-lg hover:bg-[hsl(210,40%,96%)]"
              >Cancel</button>
              <button
                onClick={confirmApprove}
                disabled={busy === approveDialog.id}
                className="px-4 py-2 text-sm font-medium text-white bg-[hsl(211,100%,50%)] rounded-lg hover:bg-[hsl(211,100%,45%)] disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Approve & send email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value, fullWidth }: { icon: ReactNode; label: string; value?: string | null; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[hsl(215,16%,47%)] mb-1">
        {icon}<span>{label}</span>
      </div>
      <p className="text-[hsl(222,47%,11%)] whitespace-pre-wrap break-words">{value || <span className="text-[hsl(215,16%,47%)]">—</span>}</p>
    </div>
  );
}
