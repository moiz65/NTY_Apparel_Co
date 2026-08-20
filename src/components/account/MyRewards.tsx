import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { POINTS_PER_DOLLAR, TIERS, getTierByOrders } from "@/lib/rewards";
import { Gift, Flame, Calendar, Users, Sparkles, Star, Lock, Target, Copy, Check } from "lucide-react";

interface Rewards { points_balance: number; lifetime_earned: number; lifetime_redeemed: number; }
interface Txn { id: string; points: number; type: string; description: string | null; created_at: string; }

export function MyRewards({ userId, displayName }: { userId: string; displayName: string }) {
  const [rewards, setRewards] = useState<Rewards | null>(null);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [redeemAmt, setRedeemAmt] = useState(0);
  const [birthMonth, setBirthMonth] = useState("");
  const [savedMonth, setSavedMonth] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const sb: any = supabase;
    const [{ data: r }, { data: t }, { count }, { data: p }] = await Promise.all([
      sb.from("user_rewards").select("points_balance, lifetime_earned, lifetime_redeemed").eq("user_id", userId).maybeSingle(),
      sb.from("rewards_transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
      sb.from("orders").select("id", { count: "exact", head: true }).eq("user_id", userId),
      sb.from("profiles").select("birth_month, display_name").eq("user_id", userId).maybeSingle(),
    ]);
    setRewards((r as any) || { points_balance: 0, lifetime_earned: 0, lifetime_redeemed: 0 });
    setTxns((t as any) || []);
    setOrderCount(count || 0);
    const bm = (p as any)?.birth_month || "";
    setSavedMonth(bm);
    setBirthMonth(bm);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`rewards-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "user_rewards", filter: `user_id=eq.${userId}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "rewards_transactions", filter: `user_id=eq.${userId}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId]);

  const balance = rewards?.points_balance ?? 0;
  const lifetimeEarned = rewards?.lifetime_earned ?? 0;
  const { tier, next, ordersToNext, progress } = useMemo(() => getTierByOrders(orderCount), [orderCount]);
  const pointsProgress = next ? Math.min(100, (lifetimeEarned / (next.minOrders * 200)) * 100) : 100;
  const dollarsAvailable = Math.floor(balance / POINTS_PER_DOLLAR);
  const dollarsPreview = redeemAmt > 0 ? redeemAmt : 0;
  const TierIcon = tier.icon;

  const redeem = async () => {
    const pts = dollarsPreview * POINTS_PER_DOLLAR;
    if (pts < POINTS_PER_DOLLAR) { toast.error(`Need at least ${POINTS_PER_DOLLAR} points`); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("redeem-points", { body: { points_to_redeem: pts } });
      if (error) throw error;
      toast.success(`Redeemed for $${data.dollar_value.toFixed(2)} — code ${data.code}`);
      setRedeemAmt(0);
      load();
    } catch (e: any) {
      toast.error(e.message || "Redemption failed");
    } finally { setBusy(false); }
  };

  const saveBirthMonth = async () => {
    if (!birthMonth) return;
    const { error } = await supabase.from("profiles").update({ birth_month: birthMonth } as any).eq("user_id", userId);
    if (error) toast.error("Couldn't save"); else { toast.success("Birth month saved"); setSavedMonth(birthMonth); }
  };

  const referralLink = `${window.location.origin}/?ref=${userId.slice(0, 8)}`;
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 1500);
  };

  // Build last 6 months for streak (UI-only, derived from orders ideally — placeholder dots)
  const months = useMemo(() => {
    const arr: { label: string; active: boolean; current: boolean }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push({
        label: d.toLocaleString("en", { month: "short" }),
        active: false,
        current: i === 0,
      });
    }
    return arr;
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero stat card */}
      <section className="relative overflow-hidden border-2 border-gold/40 bg-gradient-to-br from-gold-soft/40 via-card to-card p-8 shadow-[0_4px_24px_-8px_hsl(var(--gold)/0.35)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="relative w-40 h-40 mx-auto md:mx-0">
            <div className="absolute inset-0 border-2 border-gold/60 bg-gradient-to-br from-gold/15 to-transparent" />
            <div className="absolute inset-2 border border-gold/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <TierIcon className="w-7 h-7 mb-2 text-gold-deep" strokeWidth={1.5} />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-deep font-semibold">LVL {TIERS.indexOf(tier) + 1}</p>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold-deep font-semibold mb-2">{tier.name}</p>
            <div className="text-6xl tracking-tight leading-none bg-gradient-to-br from-gold-deep via-gold to-gold-deep bg-clip-text text-transparent" style={{ fontFamily: "'Arial Black', sans-serif" }}>
              {balance.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              points balance · earning <span className="text-gold-deep font-semibold">{tier.multiplier} pts/$1</span>
            </p>
            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gold/25">
              <Stat label="Lifetime" value={lifetimeEarned.toLocaleString()} />
              <Stat label="Orders" value={orderCount.toString()} />
              <Stat label="On Next Order" value={`${tier.discountPercent}%`} sub={tier.discountPercent > 0 ? "auto-applied" : "no tier discount yet"} />
            </div>
          </div>
        </div>

        {/* Tier ladder */}
        <div className="relative mt-8 pt-6 border-t border-gold/25">
          <div className="flex items-center justify-between gap-2 sm:gap-4 relative">
            <div className="absolute left-6 right-6 top-5 h-px bg-gradient-to-r from-gold/20 via-gold/60 to-gold/20" />
            {TIERS.map((t) => {
              const Icon = t.icon;
              const isCurrent = t.key === tier.key;
              const isUnlocked = orderCount >= t.minOrders;
              return (
                <div key={t.key} className="relative flex flex-col items-center gap-2 z-10 flex-1">
                  <div className={`w-11 h-11 flex items-center justify-center border-2 transition-all ${isCurrent ? "bg-gradient-to-br from-gold to-gold-deep text-white border-gold-deep shadow-[0_0_0_4px_hsl(var(--gold)/0.2)]" : isUnlocked ? "bg-gold-soft/50 border-gold text-gold-deep" : "bg-background border-foreground/15 text-muted-foreground"}`}>
                    {isUnlocked ? <Icon className="w-4 h-4" strokeWidth={1.5} /> : <Lock className="w-3.5 h-3.5" />}
                  </div>
                  <p className={`text-[10px] tracking-[0.2em] uppercase ${isCurrent ? "text-gold-deep font-semibold" : isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>{t.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Next tier progress */}
      {next && (
        <section className="border border-gold/20 bg-gradient-to-br from-gold-soft/15 to-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <p className="text-xs tracking-[0.3em] uppercase">Next: {next.name}</p>
            </div>
            <p className="text-xs tracking-wider uppercase text-muted-foreground">
              {ordersToNext} order{ordersToNext === 1 ? "" : "s"} away
            </p>
          </div>
          <ProgressRow label="Order Progress" value={progress} />
          <div className="h-3" />
          <ProgressRow label="Points Progress" value={pointsProgress} />
        </section>
      )}

      {/* Redeem at checkout */}
      <section className="border border-gold/20 bg-gradient-to-br from-gold-soft/15 to-card p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 border-2 border-gold/40 bg-gold-soft/30 text-gold-deep flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase">Redeem At Checkout</p>
            <p className="text-xs text-muted-foreground mt-1">{POINTS_PER_DOLLAR} pts = $1 off · whole-dollar increments</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Box label="Your Points" value={balance.toLocaleString()} />
          <Box label="Points Value" value={`$${dollarsAvailable}`} sub="in cart credit" />
        </div>
        <div className="flex gap-2 items-stretch">
          <input
            type="number"
            min={0}
            max={dollarsAvailable}
            value={redeemAmt || ""}
            onChange={(e) => setRedeemAmt(Math.max(0, Math.min(dollarsAvailable, Math.floor(Number(e.target.value) || 0))))}
            placeholder={`$ off (max $${dollarsAvailable})`}
            className="flex-1 border border-foreground/15 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
          />
          <button
            onClick={redeem}
            disabled={busy || dollarsPreview < 1}
            className="bg-foreground text-background px-5 py-2.5 text-xs tracking-[0.2em] uppercase disabled:opacity-40 hover:opacity-90 transition"
          >
            {busy ? "..." : `Redeem $${dollarsPreview}`}
          </button>
        </div>
      </section>

      {/* Streak */}
      <section className="border border-gold/20 bg-gradient-to-br from-gold-soft/15 to-card p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 border-2 border-gold/40 bg-gold-soft/30 text-gold-deep flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase">Start A Streak</p>
            <p className="text-xs text-muted-foreground mt-1">Order every month to earn bonus points</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          Place at least one order each calendar month to build your streak. Hit 3, 6, or 12 consecutive months to unlock big bonus points. Miss a month and your streak resets.
        </p>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {months.map((m) => (
            <div key={m.label} className={`aspect-square border flex flex-col items-center justify-center text-center ${m.current ? "border-foreground border-dashed" : "border-foreground/15"}`}>
              <span className={`text-base ${m.active ? "" : "text-muted-foreground"}`}>{m.active ? "🔥" : "—"}</span>
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{m.label}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] tracking-widest uppercase">
          <div className="border border-foreground/10 px-3 py-2 text-center">3mo → 500 pts</div>
          <div className="border border-foreground/10 px-3 py-2 text-center">6mo → 1,500 pts</div>
          <div className="border border-foreground/10 px-3 py-2 text-center">12mo → 5,000 pts</div>
        </div>
      </section>

      {/* Birthday */}
      <section className="border border-gold/20 bg-gradient-to-br from-gold-soft/15 to-card p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 border-2 border-gold/40 bg-gold-soft/30 text-gold-deep flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase">Add Your Birthday</p>
            <p className="text-xs text-muted-foreground mt-1">Get a free gift during your birthday month</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
            className="flex-1 border border-foreground/15 bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
          >
            <option value="">Select your birth month</option>
            {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button
            onClick={saveBirthMonth}
            disabled={!birthMonth || birthMonth === savedMonth}
            className="bg-foreground text-background px-5 py-2.5 text-xs tracking-[0.2em] uppercase disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </section>

      {/* Refer */}
      <section className="border border-gold/20 bg-gradient-to-br from-gold-soft/15 to-card p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 border-2 border-gold/40 bg-gold-soft/30 text-gold-deep flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase">Refer A Friend & Earn</p>
            <p className="text-xs text-muted-foreground mt-1">They get <span className="text-foreground font-medium">$15 off</span>, you get <span className="text-foreground font-medium">200 points</span></p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            readOnly
            value={referralLink}
            className="flex-1 border border-foreground/15 bg-background px-3 py-2.5 text-xs font-mono"
          />
          <button onClick={copyLink} className="bg-foreground text-background px-5 py-2.5 text-xs tracking-[0.2em] uppercase flex items-center gap-1.5">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      </section>

      {/* How tiers work */}
      <section className="border border-gold/20 bg-gradient-to-br from-gold-soft/15 to-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" />
          <p className="text-xs tracking-[0.3em] uppercase">How Tiers Work</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Your tier is based on completed orders in a rolling 12-month period. The more you order, the faster you climb. 60 days of inactivity drops you one tier (never below Explorer).
        </p>
        <div className="space-y-3">
          {TIERS.map((t) => {
            const Icon = t.icon;
            const isCurrent = t.key === tier.key;
            return (
              <div key={t.key} className={`border p-5 ${isCurrent ? "border-foreground" : "border-foreground/10"}`}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 flex items-center justify-center border ${isCurrent ? "bg-foreground text-background border-foreground" : "border-foreground/20"}`}>
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm tracking-[0.25em] uppercase font-medium">{t.name}</p>
                    {isCurrent && <span className="text-[10px] tracking-[0.2em] uppercase border border-foreground px-2 py-0.5">You're Here</span>}
                  </div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                    {t.minOrders === 0 ? "Starting Tier" : `${t.minOrders} orders in 12-month period`}
                  </p>
                </div>
                <ul className="space-y-1.5 pl-12">
                  {t.perks.map((p) => (
                    <li key={p} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Activity */}
      <section className="border border-gold/20 bg-gradient-to-br from-gold-soft/15 to-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4" />
          <p className="text-xs tracking-[0.3em] uppercase">Points Activity</p>
        </div>
        {txns.length === 0 ? (
          <div className="py-12 text-center">
            <Star className="w-8 h-8 mx-auto mb-3 text-muted-foreground/40" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground tracking-wider uppercase">No points activity yet</p>
          </div>
        ) : (
          <div className="divide-y divide-foreground/10">
            {txns.map((t) => {
              const positive = t.points > 0;
              return (
                <div key={t.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm truncate">{t.description || t.type}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-medium shrink-0 ${positive ? "" : "text-muted-foreground"}`}>
                    {positive ? "+" : ""}{t.points} pts
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-2xl tracking-tight" style={{ fontFamily: "'Arial Black', sans-serif" }}>{value}</p>
      <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-1">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground/70">{sub}</p>}
    </div>
  );
}

function Box({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-gold/30 bg-gradient-to-br from-gold-soft/30 to-transparent p-4 text-center">
      <p className="text-[10px] tracking-[0.25em] uppercase text-gold-deep font-semibold">{label}</p>
      <p className="text-2xl mt-1 text-gold-deep" style={{ fontFamily: "'Arial Black', sans-serif" }}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] tracking-[0.25em] uppercase mb-1.5">
        <span className="text-gold-deep font-semibold">{label}</span>
        <span className="text-gold-deep font-semibold">{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-gold-soft/40 overflow-hidden rounded-full">
        <div className="h-full bg-gradient-to-r from-gold to-gold-deep transition-all rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
