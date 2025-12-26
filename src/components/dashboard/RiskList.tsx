import { Card, CardHeader, CardTitle } from '../ui/Card';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Risk } from '../../types';
import {
  MoreHorizontal,
  Clock,
  User,
  ArrowUpRight,
  Shield,
  Zap,
  Building,
  Scale,
  Cpu,
  Users,
  Leaf,
  DollarSign,
} from 'lucide-react';

interface RiskListProps {
  risks: Risk[];
  title?: string;
  showViewAll?: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  operational: Zap,
  financial: DollarSign,
  strategic: Shield,
  compliance: Scale,
  technology: Cpu,
  reputational: Building,
  environmental: Leaf,
  'human-capital': Users,
};

export function RiskList({
  risks,
  title = 'Recent Risks',
  showViewAll = true,
}: RiskListProps) {
  return (
    <Card padding="none">
      <CardHeader className="p-6 pb-4">
        <CardTitle>{title}</CardTitle>
        {showViewAll && (
          <Button variant="ghost" size="sm">
            View All
            <ArrowUpRight className="w-3 h-3" />
          </Button>
        )}
      </CardHeader>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {risks.map((risk) => {
          const CategoryIcon = categoryIcons[risk.category] || Shield;

          return (
            <div
              key={risk.id}
              className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                {/* Category Icon */}
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-lumina-100 dark:group-hover:bg-lumina-900/50 group-hover:text-lumina-600 dark:group-hover:text-lumina-400 transition-colors">
                  <CategoryIcon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-900 dark:text-white truncate">
                      {risk.title}
                    </h4>
                    <RiskBadge level={risk.level} />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                    {risk.description}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 mt-2">
                    {risk.owner && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                        <User className="w-3 h-3" />
                        <span>{risk.owner}</span>
                      </div>
                    )}
                    {risk.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{risk.dueDate}</span>
                      </div>
                    )}
                    <span className="text-xs text-slate-300 dark:text-slate-600 capitalize">
                      {risk.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Score indicator */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {risk.probability * risk.impact}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">Risk Score</div>
                </div>

                {/* Actions */}
                <button className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {risks.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Shield className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No risks identified yet</p>
          <Button variant="primary" size="sm" className="mt-4">
            Add First Risk
          </Button>
        </div>
      )}
    </Card>
  );
}
