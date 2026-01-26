import { useMemo } from 'react';
import { Layout } from '../components/layout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { sampleRisks, riskStats } from '../lib/sampleData';
import { useRiskIntelligence } from '../stores/RiskIntelligenceStore';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Database,
  Activity,
  AlertTriangle,
  Minus,
} from 'lucide-react';

export function Analytics() {
  const { risks: storeRisks, intelligence, isLoaded } = useRiskIntelligence();

  // Determine which data source to use
  const isUsingLiveData = isLoaded && storeRisks.length > 0;

  // Calculate metrics from either live or sample data
  const metrics = useMemo(() => {
    if (isUsingLiveData && intelligence) {
      const totalScore = storeRisks.reduce((sum, r) => sum + r.residualScore, 0);
      const avgScore = storeRisks.length > 0 ? (totalScore / storeRisks.length).toFixed(1) : '0';
      const mitigationRate = intelligence.controlEffectivenessRate.toFixed(0);
      const resolvedCount = storeRisks.filter(r => r.status === 'Closed').length;
      const deteriorating = storeRisks.filter(r => r.riskTrend === 'Deteriorating').length;
      const improving = storeRisks.filter(r => r.riskTrend === 'Improving').length;

      return {
        totalScore,
        avgScore,
        mitigationRate: `${mitigationRate}%`,
        resolvedCount,
        total: storeRisks.length,
        byCategory: intelligence.byCategory,
        byLevel: {
          low: storeRisks.filter(r => r.residualScore < 8).length,
          medium: storeRisks.filter(r => r.residualScore >= 8 && r.residualScore < 15).length,
          high: storeRisks.filter(r => r.residualScore >= 15 && r.residualScore < 20).length,
          critical: storeRisks.filter(r => r.residualScore >= 20).length,
        },
        trends: {
          deteriorating,
          improving,
          stable: storeRisks.length - deteriorating - improving,
        },
        escalated: intelligence.escalatedRisks,
        outsideAppetite: intelligence.outsideAppetiteRisks,
        systemicScore: intelligence.systemicIndicator.score,
      };
    }

    // Fallback to sample data
    const totalScore = sampleRisks.reduce((sum, r) => sum + r.probability * r.impact, 0);
    const avgScore = (totalScore / sampleRisks.length).toFixed(1);

    return {
      totalScore,
      avgScore,
      mitigationRate: '67%',
      resolvedCount: 24,
      total: riskStats.total,
      byCategory: riskStats.byCategory,
      byLevel: riskStats.byLevel,
      trends: { deteriorating: 0, improving: 0, stable: 0 },
      escalated: 0,
      outsideAppetite: 0,
      systemicScore: 0,
    };
  }, [storeRisks, intelligence, isUsingLiveData]);

  return (
    <Layout title="Analytics" subtitle="Risk trends and insights">
      {/* Live Data Banner */}
      {isUsingLiveData && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Database className="w-5 h-5 text-emerald-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Live Analytics Active — Analyzing {storeRisks.length} risks from uploaded dataset
            </p>
            {intelligence && (
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Systemic Risk: {intelligence.systemicIndicator.score}/100 •
                {metrics.trends.deteriorating > 0 && ` ${metrics.trends.deteriorating} deteriorating •`}
                {metrics.trends.improving > 0 && ` ${metrics.trends.improving} improving`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-500">Real-time</span>
          </div>
        </div>
      )}

      {/* Time Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {['7D', '30D', '90D', '1Y', 'All'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                period === '30D'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Risk Score</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{metrics.totalScore}</p>
            </div>
            {isUsingLiveData && metrics.trends.deteriorating > 0 ? (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                {metrics.trends.deteriorating} ↑
              </div>
            ) : isUsingLiveData && metrics.trends.improving > 0 ? (
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingDown className="w-4 h-4" />
                {metrics.trends.improving} ↓
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                +12%
              </div>
            )}
          </div>
          <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-lumina-500 to-lumina-600 rounded-full" />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Average Risk Score</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{metrics.avgScore}</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-sm">
              <TrendingDown className="w-4 h-4" />
              -5%
            </div>
          </div>
          <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {isUsingLiveData ? 'Control Effectiveness' : 'Mitigation Rate'}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{metrics.mitigationRate}</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              +8%
            </div>
          </div>
          <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {isUsingLiveData ? 'Escalated Risks' : 'Risks Resolved'}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {isUsingLiveData ? metrics.escalated : metrics.resolvedCount}
              </p>
            </div>
            {isUsingLiveData && metrics.escalated > 0 ? (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <AlertTriangle className="w-4 h-4" />
                Action
              </div>
            ) : (
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                +15%
              </div>
            )}
          </div>
          <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
          </div>
        </Card>
      </div>

      {/* Live Data Extra Metrics */}
      {isUsingLiveData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                metrics.systemicScore >= 70 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                metrics.systemicScore >= 50 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
              }`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Systemic Risk Index</p>
                <p className={`text-2xl font-bold ${
                  metrics.systemicScore >= 70 ? 'text-red-600' :
                  metrics.systemicScore >= 50 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {metrics.systemicScore}/100
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                metrics.outsideAppetite > 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Outside Appetite</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.outsideAppetite} risks
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                {metrics.trends.deteriorating > metrics.trends.improving ? (
                  <TrendingUp className="w-5 h-5 text-red-500" />
                ) : metrics.trends.improving > metrics.trends.deteriorating ? (
                  <TrendingDown className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Minus className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Risk Trends</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {metrics.trends.improving} improving • {metrics.trends.deteriorating} deteriorating
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Trend {isUsingLiveData && <span className="text-xs text-emerald-500 ml-2">LIVE</span>}</CardTitle>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {(isUsingLiveData
              ? Object.values(metrics.byCategory).slice(0, 12).map(v => Math.min(95, (v / Math.max(...Object.values(metrics.byCategory))) * 100 + 20))
              : [65, 72, 58, 80, 75, 68, 82, 70, 65, 78, 72, 68]
            ).map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-lumina-600 to-lumina-400 rounded-t-lg transition-all hover:from-lumina-700 hover:to-lumina-500"
                  style={{ height: `${value}%` }}
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {isUsingLiveData
                    ? Object.keys(metrics.byCategory)[i]?.substring(0, 3) || ''
                    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]
                  }
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Risk by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution {isUsingLiveData && <span className="text-xs text-emerald-500 ml-2">LIVE</span>}</CardTitle>
            <PieChart className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <div className="flex items-center justify-center gap-8">
            {/* Simple Donut Visualization */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {(() => {
                  const categories = Object.entries(metrics.byCategory).filter(([, v]) => v > 0);
                  const colors = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#6366f1', '#14b8a6'];
                  let offset = 0;
                  return categories.map(([cat, count], i) => {
                    const percentage = (count / metrics.total) * 100;
                    const dashArray = `${percentage} ${100 - percentage}`;
                    const element = (
                      <circle
                        key={cat}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={colors[i % colors.length]}
                        strokeWidth="20"
                        strokeDasharray={dashArray}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += percentage;
                    return element;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{metrics.total}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Risks</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(metrics.byCategory)
                .filter(([, v]) => v > 0)
                .slice(0, 8)
                .map(([category, count], i) => {
                  const colors = ['bg-lumina-500', 'bg-amber-500', 'bg-emerald-500', 'bg-red-500', 'bg-blue-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
                  return (
                    <div key={category} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                      <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                        {category.replace('-', ' ')}
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{count}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Level Distribution {isUsingLiveData && <span className="text-xs text-emerald-500 ml-2">LIVE</span>}</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-4 gap-4">
          {[
            { level: 'Low', count: metrics.byLevel.low, color: 'emerald' },
            { level: 'Medium', count: metrics.byLevel.medium, color: 'amber' },
            { level: 'High', count: metrics.byLevel.high, color: 'red' },
            { level: 'Critical', count: metrics.byLevel.critical, color: 'red' },
          ].map((item) => (
            <div key={item.level} className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <p className={`text-4xl font-bold ${
                item.color === 'emerald' ? 'text-emerald-600' :
                item.color === 'amber' ? 'text-amber-600' : 'text-red-600'
              }`}>
                {item.count}
              </p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{item.level}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {metrics.total > 0 ? ((item.count / metrics.total) * 100).toFixed(0) : 0}% of total
              </p>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}
