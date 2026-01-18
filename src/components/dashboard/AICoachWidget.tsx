import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Send,
  Lightbulb,
  AlertCircle,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'warning' | 'suggestion' | 'trend';
  title: string;
  description: string;
}

const sampleInsights: Insight[] = [
  {
    id: '1',
    type: 'warning',
    title: '3 risks nearing due date',
    description:
      'Consider reviewing mitigation progress for Supply Chain Disruption and two others.',
  },
  {
    id: '2',
    type: 'trend',
    title: 'Risk score trending up',
    description:
      'Your overall risk exposure increased 12% this month. Technology risks are the main driver.',
  },
  {
    id: '3',
    type: 'suggestion',
    title: 'Missing risk owner',
    description:
      '4 risks have no assigned owner. Assigning ownership improves mitigation rates by 40%.',
  },
];

const insightIcons = {
  warning: AlertCircle,
  suggestion: Lightbulb,
  trend: TrendingUp,
};

const insightColors = {
  warning: 'text-amber-500 bg-amber-50 dark:bg-amber-900/50',
  suggestion: 'text-lumina-500 bg-lumina-50 dark:bg-lumina-900/50',
  trend: 'text-blue-500 bg-blue-50 dark:bg-blue-900/50',
};

export function AICoachWidget() {
  const [message, setMessage] = useState('');

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-lumina-600 to-lumina-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">AI Risk Coach</h3>
            <p className="text-sm text-white/70">Powered by Lumina Intelligence</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="p-4 space-y-3">
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
          Smart Insights
        </p>
        {sampleInsights.map((insight) => {
          const Icon = insightIcons[insight.type];
          return (
            <button
              key={insight.id}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-1.5 rounded-lg ${insightColors[insight.type]}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 dark:text-white">
                    {insight.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {insight.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 mt-0.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your risks..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800
                     text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500
                     transition-all duration-200"
          />
          <Button variant="primary" size="md" className="px-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
          AI suggestions are for guidance only. Always verify with your risk team.
        </p>
      </div>
    </Card>
  );
}
