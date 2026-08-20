import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  subtitle?: string;
}

const textStyle: React.CSSProperties = { fontFamily: 'Inter, sans-serif', textTransform: 'none' as const, letterSpacing: 'normal' };

export function StatCard({ icon: Icon, iconBg, iconColor, label, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[hsl(214,32%,91%)] p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs text-[hsl(215,16%,47%)] mb-1" style={textStyle}>{label}</p>
        <p className="text-xl font-bold text-[hsl(222,47%,11%)]" style={textStyle}>{value}</p>
        {subtitle && <p className="text-xs text-[hsl(215,16%,47%)] mt-0.5" style={textStyle}>{subtitle}</p>}
      </div>
    </div>
  );
}
