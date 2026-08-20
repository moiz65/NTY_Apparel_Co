import { Shield, Zap, Trophy, Crown, type LucideIcon } from "lucide-react";

export interface Tier {
  key: string;
  name: string;
  minOrders: number;
  multiplier: number;
  discountPercent: number;
  icon: LucideIcon;
  perks: string[];
}

export const TIERS: Tier[] = [
  {
    key: "explorer",
    name: "Explorer",
    minOrders: 0,
    multiplier: 2,
    discountPercent: 0,
    icon: Shield,
    perks: [
      "Earn 2 points per $1 spent",
      "Eligible for all standard promo codes",
      "200 pts = $1 off (on orders $75+)",
    ],
  },
  {
    key: "researcher",
    name: "Researcher",
    minOrders: 3,
    multiplier: 3,
    discountPercent: 5,
    icon: Zap,
    perks: [
      "Earn 3 points per $1 spent",
      "Free mystery vial on unlock, then every 8th order",
      "Pick your own vial from the approved pool in cart",
    ],
  },
  {
    key: "scientist",
    name: "Scientist",
    minOrders: 6,
    multiplier: 4,
    discountPercent: 10,
    icon: Trophy,
    perks: [
      "Earn 4 points per $1 spent",
      "Free mystery vial every 5th order",
      "All Researcher perks included",
    ],
  },
  {
    key: "elite",
    name: "Elite",
    minOrders: 12,
    multiplier: 5,
    discountPercent: 20,
    icon: Crown,
    perks: [
      "Earn 5 points per $1 spent",
      "20% off auto-applied at checkout",
      "Cannot be combined with any other code (incl. affiliate / promo codes)",
      "Free mystery vial every 3rd order",
    ],
  },
];

export const POINTS_PER_DOLLAR = 200; // 200 pts = $1 off

export function getTierByOrders(orderCount: number) {
  let current = TIERS[0];
  for (const t of TIERS) {
    if (orderCount >= t.minOrders) current = t;
  }
  const idx = TIERS.indexOf(current);
  const next = TIERS[idx + 1];
  const ordersToNext = next ? next.minOrders - orderCount : 0;
  const progress = next
    ? Math.min(100, ((orderCount - current.minOrders) / (next.minOrders - current.minOrders)) * 100)
    : 100;
  return { tier: current, next, ordersToNext, progress };
}

// Legacy lifetime-earned tier helper (kept for backwards compatibility)
export function getTier(lifetimeEarned: number) {
  const approxOrders = Math.floor(lifetimeEarned / 200);
  return getTierByOrders(approxOrders);
}
