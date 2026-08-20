import { StatCard } from "./StatCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  ShoppingCart,
  Clock,
  Users,
  UserCheck,
  Eye,
  Globe,
  Zap,
  FileText,
  Trophy,
  Gift,
  Package,
} from "lucide-react";

const textStyle: React.CSSProperties = { fontFamily: 'Inter, sans-serif', textTransform: 'none' as const, letterSpacing: 'normal' };

const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const num = (n: number) => n.toLocaleString();

export function DashboardOverview() {
  const data = useDashboardData();

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-red-100 text-red-700",
  ];

  return (
    <div style={textStyle}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(222,47%,11%)]" style={{ ...textStyle, fontFamily: 'Inter, sans-serif' }}>Dashboard</h1>
          <p className="text-sm text-[hsl(215,16%,47%)] mb-6" style={textStyle}>NTY Apparel admin overview</p>
        </div>
        <button
          onClick={() => data.refetch()}
          className="bg-[hsl(211,100%,50%)] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[hsl(211,100%,45%)] transition-colors"
          style={textStyle}
        >
          Refresh
        </button>
      </div>

      {/* Live visitors */}
      <div className="flex items-center gap-2 mb-6 bg-white rounded-lg px-4 py-2.5 w-fit border border-[hsl(214,32%,91%)]">
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium" style={textStyle}>0</span>
        <span className="text-sm text-[hsl(215,16%,47%)]" style={textStyle}>live visitors right now</span>
      </div>

      {/* Revenue row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard icon={DollarSign} iconBg="bg-green-100" iconColor="text-green-600" label="Revenue Today" value={fmt(data.revenueToday)} />
        <StatCard icon={TrendingUp} iconBg="bg-blue-100" iconColor="text-blue-600" label="Revenue This Week" value={fmt(data.revenueWeek)} />
        <StatCard icon={BarChart3} iconBg="bg-yellow-100" iconColor="text-yellow-600" label="Revenue This Month" value={fmt(data.revenueMonth)} />
        <StatCard icon={DollarSign} iconBg="bg-green-100" iconColor="text-green-600" label="Avg Order Value" value={fmt(data.avgOrderValue)} />
      </div>

      {/* Orders row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard icon={ShoppingCart} iconBg="bg-blue-100" iconColor="text-blue-600" label="Orders Today" value={num(data.ordersToday)} subtitle={`${num(data.totalOrders)} total`} />
        <StatCard icon={Clock} iconBg="bg-orange-100" iconColor="text-orange-500" label="Pending Payment" value={num(data.pendingPayment)} />
        <StatCard icon={Users} iconBg="bg-red-100" iconColor="text-red-500" label="Pending Affiliates" value={num(data.pendingAffiliates)} />
        <StatCard icon={UserCheck} iconBg="bg-green-100" iconColor="text-green-600" label="Active Affiliates" value={num(data.activeAffiliates)} />
      </div>

      {/* Visitors row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Eye} iconBg="bg-blue-100" iconColor="text-blue-600" label="Visitors Today" value={num(data.visitorsToday)} subtitle={`${num(data.pageviewsToday)} pageviews`} />
        <StatCard icon={Globe} iconBg="bg-green-100" iconColor="text-green-600" label="Visitors This Week" value={num(data.visitorsWeek)} subtitle={`${num(data.pageviewsWeek)} pageviews`} />
        <StatCard icon={Zap} iconBg="bg-purple-100" iconColor="text-purple-600" label="Total Pageviews" value={num(data.totalPageviews)} />
        <StatCard icon={FileText} iconBg="bg-gray-100" iconColor="text-gray-600" label="Top Page (Week)" value={data.topPage.path || "—"} subtitle={data.topPage.views ? `${data.topPage.views} views` : "0 views"} />
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4" style={textStyle}>Top Pages This Week</h2>
        {data.topPages.length === 0 ? (
          <p className="text-sm text-[hsl(215,16%,47%)] py-4" style={textStyle}>No page views yet</p>
        ) : (
          <div className="divide-y divide-[hsl(214,32%,91%)]">
            {data.topPages.map(([path, views]) => (
              <div key={path} className="flex justify-between items-center py-3">
                <span className="text-sm" style={textStyle}>{path}</span>
                <span className="text-sm text-[hsl(215,16%,47%)]" style={textStyle}>{views} views</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visitor Countries */}
      <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-[hsl(215,16%,47%)]" />
          <h2 className="text-lg font-semibold" style={textStyle}>Visitor Countries This Week</h2>
        </div>
        {data.topCountries.length === 0 ? (
          <p className="text-sm text-[hsl(215,16%,47%)] py-4" style={textStyle}>No visitor data yet</p>
        ) : (
          <div className="divide-y divide-[hsl(214,32%,91%)]">
            {data.topCountries.map(([country, visits]) => (
              <div key={country} className="flex justify-between items-center py-3">
                <span className="text-sm font-medium" style={textStyle}>{country}</span>
                <span className="text-sm text-[hsl(215,16%,47%)]" style={textStyle}>{visits} visits</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Product & Top Affiliate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <Package className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-[hsl(215,16%,47%)]" style={textStyle}>Top Product</p>
            <p className="text-lg font-bold" style={textStyle}>—</p>
            <p className="text-xs text-[hsl(215,16%,47%)]" style={textStyle}>No sales yet</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-[hsl(215,16%,47%)]" style={textStyle}>Top Affiliate</p>
            <p className="text-lg font-bold" style={textStyle}>{data.topAffiliate?.name || "—"}</p>
            <p className="text-xs text-[hsl(215,16%,47%)]" style={textStyle}>
              {data.topAffiliate ? `${fmt(Number(data.topAffiliate.earnings))} earnings` : "No affiliates yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <Gift className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-[hsl(215,16%,47%)]" style={textStyle}>Total Points Balance</p>
            <p className="text-2xl font-bold" style={textStyle}>{num(data.pointsBalance)}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <Gift className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-[hsl(215,16%,47%)]" style={textStyle}>Lifetime Points Earned</p>
            <p className="text-2xl font-bold" style={textStyle}>{num(data.lifetimePoints)}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders & Recent Signups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold" style={textStyle}>Recent Orders</h2>
            <span className="text-sm text-[hsl(211,100%,50%)] cursor-pointer hover:underline" style={textStyle}>View All →</span>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-[hsl(215,16%,47%)] py-4" style={textStyle}>No orders yet</p>
          ) : (
            <div className="divide-y divide-[hsl(214,32%,91%)]">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium" style={textStyle}>{order.order_number}</p>
                    <p className="text-xs text-[hsl(215,16%,47%)]" style={textStyle}>{order.customer_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      order.status === "processing" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                    }`} style={textStyle}>{order.status}</span>
                    <span className="text-sm font-medium" style={textStyle}>{fmt(Number(order.amount))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold" style={textStyle}>Recent Signups</h2>
            <span className="text-sm text-[hsl(211,100%,50%)] cursor-pointer hover:underline" style={textStyle}>View All →</span>
          </div>
          {data.recentSignups.length === 0 ? (
            <p className="text-sm text-[hsl(215,16%,47%)] py-4" style={textStyle}>No signups yet</p>
          ) : (
            <div className="divide-y divide-[hsl(214,32%,91%)]">
              {data.recentSignups.map((signup, i) => (
                <div key={signup.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-xs font-semibold`} style={textStyle}>
                      {signup.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={textStyle}>{signup.name}</p>
                      <p className="text-xs text-[hsl(215,16%,47%)]" style={textStyle}>{signup.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[hsl(215,16%,47%)]" style={textStyle}>
                    {new Date(signup.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
