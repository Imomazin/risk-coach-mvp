import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: 'violet' | 'emerald' | 'amber' | 'red' | 'blue';
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'violet',
}: StatsCardProps) {
  const iconColors = {
    violet: 'bg-lumina-50 text-lumina-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  const getTrendIcon = () => {
    if (!change) return <Minus className="w-3 h-3" />;
    return change > 0 ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    );
  };

  const getTrendColor = () => {
    if (!change) return 'text-slate-500 bg-slate-50';
    // For risks, going down is good (green), up is bad (red)
    return change < 0
      ? 'text-emerald-600 bg-emerald-50'
      : 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-display font-bold text-slate-900">
            {value}
          </p>

          {(change !== undefined || changeLabel) && (
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTrendColor()}`}
              >
                {getTrendIcon()}
                {change ? `${Math.abs(change)}%` : '0%'}
              </span>
              {changeLabel && (
                <span className="text-xs text-slate-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl ${iconColors[iconColor]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
