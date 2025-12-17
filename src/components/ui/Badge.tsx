import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { RiskLevel } from '../../types';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', color = 'default', className = '', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full';

    const variants = {
      default: {
        default: 'bg-slate-100 text-slate-700',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-700',
        danger: 'bg-red-50 text-red-700',
        info: 'bg-blue-50 text-blue-700',
      },
      outline: {
        default: 'border border-slate-200 text-slate-700',
        success: 'border border-emerald-200 text-emerald-700',
        warning: 'border border-amber-200 text-amber-700',
        danger: 'border border-red-200 text-red-700',
        info: 'border border-blue-200 text-blue-700',
      },
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant][color]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Risk-specific badge component
interface RiskBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  level: RiskLevel;
  showDot?: boolean;
}

export const RiskBadge = forwardRef<HTMLSpanElement, RiskBadgeProps>(
  ({ level, showDot = true, className = '', ...props }, ref) => {
    const styles = {
      low: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      medium: 'bg-amber-50 text-amber-700 border border-amber-200',
      high: 'bg-red-50 text-red-700 border border-red-200',
      critical: 'bg-red-100 text-red-800 border border-red-300',
    };

    const dotColors = {
      low: 'bg-emerald-500',
      medium: 'bg-amber-500',
      high: 'bg-red-500',
      critical: 'bg-red-600',
    };

    const labels = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${styles[level]} ${className}`}
        {...props}
      >
        {showDot && (
          <span className={`w-1.5 h-1.5 rounded-full ${dotColors[level]}`} />
        )}
        {labels[level]}
      </span>
    );
  }
);

RiskBadge.displayName = 'RiskBadge';
