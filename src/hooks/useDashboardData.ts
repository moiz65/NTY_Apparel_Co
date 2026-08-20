import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const startOfWeek = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const startOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

export function useDashboardData() {
  const today = startOfDay();
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const signupsQuery = useQuery({
    queryKey: ["admin-signups"],
    queryFn: async () => {
      const { data } = await supabase.from("signups").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const pageViewsQuery = useQuery({
    queryKey: ["admin-pageviews"],
    queryFn: async () => {
      const { data } = await supabase.from("page_views").select("*");
      return data || [];
    },
  });

  const affiliatesQuery = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: async () => {
      const { data } = await supabase.from("affiliates").select("*");
      return data || [];
    },
  });

  const metricsQuery = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const { data } = await supabase.from("dashboard_metrics").select("*");
      return data || [];
    },
  });

  const orders = ordersQuery.data || [];
  const signups = signupsQuery.data || [];
  const pageViews = pageViewsQuery.data || [];
  const affiliates = affiliatesQuery.data || [];
  const metrics = metricsQuery.data || [];

  // Computed stats
  const ordersToday = orders.filter(o => o.created_at >= today);
  const ordersWeek = orders.filter(o => o.created_at >= weekStart);
  const ordersMonth = orders.filter(o => o.created_at >= monthStart);

  const revenueToday = ordersToday.reduce((s, o) => s + Number(o.amount), 0);
  const revenueWeek = ordersWeek.reduce((s, o) => s + Number(o.amount), 0);
  const revenueMonth = ordersMonth.reduce((s, o) => s + Number(o.amount), 0);
  const avgOrderValue = orders.length > 0 ? orders.reduce((s, o) => s + Number(o.amount), 0) / orders.length : 0;

  const pendingOrders = orders.filter(o => o.status === "pending");
  const activeAffiliates = affiliates.filter(a => a.status === "active");
  const pendingAffiliates = affiliates.filter(a => a.status === "pending");

  const viewsToday = pageViews.filter(v => v.created_at >= today);
  const viewsWeek = pageViews.filter(v => v.created_at >= weekStart);

  // Top pages
  const pageCounts: Record<string, number> = {};
  viewsWeek.forEach(v => { pageCounts[v.path] = (pageCounts[v.path] || 0) + 1; });
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topPage = topPages[0] || ["/", 0];

  // Countries
  const countryCounts: Record<string, number> = {};
  viewsWeek.forEach(v => { if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1; });
  const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]);

  // Top affiliate
  const topAffiliate = [...affiliates].sort((a, b) => Number(b.earnings) - Number(a.earnings))[0];

  // Top product (from orders - simplified)
  const productCounts: Record<string, { count: number; revenue: number }> = {};
  // For now we don't have product-level data, so this will be empty

  const pointsBalance = metrics.find(m => m.metric_key === "total_points_balance")?.metric_value || 0;
  const lifetimePoints = metrics.find(m => m.metric_key === "lifetime_points_earned")?.metric_value || 0;

  // Traffic sources
  const sourceCounts: Record<string, { visits: number; unique: number }> = {};
  viewsWeek.forEach(v => {
    if (v.source) {
      if (!sourceCounts[v.source]) sourceCounts[v.source] = { visits: 0, unique: 0 };
      sourceCounts[v.source].visits++;
    }
  });

  return {
    revenueToday,
    revenueWeek,
    revenueMonth,
    avgOrderValue,
    ordersToday: ordersToday.length,
    totalOrders: orders.length,
    pendingPayment: pendingOrders.length,
    pendingAffiliates: pendingAffiliates.length,
    activeAffiliates: activeAffiliates.length,
    visitorsToday: viewsToday.length,
    visitorsWeek: viewsWeek.length,
    totalPageviews: pageViews.length,
    pageviewsToday: viewsToday.length,
    pageviewsWeek: viewsWeek.length,
    topPage: { path: topPage[0], views: topPage[1] },
    topPages,
    topCountries,
    topAffiliate,
    pointsBalance,
    lifetimePoints,
    recentOrders: orders.slice(0, 5),
    recentSignups: signups.slice(0, 5),
    sourceCounts: Object.entries(sourceCounts),
    isLoading: ordersQuery.isLoading || signupsQuery.isLoading || pageViewsQuery.isLoading,
    refetch: () => {
      ordersQuery.refetch();
      signupsQuery.refetch();
      pageViewsQuery.refetch();
      affiliatesQuery.refetch();
      metricsQuery.refetch();
    },
  };
}
