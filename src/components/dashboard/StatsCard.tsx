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
    violet: 'bg-lumina-50 dark:bg-lumina-900/50 text-lumina-600 dark:text-lumina-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400',
    blue: 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
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
    if (!change) return 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800';
    // For risks, going down is good (green), up is bad (red)
    return change < 0
      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/50'
      : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
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
                <span className="text-xs text-slate-400 dark:text-slate-500">{changeLabel}</span>
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
