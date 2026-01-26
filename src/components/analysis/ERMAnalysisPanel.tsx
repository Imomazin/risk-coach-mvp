/**
 * ERM Analysis Panel
 * Visualizes enterprise risk management analysis results
 */

import type React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  AlertCircle,
  Shield,
  Target,
  DollarSign,
  Activity,
  Gauge,
} from 'lucide-react';

import type { ERMAnalysisResult, AnalysisInsight } from '../../types/riskData';

interface ERMAnalysisPanelProps {
  result?: ERMAnalysisResult;
}

export function ERMAnalysisPanel({ result }: ERMAnalysisPanelProps) {
  if (!result) {
    return (
      <div className="p-6 text-sm text-slate-500 dark:text-slate-400">
        No analysis results available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InsightsSection insights={result.insights ?? []} />

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

/* ----------------------------- INSIGHTS ----------------------------- */

function InsightsSection({ insights }: { insights: AnalysisInsight[] }) {
  if (!insights.length) {
    return null;
  }

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

  const ordered = [
    ...insights.filter(i => i.type === 'critical'),
    ...insights.filter(i => i.type === 'warning'),
    ...insights.filter(i => i.type !== 'critical' && i.type !== 'warning'),
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Activity className="w-5 h-5 text-lumina-600" />
        Analysis Insights ({ordered.length})
      </h3>

      {ordered.map(insight => {
        const Icon = getInsightIcon(insight.type);
        return (
          <div
            key={insight.id}
            className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <div className="flex gap-3">
              <Icon className="w-5 h-5 text-lumina-600 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {insight.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {insight.description}
                </p>
                {insight.recommendation && (
                  <p className="text-sm text-slate-500 mt-2 italic">
                    💡 {insight.recommendation}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- RISK REGISTER ----------------------------- */

function RiskRegisterAnalysis({
  distribution,
  scores,
}: {
  distribution: NonNullable<ERMAnalysisResult['riskDistribution']>;
  scores: NonNullable<ERMAnalysisResult['riskScores']>;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Target} label="Total Risks" value={distribution.totalCount} />
        <MetricCard icon={AlertTriangle} label="High Risk" value={distribution.highRiskCount} />
        <MetricCard icon={Gauge} label="Avg Inherent" value={scores.inherentScores.mean.toFixed(1)} />
        <MetricCard icon={Shield} label="Control Effectiveness" value={`${scores.controlEffectiveness.toFixed(0)}%`} />
      </div>
    </div>
  );
}

/* ----------------------------- KRI ----------------------------- */

function KRIAnalysisPanel({
  analysis,
}: {
  analysis: NonNullable<ERMAnalysisResult['kriAnalysis']>;
}) {
  return (
    <div className="space-y-4">
      <MetricCard icon={Activity} label="Total KRIs" value={analysis.totalKRIs} />
      <MetricCard icon={AlertTriangle} label="Breached" value={analysis.breachedCount} />
    </div>
  );
}

/* ----------------------------- EVENTS ----------------------------- */

function EventAnalysisPanel({
  analysis,
}: {
  analysis: NonNullable<ERMAnalysisResult['eventAnalysis']>;
}) {
  return (
    <div className="space-y-4">
      <MetricCard icon={Activity} label="Total Events" value={analysis.totalEvents} />
      <MetricCard
        icon={DollarSign}
        label="Total Impact"
        value={formatCurrency(analysis.totalFinancialImpact)}
      />
    </div>
  );
}

/* ----------------------------- CONTROLS ----------------------------- */

function ControlAnalysisPanel({
  analysis,
}: {
  analysis: NonNullable<ERMAnalysisResult['controlAnalysis']>;
}) {
  return (
    <div className="space-y-4">
      <MetricCard icon={Shield} label="Total Controls" value={analysis.totalControls} />
      <MetricCard
        icon={AlertTriangle}
        label="Coverage Gaps"
        value={analysis.coverageGaps.length}
      />
    </div>
  );
}

/* ----------------------------- STRESS ----------------------------- */

function StressAnalysisPanel({
  analysis,
}: {
  analysis: NonNullable<ERMAnalysisResult['stressAnalysis']>;
}) {
  return (
    <div className="space-y-4">
      <MetricCard icon={DollarSign} label="Expected Loss" value={formatCurrency(analysis.totalExpectedLoss)} />
      <MetricCard icon={AlertTriangle} label="Worst Case" value={formatCurrency(analysis.worstCaseScenario.loss)} />
    </div>
  );
}

/* ----------------------------- SHARED ----------------------------- */

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-lumina-600" />
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}
