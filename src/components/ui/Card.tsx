import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'critical' | 'warning' | 'success' | 'panel';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'bg-white dark:bg-slate-900 rounded-xl transition-all duration-200';

    const variants = {
      default: 'shadow-card border border-slate-100 dark:border-slate-800 hover:shadow-card-hover',
      bordered: 'border-2 border-slate-200 dark:border-slate-700',
      elevated: 'shadow-lg hover:shadow-xl',
      // Risk semantic variants
      critical: 'border border-slate-100 dark:border-slate-800 border-t-2 border-t-risk-500 shadow-card hover:shadow-card-hover',
      warning: 'border border-slate-100 dark:border-slate-800 border-t-2 border-t-amber-500 shadow-card hover:shadow-card-hover',
      success: 'border border-slate-100 dark:border-slate-800 border-b-2 border-b-olive-500 shadow-card hover:shadow-card-hover',
      panel: 'border border-slate-200 dark:border-slate-800 shadow-panel hover:shadow-card-hover',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-between mb-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`font-display font-semibold text-lg text-slate-900 dark:text-white tracking-tight ${className}`}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

// Section divider component for consistent red accent lines
export function SectionDivider({ full = false }: { full?: boolean }) {
  return (
    <div className={full ? 'section-divider--full' : 'section-divider'} />
  );
}
