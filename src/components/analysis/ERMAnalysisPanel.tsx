/**
 * ERM Analysis Panel - Visualizes enterprise risk management analysis results
 */

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  AlertCircle,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  Target,
  DollarSign,
  Activity,
  Users,
  MapPin,
  Gauge,
  LineChart,
} from 'lucide-react';
import type { ERMAnalysisResult, AnalysisInsight } from '../../types/riskData';

interface ERMAnalysisPanelProps {
  result: ERMAnalysisResult;
}

export function ERMAnalysisPanel({ result }: ERMAnalysisPanelProps) {
  return (
    <div className="space-y-6">
      {/* Insights Section */}
      <InsightsSection insights={result.insights} />

      {/* Type-specific visualizations */}
      {result.riskDistribution && result.riskScores && (
        <RiskRegisterAnalysis
          distribution={result.riskDistribution}
          scores={result.riskScores}
        />
      )}

      {result.kriAnalysis && <KRIAnalysisPanel analysis={result.kriAnalysis} />}

      {result.eventAnalysis && <EventAnalysisPanel analysis={result.eventAnalysis} />}

      {result.controlAnalysis && <ControlAnalysisPanel analysis={result.controlAnalysis} />}

      {result.stressAnalysis && <StressAnalysisPanel analysis={result.stressAnalysis} />}
    </div>
  );
}

// Insights Section Component
function InsightsSection({ insights }: { insights: AnalysisInsight[] }) {
  const getInsightStyles = (type: AnalysisInsight['type']) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'bg-red-100 dark:bg-red-900/30 text-red-600',
          badge: 'bg-red-100 dark:bg-red-900/30 text-red-600',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          icon: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
          badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
        };
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: 'bg-green-100 dark:bg-green-900/30 text-green-600',
          badge: 'bg-green-100 dark:bg-green-900/30 text-green-600',
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
          badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
        };
    }
  };

  const getInsightIcon = (type: AnalysisInsight['type']) => {
    switch (type) {
      case 'critical':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      case 'success':
        return CheckCircle2;
      default:
        return Info;
    }
  };

  // Group by type for display order
  const criticalInsights = insights.filter(i => i.type === 'critical');
  const warningInsights = insights.filter(i => i.type === 'warning');
  const otherInsights = insights.filter(i => i.type !== 'critical' && i.type !== 'warning');
  const orderedInsights = [...criticalInsights, ...warningInsights, ...otherInsights];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Activity className="w-5 h-5 text-lumina-600" />
        Analysis Insights ({insights.length})
      </h3>
      <div className="space-y-3">
        {orderedInsights.map((insight) => {
          const styles = getInsightStyles(insight.type);
          const Icon = getInsightIcon(insight.type);

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-xl border ${styles.bg} ${styles.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{insight.title}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${styles.badge}`}>
                      {insight.category}
                    </span>
                    {insight.metric && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                        {insight.metric}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-2 italic">
                      💡 {insight.recommendation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Risk Register Analysis Component
function RiskRegisterAnalysis({
  distribution,
  scores,
}: {
  distribution: NonNullable<ERMAnalysisResult['riskDistribution']>;
  scores: NonNullable<ERMAnalysisResult['riskScores']>;
}) {
  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Target}
          label="Total Risks"
          value={distribution.totalCount}
          color="blue"
        />
        <MetricCard
          icon={AlertTriangle}
          label="High Risk"
          value={distribution.highRiskCount}
          color="red"
        />
        <MetricCard
          icon={Gauge}
          label="Avg Inherent Score"
          value={scores.inherentScores.mean.toFixed(1)}
          color="amber"
        />
        <MetricCard
          icon={Shield}
          label="Control Effectiveness"
          value={`${scores.controlEffectiveness.toFixed(0)}%`}
          color="green"
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Category */}
        {Object.keys(distribution.byCategory).length > 0 && (
          <DistributionChart
            title="Risks by Category"
            icon={PieChart}
            data={distribution.byCategory}
            colorScheme="category"
          />
        )}

        {/* By Status */}
        {Object.keys(distribution.byStatus).length > 0 && (
          <DistributionChart
            title="Risks by Status"
            icon={Activity}
            data={distribution.byStatus}
            colorScheme="status"
          />
        )}

        {/* By Region */}
        {Object.keys(distribution.byRegion).length > 0 && (
          <DistributionChart
            title="Risks by Region"
            icon={MapPin}
            data={distribution.byRegion}
            colorScheme="region"
          />
        )}

        {/* By Owner */}
        {Object.keys(distribution.byOwner).length > 0 && (
          <DistributionChart
            title="Risks by Owner"
            icon={Users}
            data={distribution.byOwner}
            colorScheme="owner"
          />
        )}
      </div>

      {/* Score Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreDistributionChart
          title="Inherent Risk Score Distribution"
          data={scores.inherentScores.distribution}
          stats={scores.inherentScores}
          color="amber"
        />
        <ScoreDistributionChart
          title="Residual Risk Score Distribution"
          data={scores.residualScores.distribution}
          stats={scores.residualScores}
          color="green"
        />
      </div>
    </div>
  );
}

// KRI Analysis Component
function KRIAnalysisPanel({ analysis }: { analysis: NonNullable<ERMAnalysisResult['kriAnalysis']> }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Activity}
          label="Total KRIs"
          value={analysis.totalKRIs}
          color="blue"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Breached"
          value={analysis.breachedCount}
          color="red"
        />
        <MetricCard
          icon={Gauge}
          label="Breach Rate"
          value={`${analysis.breachRate.toFixed(1)}%`}
          color={analysis.breachRate > 30 ? 'red' : analysis.breachRate > 15 ? 'amber' : 'green'}
        />
        <MetricCard
          icon={TrendingUp}
          label="Upward Trends"
          value={Object.entries(analysis.byTrend).filter(([t]) => t.toLowerCase().includes('up')).reduce((s, [, c]) => s + c, 0)}
          color="amber"
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(analysis.byStatus).length > 0 && (
          <DistributionChart
            title="KRIs by Status"
            icon={Activity}
            data={analysis.byStatus}
            colorScheme="kriStatus"
          />
        )}
        {Object.keys(analysis.byTrend).length > 0 && (
          <DistributionChart
            title="KRIs by Trend"
            icon={TrendingUp}
            data={analysis.byTrend}
            colorScheme="trend"
          />
        )}
      </div>

      {/* Critical Breaches Table */}
      {analysis.criticalBreaches.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Breached KRIs ({analysis.criticalBreaches.length})
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Indicator</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Risk ID</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">Value</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">Threshold</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">Breach %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {analysis.criticalBreaches.map((breach, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-2 text-slate-900 dark:text-white font-medium">{breach.indicator}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{breach.riskId}</td>
                    <td className="px-4 py-2 text-right text-red-600 dark:text-red-400 font-mono">{breach.value}</td>
                    <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-400 font-mono">{breach.threshold}</td>
                    <td className="px-4 py-2 text-right">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 font-medium">
                        {breach.threshold > 0 ? `+${(((breach.value - breach.threshold) / breach.threshold) * 100).toFixed(0)}%` : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Event Analysis Component
function EventAnalysisPanel({ analysis }: { analysis: NonNullable<ERMAnalysisResult['eventAnalysis']> }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Activity}
          label="Total Events"
          value={analysis.totalEvents}
          color="blue"
        />
        <MetricCard
          icon={DollarSign}
          label="Total Impact"
          value={formatCompactCurrency(analysis.totalFinancialImpact)}
          color="red"
        />
        <MetricCard
          icon={Gauge}
          label="Avg Impact"
          value={formatCompactCurrency(analysis.averageImpact)}
          color="amber"
        />
        <MetricCard
          icon={BarChart3}
          label="Months Analyzed"
          value={analysis.byMonth.length}
          color="green"
        />
      </div>

      {/* Monthly Trend */}
      {analysis.byMonth.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <LineChart className="w-4 h-4 text-lumina-600" />
            Monthly Event Trend
          </h4>
          <div className="flex items-end gap-1 h-32">
            {analysis.byMonth.map((month, idx) => {
              const maxCount = Math.max(...analysis.byMonth.map(m => m.count));
              const height = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-lumina-500 dark:bg-lumina-600 rounded-t transition-all hover:bg-lumina-600"
                    style={{ height: `${height}%`, minHeight: month.count > 0 ? '4px' : '0' }}
                    title={`${month.month}: ${month.count} events, ${formatCompactCurrency(month.totalImpact)}`}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {month.month.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Risks by Event Count */}
      {analysis.topRisksbyEventCount.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-lumina-600" />
            Top Risks by Event Frequency
          </h4>
          <div className="space-y-2">
            {analysis.topRisksbyEventCount.slice(0, 5).map((item, idx) => {
              const maxCount = analysis.topRisksbyEventCount[0]?.count || 1;
              const width = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-20 flex-shrink-0">Risk {item.riskId}</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-lumina-500 dark:bg-lumina-600 rounded-full transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Control Analysis Component
function ControlAnalysisPanel({ analysis }: { analysis: NonNullable<ERMAnalysisResult['controlAnalysis']> }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Shield}
          label="Total Controls"
          value={analysis.totalControls}
          color="blue"
        />
        <MetricCard
          icon={Target}
          label="Avg Controls/Risk"
          value={analysis.averageControlsPerRisk.toFixed(1)}
          color="green"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Coverage Gaps"
          value={analysis.coverageGaps.length}
          color={analysis.coverageGaps.length > 0 ? 'red' : 'green'}
        />
        <MetricCard
          icon={Users}
          label="Control Owners"
          value={Object.keys(analysis.byOwner).length}
          color="amber"
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(analysis.byType).length > 0 && (
          <DistributionChart
            title="Controls by Type"
            icon={Shield}
            data={analysis.byType}
            colorScheme="controlType"
          />
        )}
        {Object.keys(analysis.byAutomationLevel).length > 0 && (
          <DistributionChart
            title="Controls by Automation Level"
            icon={Activity}
            data={analysis.byAutomationLevel}
            colorScheme="automation"
          />
        )}
      </div>
    </div>
  );
}

// Stress Analysis Component
function StressAnalysisPanel({ analysis }: { analysis: NonNullable<ERMAnalysisResult['stressAnalysis']> }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Activity}
          label="Scenarios"
          value={analysis.totalScenarios}
          color="blue"
        />
        <MetricCard
          icon={DollarSign}
          label="Expected Loss"
          value={formatCompactCurrency(analysis.totalExpectedLoss)}
          color="amber"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Worst Case"
          value={formatCompactCurrency(analysis.worstCaseScenario.loss)}
          color="red"
        />
        <MetricCard
          icon={Gauge}
          label="Worst Case Prob"
          value={`${(analysis.worstCaseScenario.probability * 100).toFixed(0)}%`}
          color="amber"
        />
      </div>

      {/* Scenario Ranking */}
      {analysis.riskExposureByScenario.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-lumina-600" />
            Scenarios by Expected Loss
          </h4>
          <div className="space-y-2">
            {analysis.riskExposureByScenario.slice(0, 10).map((scenario, idx) => {
              const maxLoss = analysis.riskExposureByScenario[0]?.expectedLoss || 1;
              const width = (scenario.expectedLoss / maxLoss) * 100;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-40 flex-shrink-0 truncate" title={scenario.name}>
                    {scenario.name}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-20 text-right">
                    {formatCompactCurrency(scenario.expectedLoss)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Metric Card Component
function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'amber' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Reusable Distribution Chart Component
function DistributionChart({
  title,
  icon: Icon,
  data,
  colorScheme,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  data: Record<string, number>;
  colorScheme: string;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  const getBarColor = (index: number, scheme: string) => {
    const colors: Record<string, string[]> = {
      category: ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-orange-500'],
      status: ['bg-green-500', 'bg-amber-500', 'bg-red-500', 'bg-blue-500', 'bg-slate-500'],
      region: ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'],
      owner: ['bg-cyan-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'],
      kriStatus: ['bg-green-500', 'bg-amber-500', 'bg-red-500'],
      trend: ['bg-green-500', 'bg-slate-400', 'bg-red-500'],
      controlType: ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500'],
      automation: ['bg-emerald-500', 'bg-amber-500', 'bg-slate-500'],
    };
    const palette = colors[scheme] || colors.category;
    return palette[index % palette.length];
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4 text-lumina-600" />
        {title}
      </h4>
      <div className="space-y-3">
        {entries.slice(0, 8).map(([label, count], idx) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400 truncate" title={label}>{label}</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-full rounded-full transition-all ${getBarColor(idx, colorScheme)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {entries.length > 8 && (
          <p className="text-xs text-slate-400 text-center">+{entries.length - 8} more</p>
        )}
      </div>
    </div>
  );
}

// Score Distribution Chart Component
function ScoreDistributionChart({
  title,
  data,
  stats,
  color,
}: {
  title: string;
  data: { range: string; count: number }[];
  stats: { min: number; max: number; mean: number; median: number };
  color: 'amber' | 'green';
}) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const barColor = color === 'amber' ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-lumina-600" />
        {title}
      </h4>
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span>Min: {stats.min.toFixed(1)}</span>
        <span>Mean: {stats.mean.toFixed(1)}</span>
        <span>Max: {stats.max.toFixed(1)}</span>
      </div>
      <div className="flex items-end gap-1 h-24">
        {data.map((bucket, idx) => {
          const height = (bucket.count / maxCount) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full ${barColor} rounded-t transition-all`}
                style={{ height: `${height}%`, minHeight: bucket.count > 0 ? '4px' : '0' }}
                title={`${bucket.range}: ${bucket.count}`}
              />
              <span className="text-[9px] text-slate-400 mt-1">{bucket.range.split('-')[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function for compact currency formatting
function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}
