/**
 * Unified Risk Intelligence Store
 *
 * This is the SINGLE SOURCE OF TRUTH for all risk data in Lumina R.
 * All components MUST read from this store - no independent calculations.
 *
 * When data is uploaded, it is normalized into the canonical schema,
 * and all derived calculations are performed centrally.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

// ============================================================================
// CANONICAL DATA SCHEMA
// ============================================================================

export interface RiskRecord {
  id: string | number;
  category: string;
  description: string;
  rootCause: string;
  likelihood: number;
  impact: number;
  velocity: 'Slow' | 'Medium' | 'Fast';
  inherentScore: number;
  existingControls: string;
  controlEffectiveness: 'Low' | 'Medium' | 'High';
  residualScore: number;
  appetiteAlignment: 'Within Appetite' | 'Outside Appetite';
  owner: string;
  region: string;
  status: 'Open' | 'Under Review' | 'Escalated' | 'Closed';
  // Computed fields
  isEscalated: boolean;
  escalationReasons: string[];
  linkedKRIs: string[];
  linkedEvents: string[];
  linkedControls: string[];
  riskTrend: 'Improving' | 'Stable' | 'Deteriorating';
}

export interface KRIRecord {
  id: string | number;
  riskId: string | number;
  indicator: string;
  currentValue: number;
  threshold: number;
  trend: 'Up' | 'Down' | 'Stable';
  status: 'Green' | 'Amber' | 'Red';
  breachPercentage: number;
}

export interface RiskEventRecord {
  id: string | number;
  relatedRiskId: string | number;
  description: string;
  eventDate: string;
  financialImpact: number;
  operationalImpact: 'Low' | 'Medium' | 'High';
  rootCauseConfirmed: boolean;
}

export interface ControlRecord {
  id: string;
  name: string;
  type: 'Preventive' | 'Detective' | 'Corrective';
  automationLevel: 'Manual' | 'Semi Automated' | 'Automated';
  owner: string;
  mappedRiskIds: string[];
  effectiveness: 'Low' | 'Medium' | 'High';
}

export interface StressScenario {
  id: string | number;
  name: string;
  triggeredRiskIds: string[];
  probability: number;
  estimatedLoss: number;
  expectedLoss: number;
}

export interface RiskAppetite {
  category: string;
  level: 'Low' | 'Medium' | 'High';
  threshold: number;
  guidance: string;
}

// ============================================================================
// INTELLIGENCE LAYER - COMPUTED ANALYTICS
// ============================================================================

export interface ConcentrationRisk {
  type: 'region' | 'owner' | 'category';
  value: string;
  count: number;
  percentage: number;
  totalExposure: number;
  isConcentrated: boolean; // >40% in one area
}

export interface SystemicIndicator {
  score: number; // 0-100
  level: 'Low' | 'Moderate' | 'Elevated' | 'Critical';
  drivers: string[];
  trend: 'Improving' | 'Stable' | 'Deteriorating';
}

export interface ExecutiveInsight {
  id: string;
  type: 'exposure' | 'driver' | 'action' | 'warning';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  dataPoints: string[];
  recommendation?: string;
}

export interface Alert {
  id: string;
  timestamp: Date;
  type: 'escalation' | 'breach' | 'trend' | 'concentration' | 'appetite';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  context: {
    riskIds?: string[];
    kriIds?: string[];
    thresholdBreached?: string;
    dataPoints: string[];
    implication: string;
  };
  acknowledged: boolean;
}

export interface IntelligenceSummary {
  // Core metrics
  totalRisks: number;
  highRisks: number;
  escalatedRisks: number;
  outsideAppetiteRisks: number;

  // KRI metrics
  totalKRIs: number;
  breachedKRIs: number;
  kriBreachRate: number;
  deterioratingKRIs: number;

  // Event metrics
  totalEvents: number;
  totalFinancialLoss: number;
  avgLossPerEvent: number;
  recentEventsCount: number; // Last 90 days

  // Control metrics
  totalControls: number;
  weakControls: number;
  controlCoverageGaps: string[];
  avgControlEffectiveness: number;

  // Stress/Scenario metrics
  totalExpectedLoss: number;
  worstCaseScenario: string;
  worstCaseLoss: number;

  // Intelligence metrics
  systemicIndicator: SystemicIndicator;
  concentrationRisks: ConcentrationRisk[];
  topExposureDrivers: { driver: string; contribution: number }[];
  executiveInsights: ExecutiveInsight[];
  alerts: Alert[];

  // Distribution summaries
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  byRegion: Record<string, number>;
  byOwner: Record<string, number>;
  byAppetite: { within: number; outside: number };

  // Scores
  inherentScoreStats: { min: number; max: number; mean: number; median: number };
  residualScoreStats: { min: number; max: number; mean: number; median: number };
  controlEffectivenessRate: number;
}

// ============================================================================
// STORE STATE
// ============================================================================

interface RiskIntelligenceState {
  // Raw normalized data
  risks: RiskRecord[];
  kris: KRIRecord[];
  events: RiskEventRecord[];
  controls: ControlRecord[];
  scenarios: StressScenario[];
  appetites: RiskAppetite[];

  // Computed intelligence
  intelligence: IntelligenceSummary | null;

  // Data loading state
  isLoaded: boolean;
  lastUpdated: Date | null;
  dataSource: string | null;

  // Consistency validation
  validationErrors: string[];
  isConsistent: boolean;
}

interface RiskIntelligenceContextType extends RiskIntelligenceState {
  // Data loading actions
  loadRisks: (data: Record<string, unknown>[]) => void;
  loadKRIs: (data: Record<string, unknown>[]) => void;
  loadEvents: (data: Record<string, unknown>[]) => void;
  loadControls: (data: Record<string, unknown>[]) => void;
  loadScenarios: (data: Record<string, unknown>[]) => void;
  loadAppetites: (data: Record<string, unknown>[]) => void;

  // Bulk load from analysis
  loadFromAnalysis: (dataType: string, data: Record<string, unknown>[]) => void;

  // Intelligence queries
  getRiskById: (id: string | number) => RiskRecord | undefined;
  getKRIsForRisk: (riskId: string | number) => KRIRecord[];
  getEventsForRisk: (riskId: string | number) => RiskEventRecord[];
  getControlsForRisk: (riskId: string | number) => ControlRecord[];
  getEscalatedRisks: () => RiskRecord[];
  getRisksOutsideAppetite: () => RiskRecord[];
  getConcentrationWarnings: () => ConcentrationRisk[];

  // Alert management
  acknowledgeAlert: (alertId: string) => void;
  getUnacknowledgedAlerts: () => Alert[];

  // Refresh intelligence
  recalculateIntelligence: () => void;

  // Clear all data
  clearAllData: () => void;
}

// ============================================================================
// HELPER FUNCTIONS FOR DATA NORMALIZATION
// ============================================================================

function findColumnValue(row: Record<string, unknown>, patterns: string[]): unknown {
  for (const key of Object.keys(row)) {
    const normalizedKey = key.toLowerCase().replace(/[_\-\s]+/g, ' ');
    for (const pattern of patterns) {
      if (normalizedKey.includes(pattern.toLowerCase())) {
        return row[key];
      }
    }
  }
  return undefined;
}

function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[,$%]/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function parseString(value: unknown, defaultVal: string = ''): string {
  if (value === null || value === undefined) return defaultVal;
  return String(value).trim() || defaultVal;
}

function normalizeVelocity(value: unknown): 'Slow' | 'Medium' | 'Fast' {
  const str = parseString(value).toLowerCase();
  if (str.includes('fast')) return 'Fast';
  if (str.includes('medium')) return 'Medium';
  return 'Slow';
}

function normalizeEffectiveness(value: unknown): 'Low' | 'Medium' | 'High' {
  const str = parseString(value).toLowerCase();
  if (str.includes('high')) return 'High';
  if (str.includes('medium')) return 'Medium';
  return 'Low';
}

function normalizeAppetiteAlignment(value: unknown): 'Within Appetite' | 'Outside Appetite' {
  const str = parseString(value).toLowerCase();
  if (str.includes('outside') || str.includes('exceed') || str.includes('above')) {
    return 'Outside Appetite';
  }
  return 'Within Appetite';
}

function normalizeKRIStatus(value: unknown): 'Green' | 'Amber' | 'Red' {
  const str = parseString(value).toLowerCase();
  if (str.includes('red') || str.includes('critical') || str.includes('breach')) return 'Red';
  if (str.includes('amber') || str.includes('warning') || str.includes('yellow')) return 'Amber';
  return 'Green';
}

function normalizeTrend(value: unknown): 'Up' | 'Down' | 'Stable' {
  const str = parseString(value).toLowerCase();
  if (str.includes('up') || str.includes('increas') || str.includes('rising')) return 'Up';
  if (str.includes('down') || str.includes('decreas') || str.includes('falling')) return 'Down';
  return 'Stable';
}

function normalizeControlType(value: unknown): 'Preventive' | 'Detective' | 'Corrective' {
  const str = parseString(value).toLowerCase();
  if (str.includes('detect')) return 'Detective';
  if (str.includes('correct')) return 'Corrective';
  return 'Preventive';
}

function normalizeAutomation(value: unknown): 'Manual' | 'Semi Automated' | 'Automated' {
  const str = parseString(value).toLowerCase();
  if (str.includes('automated') && !str.includes('semi')) return 'Automated';
  if (str.includes('semi')) return 'Semi Automated';
  return 'Manual';
}

function normalizeOperationalImpact(value: unknown): 'Low' | 'Medium' | 'High' {
  const str = parseString(value).toLowerCase();
  if (str.includes('high')) return 'High';
  if (str.includes('medium')) return 'Medium';
  return 'Low';
}

// ============================================================================
// INTELLIGENCE CALCULATION ENGINE
// ============================================================================

function calculateStats(values: number[]): { min: number; max: number; mean: number; median: number } {
  if (values.length === 0) return { min: 0, max: 0, mean: 0, median: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: sum / values.length,
    median: sorted[Math.floor(sorted.length / 2)],
  };
}

function calculateConcentrations(
  risks: RiskRecord[],
  field: 'region' | 'owner' | 'category'
): ConcentrationRisk[] {
  const counts: Record<string, { count: number; exposure: number }> = {};

  risks.forEach(risk => {
    const value = risk[field] || 'Unknown';
    if (!counts[value]) counts[value] = { count: 0, exposure: 0 };
    counts[value].count++;
    counts[value].exposure += risk.residualScore;
  });

  const total = risks.length;

  return Object.entries(counts)
    .map(([value, data]) => ({
      type: field,
      value,
      count: data.count,
      percentage: total > 0 ? (data.count / total) * 100 : 0,
      totalExposure: data.exposure,
      isConcentrated: total > 0 && (data.count / total) > 0.4,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

function determineEscalation(
  risk: Partial<RiskRecord>,
  kris: KRIRecord[]
): { isEscalated: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check appetite alignment
  if (risk.appetiteAlignment === 'Outside Appetite') {
    reasons.push('Risk is outside approved appetite boundaries');
  }

  // Check control effectiveness
  if (risk.controlEffectiveness === 'Low') {
    reasons.push('Control effectiveness is rated Low');
  }

  // Check velocity
  if (risk.velocity === 'Fast') {
    reasons.push('Risk velocity is Fast - rapid materialization expected');
  }

  // Check linked KRIs
  const linkedKRIs = kris.filter(k => String(k.riskId) === String(risk.id));
  const redKRIs = linkedKRIs.filter(k => k.status === 'Red');
  const deterioratingKRIs = linkedKRIs.filter(k => k.trend === 'Up'); // Up trend = worsening

  if (redKRIs.length > 0) {
    reasons.push(`${redKRIs.length} KRI(s) in breach status`);
  }

  if (deterioratingKRIs.length > 0) {
    reasons.push(`${deterioratingKRIs.length} KRI(s) showing deteriorating trend`);
  }

  // Check high residual score
  if (risk.residualScore && risk.residualScore >= 15) {
    reasons.push(`High residual risk score (${risk.residualScore})`);
  }

  // Escalation logic: Outside appetite AND (weak controls OR fast velocity OR deteriorating KRIs)
  const shouldEscalate =
    risk.appetiteAlignment === 'Outside Appetite' &&
    (risk.controlEffectiveness === 'Low' || risk.velocity === 'Fast' || deterioratingKRIs.length > 0);

  return {
    isEscalated: shouldEscalate || reasons.length >= 3,
    reasons,
  };
}

function calculateSystemicIndicator(
  risks: RiskRecord[],
  kris: KRIRecord[],
  concentrations: ConcentrationRisk[]
): SystemicIndicator {
  let score = 0;
  const drivers: string[] = [];

  // Factor 1: Percentage of risks outside appetite (max 25 points)
  const outsideAppetitePct = risks.length > 0
    ? (risks.filter(r => r.appetiteAlignment === 'Outside Appetite').length / risks.length) * 100
    : 0;
  score += Math.min(25, outsideAppetitePct);
  if (outsideAppetitePct > 20) {
    drivers.push(`${outsideAppetitePct.toFixed(0)}% of risks outside appetite`);
  }

  // Factor 2: KRI breach rate (max 25 points)
  const kriBreachRate = kris.length > 0
    ? (kris.filter(k => k.status === 'Red').length / kris.length) * 100
    : 0;
  score += Math.min(25, kriBreachRate);
  if (kriBreachRate > 30) {
    drivers.push(`${kriBreachRate.toFixed(0)}% KRI breach rate`);
  }

  // Factor 3: Concentration risk (max 25 points)
  const hasConcentration = concentrations.some(c => c.isConcentrated);
  if (hasConcentration) {
    score += 20;
    const concentrated = concentrations.filter(c => c.isConcentrated);
    drivers.push(`Concentration in ${concentrated.map(c => `${c.value} (${c.type})`).join(', ')}`);
  }

  // Factor 4: Escalated risks (max 25 points)
  const escalatedPct = risks.length > 0
    ? (risks.filter(r => r.isEscalated).length / risks.length) * 100
    : 0;
  score += Math.min(25, escalatedPct);
  if (escalatedPct > 15) {
    drivers.push(`${escalatedPct.toFixed(0)}% of risks escalated`);
  }

  // Determine level
  let level: SystemicIndicator['level'] = 'Low';
  if (score >= 70) level = 'Critical';
  else if (score >= 50) level = 'Elevated';
  else if (score >= 30) level = 'Moderate';

  // Determine trend based on KRI trends
  const upTrends = kris.filter(k => k.trend === 'Up').length;
  const downTrends = kris.filter(k => k.trend === 'Down').length;
  let trend: SystemicIndicator['trend'] = 'Stable';
  if (upTrends > downTrends * 1.5) trend = 'Deteriorating';
  else if (downTrends > upTrends * 1.5) trend = 'Improving';

  return { score: Math.min(100, score), level, drivers, trend };
}

function generateExecutiveInsights(
  risks: RiskRecord[],
  kris: KRIRecord[],
  events: RiskEventRecord[],
  concentrations: ConcentrationRisk[]
): ExecutiveInsight[] {
  const insights: ExecutiveInsight[] = [];

  // Insight 1: Where are we most exposed?
  const topCategory = concentrations.find(c => c.type === 'category');
  if (topCategory && topCategory.percentage > 25) {
    insights.push({
      id: 'exposure-concentration',
      type: 'exposure',
      title: 'Primary Exposure Concentration',
      description: `${topCategory.percentage.toFixed(0)}% of total risk exposure is concentrated in ${topCategory.value}. This represents ${topCategory.count} risks with combined residual score of ${topCategory.totalExposure}.`,
      severity: topCategory.isConcentrated ? 'critical' : 'warning',
      dataPoints: [
        `${topCategory.count} risks in ${topCategory.value}`,
        `${topCategory.percentage.toFixed(1)}% of portfolio`,
        `Total exposure: ${topCategory.totalExposure}`,
      ],
      recommendation: 'Review diversification strategy and strengthen controls in this category.',
    });
  }

  // Insight 2: Top drivers of exposure
  const outsideAppetite = risks.filter(r => r.appetiteAlignment === 'Outside Appetite');
  if (outsideAppetite.length > 0) {
    const weakControlsOutside = outsideAppetite.filter(r => r.controlEffectiveness === 'Low');
    insights.push({
      id: 'appetite-breach-driver',
      type: 'driver',
      title: 'Risks Requiring Leadership Attention',
      description: `${outsideAppetite.length} risks are outside appetite. ${weakControlsOutside.length} of these have weak controls, creating elevated exposure.`,
      severity: weakControlsOutside.length > 2 ? 'critical' : 'warning',
      dataPoints: [
        `${outsideAppetite.length} outside appetite`,
        `${weakControlsOutside.length} with weak controls`,
        `Categories: ${[...new Set(outsideAppetite.map(r => r.category))].join(', ')}`,
      ],
      recommendation: 'Prioritize control strengthening for risks outside appetite with low control effectiveness.',
    });
  }

  // Insight 3: What is getting worse?
  const deterioratingKRIs = kris.filter(k => k.trend === 'Up');
  if (deterioratingKRIs.length > 0) {
    const affectedRisks = [...new Set(deterioratingKRIs.map(k => k.riskId))];
    insights.push({
      id: 'deteriorating-trend',
      type: 'warning',
      title: 'Deteriorating Risk Indicators',
      description: `${deterioratingKRIs.length} KRIs show worsening trends, affecting ${affectedRisks.length} risks. Early intervention recommended.`,
      severity: deterioratingKRIs.length > 5 ? 'critical' : 'warning',
      dataPoints: [
        `${deterioratingKRIs.length} KRIs trending up`,
        `${affectedRisks.length} risks affected`,
        `Indicators: ${deterioratingKRIs.slice(0, 3).map(k => k.indicator).join(', ')}`,
      ],
      recommendation: 'Investigate root causes and implement corrective actions before breaches occur.',
    });
  }

  // Insight 4: What must leadership act on?
  const escalated = risks.filter(r => r.isEscalated);
  if (escalated.length > 0) {
    insights.push({
      id: 'leadership-action',
      type: 'action',
      title: 'Immediate Leadership Action Required',
      description: `${escalated.length} risks meet escalation criteria and require senior management review this quarter.`,
      severity: 'critical',
      dataPoints: escalated.slice(0, 5).map(r => `Risk ${r.id}: ${r.description?.substring(0, 50) || r.category}`),
      recommendation: 'Schedule risk committee review and develop mitigation action plans.',
    });
  }

  // Insight 5: Financial impact summary
  if (events.length > 0) {
    const totalLoss = events.reduce((sum, e) => sum + e.financialImpact, 0);
    const avgLoss = totalLoss / events.length;
    const recentEvents = events.filter(e => {
      const eventDate = new Date(e.eventDate);
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      return eventDate >= ninetyDaysAgo;
    });

    insights.push({
      id: 'financial-impact',
      type: 'exposure',
      title: 'Historical Loss Analysis',
      description: `${events.length} recorded events with total financial impact of $${(totalLoss / 1000000).toFixed(2)}M. ${recentEvents.length} events in the last 90 days.`,
      severity: recentEvents.length > 10 ? 'warning' : 'info',
      dataPoints: [
        `Total loss: $${(totalLoss / 1000000).toFixed(2)}M`,
        `Average per event: $${(avgLoss / 1000).toFixed(0)}K`,
        `Recent events (90 days): ${recentEvents.length}`,
      ],
    });
  }

  return insights;
}

function generateAlerts(
  risks: RiskRecord[],
  kris: KRIRecord[],
  concentrations: ConcentrationRisk[],
  systemic: SystemicIndicator,
  previousAlerts: Alert[]
): Alert[] {
  const alerts: Alert[] = [...previousAlerts];
  const existingIds = new Set(alerts.map(a => a.id));

  // Alert for escalated risks
  const escalated = risks.filter(r => r.isEscalated);
  escalated.forEach(risk => {
    const alertId = `escalation-${risk.id}`;
    if (!existingIds.has(alertId)) {
      alerts.push({
        id: alertId,
        timestamp: new Date(),
        type: 'escalation',
        severity: 'critical',
        title: `Risk Escalated: ${risk.category} - Risk ${risk.id}`,
        description: `Risk has been escalated due to: ${risk.escalationReasons.join('; ')}`,
        context: {
          riskIds: [String(risk.id)],
          dataPoints: risk.escalationReasons,
          implication: 'Requires immediate management attention. Failure to address may result in appetite breach and potential losses.',
        },
        acknowledged: false,
      });
    }
  });

  // Alert for KRI breaches
  const breachedKRIs = kris.filter(k => k.status === 'Red');
  if (breachedKRIs.length > 0) {
    const alertId = `kri-breach-${breachedKRIs.length}`;
    if (!existingIds.has(alertId)) {
      alerts.push({
        id: alertId,
        timestamp: new Date(),
        type: 'breach',
        severity: 'warning',
        title: `${breachedKRIs.length} KRI(s) in Breach Status`,
        description: `Key Risk Indicators have exceeded thresholds: ${breachedKRIs.slice(0, 3).map(k => k.indicator).join(', ')}`,
        context: {
          kriIds: breachedKRIs.map(k => String(k.id)),
          thresholdBreached: `${breachedKRIs.length} indicators above threshold`,
          dataPoints: breachedKRIs.slice(0, 5).map(k => `${k.indicator}: ${k.currentValue} vs threshold ${k.threshold}`),
          implication: 'Indicates elevated risk exposure. Review underlying risks and control effectiveness.',
        },
        acknowledged: false,
      });
    }
  }

  // Alert for concentration risk
  const concentrated = concentrations.filter(c => c.isConcentrated);
  concentrated.forEach(conc => {
    const alertId = `concentration-${conc.type}-${conc.value}`;
    if (!existingIds.has(alertId)) {
      alerts.push({
        id: alertId,
        timestamp: new Date(),
        type: 'concentration',
        severity: 'warning',
        title: `Concentration Warning: ${conc.value} (${conc.type})`,
        description: `${conc.percentage.toFixed(0)}% of risks concentrated in ${conc.value}. This exceeds the 40% concentration threshold.`,
        context: {
          dataPoints: [
            `${conc.count} risks in ${conc.value}`,
            `${conc.percentage.toFixed(1)}% of total portfolio`,
            `Total exposure: ${conc.totalExposure}`,
          ],
          implication: 'Concentration risk may amplify losses if this segment experiences adverse conditions.',
        },
        acknowledged: false,
      });
    }
  });

  // Alert for systemic risk level
  if (systemic.level === 'Critical' || systemic.level === 'Elevated') {
    const alertId = `systemic-${systemic.level}`;
    if (!existingIds.has(alertId)) {
      alerts.push({
        id: alertId,
        timestamp: new Date(),
        type: 'appetite',
        severity: systemic.level === 'Critical' ? 'critical' : 'warning',
        title: `Systemic Risk Level: ${systemic.level}`,
        description: `Overall risk posture is ${systemic.level.toLowerCase()} with score of ${systemic.score}/100. ${systemic.trend === 'Deteriorating' ? 'Trend is deteriorating.' : ''}`,
        context: {
          dataPoints: systemic.drivers,
          implication: systemic.level === 'Critical'
            ? 'Immediate board-level attention required. Risk posture threatens organizational objectives.'
            : 'Senior management review recommended. Multiple risk factors require coordinated response.',
        },
        acknowledged: false,
      });
    }
  }

  return alerts;
}

// ============================================================================
// CONTEXT AND PROVIDER
// ============================================================================

const RiskIntelligenceContext = createContext<RiskIntelligenceContextType | null>(null);

export function RiskIntelligenceProvider({ children }: { children: React.ReactNode }) {
  const [risks, setRisks] = useState<RiskRecord[]>([]);
  const [kris, setKRIs] = useState<KRIRecord[]>([]);
  const [events, setEvents] = useState<RiskEventRecord[]>([]);
  const [controls, setControls] = useState<ControlRecord[]>([]);
  const [scenarios, setScenarios] = useState<StressScenario[]>([]);
  const [appetites, setAppetites] = useState<RiskAppetite[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);

  // Recalculate intelligence whenever data changes
  const intelligence = useMemo<IntelligenceSummary | null>(() => {
    if (risks.length === 0 && kris.length === 0 && events.length === 0) {
      return null;
    }

    // Calculate concentrations
    const regionConcentrations = calculateConcentrations(risks, 'region');
    const ownerConcentrations = calculateConcentrations(risks, 'owner');
    const categoryConcentrations = calculateConcentrations(risks, 'category');
    const allConcentrations = [...regionConcentrations, ...ownerConcentrations, ...categoryConcentrations];

    // Calculate systemic indicator
    const systemic = calculateSystemicIndicator(risks, kris, allConcentrations);

    // Generate executive insights
    const insights = generateExecutiveInsights(risks, kris, events, categoryConcentrations);

    // Calculate score stats
    const inherentScores = risks.map(r => r.inherentScore).filter(s => s > 0);
    const residualScores = risks.map(r => r.residualScore).filter(s => s > 0);

    // Control coverage analysis
    const mappedRiskIds = new Set(controls.flatMap(c => c.mappedRiskIds));
    const coverageGaps = risks
      .filter(r => !mappedRiskIds.has(String(r.id)))
      .map(r => String(r.id));

    // Recent events (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const recentEvents = events.filter(e => new Date(e.eventDate) >= ninetyDaysAgo);

    // Control effectiveness average
    const effectivenessMap = { Low: 0.33, Medium: 0.66, High: 1 };
    const avgEffectiveness = controls.length > 0
      ? controls.reduce((sum, c) => sum + (effectivenessMap[c.effectiveness] || 0.5), 0) / controls.length
      : 0;

    // Distribution summaries
    const byCategory: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byRegion: Record<string, number> = {};
    const byOwner: Record<string, number> = {};

    risks.forEach(r => {
      byCategory[r.category] = (byCategory[r.category] || 0) + 1;
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      byRegion[r.region] = (byRegion[r.region] || 0) + 1;
      byOwner[r.owner] = (byOwner[r.owner] || 0) + 1;
    });

    return {
      totalRisks: risks.length,
      highRisks: risks.filter(r => r.residualScore >= 15).length,
      escalatedRisks: risks.filter(r => r.isEscalated).length,
      outsideAppetiteRisks: risks.filter(r => r.appetiteAlignment === 'Outside Appetite').length,

      totalKRIs: kris.length,
      breachedKRIs: kris.filter(k => k.status === 'Red').length,
      kriBreachRate: kris.length > 0 ? (kris.filter(k => k.status === 'Red').length / kris.length) * 100 : 0,
      deterioratingKRIs: kris.filter(k => k.trend === 'Up').length,

      totalEvents: events.length,
      totalFinancialLoss: events.reduce((sum, e) => sum + e.financialImpact, 0),
      avgLossPerEvent: events.length > 0 ? events.reduce((sum, e) => sum + e.financialImpact, 0) / events.length : 0,
      recentEventsCount: recentEvents.length,

      totalControls: controls.length,
      weakControls: controls.filter(c => c.effectiveness === 'Low').length,
      controlCoverageGaps: coverageGaps,
      avgControlEffectiveness: avgEffectiveness * 100,

      totalExpectedLoss: scenarios.reduce((sum, s) => sum + s.expectedLoss, 0),
      worstCaseScenario: scenarios.length > 0 ? scenarios.sort((a, b) => b.estimatedLoss - a.estimatedLoss)[0]?.name || '' : '',
      worstCaseLoss: scenarios.length > 0 ? Math.max(...scenarios.map(s => s.estimatedLoss)) : 0,

      systemicIndicator: systemic,
      concentrationRisks: allConcentrations.filter(c => c.isConcentrated),
      topExposureDrivers: categoryConcentrations.slice(0, 5).map(c => ({
        driver: c.value,
        contribution: c.percentage,
      })),
      executiveInsights: insights,
      alerts,

      byCategory,
      byStatus,
      byRegion,
      byOwner,
      byAppetite: {
        within: risks.filter(r => r.appetiteAlignment === 'Within Appetite').length,
        outside: risks.filter(r => r.appetiteAlignment === 'Outside Appetite').length,
      },

      inherentScoreStats: calculateStats(inherentScores),
      residualScoreStats: calculateStats(residualScores),
      controlEffectivenessRate: inherentScores.length > 0 && residualScores.length > 0
        ? ((calculateStats(inherentScores).mean - calculateStats(residualScores).mean) / calculateStats(inherentScores).mean) * 100
        : 0,
    };
  }, [risks, kris, events, controls, scenarios, alerts]);

  // Generate alerts when data changes using functional update
  // This is intentional: alerts are derived from data but also have mutable properties (acknowledged)
  // The functional update pattern ensures we preserve acknowledged state while computing new alerts
  useEffect(() => {
    if (risks.length === 0 && kris.length === 0) return;

    const regionConcentrations = calculateConcentrations(risks, 'region');
    const ownerConcentrations = calculateConcentrations(risks, 'owner');
    const categoryConcentrations = calculateConcentrations(risks, 'category');
    const allConcentrations = [...regionConcentrations, ...ownerConcentrations, ...categoryConcentrations];
    const systemic = calculateSystemicIndicator(risks, kris, allConcentrations);

    // Use functional update to avoid alerts in dependency array
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAlerts(prevAlerts => {
      const newAlerts = generateAlerts(risks, kris, allConcentrations, systemic, prevAlerts);
      // Only update if alerts changed to avoid unnecessary re-renders
      if (newAlerts.length !== prevAlerts.length) {
        return newAlerts;
      }
      return prevAlerts;
    });
  }, [risks, kris]);

  // Validation
  const { validationErrors, isConsistent } = useMemo(() => {
    const errors: string[] = [];

    // Check KRI-Risk linkage
    const riskIds = new Set(risks.map(r => String(r.id)));
    kris.forEach(k => {
      if (!riskIds.has(String(k.riskId))) {
        errors.push(`KRI ${k.id} references unknown risk ${k.riskId}`);
      }
    });

    // Check Event-Risk linkage
    events.forEach(e => {
      if (!riskIds.has(String(e.relatedRiskId))) {
        errors.push(`Event ${e.id} references unknown risk ${e.relatedRiskId}`);
      }
    });

    return { validationErrors: errors, isConsistent: errors.length === 0 };
  }, [risks, kris, events]);

  // Data loading functions
  const loadRisks = useCallback((data: Record<string, unknown>[]) => {
    const normalized = data.map((row, idx) => {
      const risk: Partial<RiskRecord> = {
        id: findColumnValue(row, ['risk id', 'id', 'risk_id']) as string | number || idx + 1,
        category: parseString(findColumnValue(row, ['category', 'risk category', 'type'])),
        description: parseString(findColumnValue(row, ['description', 'risk description', 'name'])),
        rootCause: parseString(findColumnValue(row, ['root cause', 'cause', 'driver'])),
        likelihood: parseNumber(findColumnValue(row, ['likelihood', 'probability'])),
        impact: parseNumber(findColumnValue(row, ['impact', 'severity', 'consequence'])),
        velocity: normalizeVelocity(findColumnValue(row, ['velocity', 'speed'])),
        inherentScore: parseNumber(findColumnValue(row, ['inherent', 'gross', 'initial'])),
        existingControls: parseString(findColumnValue(row, ['existing controls', 'controls', 'mitigation'])),
        controlEffectiveness: normalizeEffectiveness(findColumnValue(row, ['control effectiveness', 'effectiveness'])),
        residualScore: parseNumber(findColumnValue(row, ['residual', 'net', 'current score'])),
        appetiteAlignment: normalizeAppetiteAlignment(findColumnValue(row, ['appetite', 'tolerance', 'alignment'])),
        owner: parseString(findColumnValue(row, ['owner', 'risk owner', 'responsible'])),
        region: parseString(findColumnValue(row, ['region', 'location', 'geography', 'country'])),
        status: parseString(findColumnValue(row, ['status', 'state']), 'Open') as RiskRecord['status'],
        linkedKRIs: [],
        linkedEvents: [],
        linkedControls: [],
        riskTrend: 'Stable',
      };

      // Determine escalation
      const escalation = determineEscalation(risk, kris);
      risk.isEscalated = escalation.isEscalated;
      risk.escalationReasons = escalation.reasons;

      return risk as RiskRecord;
    });

    setRisks(normalized);
    setLastUpdated(new Date());
    setDataSource('Risk Register');
  }, [kris]);

  const loadKRIs = useCallback((data: Record<string, unknown>[]) => {
    const normalized = data.map((row, idx) => {
      const currentValue = parseNumber(findColumnValue(row, ['current value', 'value', 'actual']));
      const threshold = parseNumber(findColumnValue(row, ['threshold', 'limit', 'target']));

      return {
        id: findColumnValue(row, ['kri id', 'id', 'kri_id']) as string | number || idx + 1,
        riskId: findColumnValue(row, ['risk id', 'risk_id', 'related risk']) as string | number || 0,
        indicator: parseString(findColumnValue(row, ['indicator', 'kri', 'metric', 'name'])),
        currentValue,
        threshold,
        trend: normalizeTrend(findColumnValue(row, ['trend', 'direction'])),
        status: normalizeKRIStatus(findColumnValue(row, ['status', 'breach', 'alert'])),
        breachPercentage: threshold > 0 ? ((currentValue - threshold) / threshold) * 100 : 0,
      } as KRIRecord;
    });

    setKRIs(normalized);
    setLastUpdated(new Date());

    // Re-evaluate risk escalations with new KRI data
    if (risks.length > 0) {
      setRisks(prev => prev.map(risk => {
        const linkedKRIs = normalized.filter(k => String(k.riskId) === String(risk.id));
        const escalation = determineEscalation(risk, normalized);
        return {
          ...risk,
          linkedKRIs: linkedKRIs.map(k => String(k.id)),
          isEscalated: escalation.isEscalated,
          escalationReasons: escalation.reasons,
          riskTrend: linkedKRIs.some(k => k.trend === 'Up') ? 'Deteriorating'
            : linkedKRIs.some(k => k.trend === 'Down') ? 'Improving'
            : 'Stable',
        };
      }));
    }
  }, [risks]);

  const loadEvents = useCallback((data: Record<string, unknown>[]) => {
    const normalized = data.map((row, idx) => ({
      id: findColumnValue(row, ['event id', 'id', 'event_id']) as string | number || idx + 101,
      relatedRiskId: findColumnValue(row, ['related risk', 'risk id', 'risk_id']) as string | number || 0,
      description: parseString(findColumnValue(row, ['description', 'event description', 'name'])),
      eventDate: parseString(findColumnValue(row, ['date', 'event date', 'when'])),
      financialImpact: parseNumber(findColumnValue(row, ['financial', 'monetary', 'cost', 'loss', 'amount'])),
      operationalImpact: normalizeOperationalImpact(findColumnValue(row, ['operational', 'operational impact', 'ops impact'])),
      rootCauseConfirmed: parseString(findColumnValue(row, ['root cause confirmed', 'confirmed'])).toLowerCase() === 'yes',
    } as RiskEventRecord));

    setEvents(normalized);
    setLastUpdated(new Date());

    // Update risk linkages
    if (risks.length > 0) {
      setRisks(prev => prev.map(risk => {
        const linkedEvents = normalized.filter(e => String(e.relatedRiskId) === String(risk.id));
        return {
          ...risk,
          linkedEvents: linkedEvents.map(e => String(e.id)),
        };
      }));
    }
  }, [risks]);

  const loadControls = useCallback((data: Record<string, unknown>[]) => {
    const normalized = data.map((row, idx) => {
      const mappedRisksStr = parseString(findColumnValue(row, ['mapped risk', 'risk ids', 'linked risk', 'associated']));
      const mappedRiskIds = mappedRisksStr.split(/[,;]/).map(s => s.trim()).filter(Boolean);

      return {
        id: parseString(findColumnValue(row, ['control id', 'id', 'control_id'])) || `C${idx + 1}`,
        name: parseString(findColumnValue(row, ['control name', 'name', 'control'])),
        type: normalizeControlType(findColumnValue(row, ['control type', 'type'])),
        automationLevel: normalizeAutomation(findColumnValue(row, ['automation', 'automation level'])),
        owner: parseString(findColumnValue(row, ['owner', 'responsible'])),
        mappedRiskIds,
        effectiveness: normalizeEffectiveness(findColumnValue(row, ['effectiveness', 'strength'])),
      } as ControlRecord;
    });

    setControls(normalized);
    setLastUpdated(new Date());

    // Update risk linkages
    if (risks.length > 0) {
      setRisks(prev => prev.map(risk => {
        const linkedControls = normalized.filter(c => c.mappedRiskIds.includes(String(risk.id)));
        return {
          ...risk,
          linkedControls: linkedControls.map(c => c.id),
        };
      }));
    }
  }, [risks]);

  const loadScenarios = useCallback((data: Record<string, unknown>[]) => {
    const normalized = data.map((row, idx) => {
      const triggeredStr = parseString(findColumnValue(row, ['triggered risks', 'risks', 'affected']));
      const triggeredRiskIds = triggeredStr.split(/[,;]/).map(s => s.trim()).filter(Boolean);
      const probability = parseNumber(findColumnValue(row, ['probability', 'likelihood']));
      const estimatedLoss = parseNumber(findColumnValue(row, ['estimated loss', 'loss', 'impact']));

      return {
        id: findColumnValue(row, ['scenario id', 'id']) as string | number || idx + 1,
        name: parseString(findColumnValue(row, ['scenario name', 'name', 'scenario'])),
        triggeredRiskIds,
        probability,
        estimatedLoss,
        expectedLoss: probability * estimatedLoss,
      } as StressScenario;
    });

    setScenarios(normalized);
    setLastUpdated(new Date());
  }, []);

  const loadAppetites = useCallback((data: Record<string, unknown>[]) => {
    const normalized = data.map(row => ({
      category: parseString(findColumnValue(row, ['category', 'risk category'])),
      level: normalizeEffectiveness(findColumnValue(row, ['appetite level', 'level', 'appetite'])) as RiskAppetite['level'],
      threshold: parseNumber(findColumnValue(row, ['threshold', 'limit'])),
      guidance: parseString(findColumnValue(row, ['guidance', 'board guidance', 'description'])),
    } as RiskAppetite));

    setAppetites(normalized);
    setLastUpdated(new Date());
  }, []);

  const loadFromAnalysis = useCallback((dataType: string, data: Record<string, unknown>[]) => {
    switch (dataType) {
      case 'risk_register':
        loadRisks(data);
        break;
      case 'kri_metrics':
        loadKRIs(data);
        break;
      case 'risk_events':
        loadEvents(data);
        break;
      case 'controls':
        loadControls(data);
        break;
      case 'stress_scenarios':
        loadScenarios(data);
        break;
      case 'risk_appetite':
        loadAppetites(data);
        break;
    }
  }, [loadRisks, loadKRIs, loadEvents, loadControls, loadScenarios, loadAppetites]);

  // Query functions
  const getRiskById = useCallback((id: string | number) => {
    return risks.find(r => String(r.id) === String(id));
  }, [risks]);

  const getKRIsForRisk = useCallback((riskId: string | number) => {
    return kris.filter(k => String(k.riskId) === String(riskId));
  }, [kris]);

  const getEventsForRisk = useCallback((riskId: string | number) => {
    return events.filter(e => String(e.relatedRiskId) === String(riskId));
  }, [events]);

  const getControlsForRisk = useCallback((riskId: string | number) => {
    return controls.filter(c => c.mappedRiskIds.includes(String(riskId)));
  }, [controls]);

  const getEscalatedRisks = useCallback(() => {
    return risks.filter(r => r.isEscalated);
  }, [risks]);

  const getRisksOutsideAppetite = useCallback(() => {
    return risks.filter(r => r.appetiteAlignment === 'Outside Appetite');
  }, [risks]);

  const getConcentrationWarnings = useCallback(() => {
    return intelligence?.concentrationRisks || [];
  }, [intelligence]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));
  }, []);

  const getUnacknowledgedAlerts = useCallback(() => {
    return alerts.filter(a => !a.acknowledged);
  }, [alerts]);

  const recalculateIntelligence = useCallback(() => {
    // Force recalculation by updating timestamp
    setLastUpdated(new Date());
  }, []);

  const clearAllData = useCallback(() => {
    setRisks([]);
    setKRIs([]);
    setEvents([]);
    setControls([]);
    setScenarios([]);
    setAppetites([]);
    setAlerts([]);
    setLastUpdated(null);
    setDataSource(null);
  }, []);

  const value: RiskIntelligenceContextType = {
    risks,
    kris,
    events,
    controls,
    scenarios,
    appetites,
    intelligence,
    isLoaded: risks.length > 0 || kris.length > 0 || events.length > 0,
    lastUpdated,
    dataSource,
    validationErrors,
    isConsistent,
    loadRisks,
    loadKRIs,
    loadEvents,
    loadControls,
    loadScenarios,
    loadAppetites,
    loadFromAnalysis,
    getRiskById,
    getKRIsForRisk,
    getEventsForRisk,
    getControlsForRisk,
    getEscalatedRisks,
    getRisksOutsideAppetite,
    getConcentrationWarnings,
    acknowledgeAlert,
    getUnacknowledgedAlerts,
    recalculateIntelligence,
    clearAllData,
  };

  return (
    <RiskIntelligenceContext.Provider value={value}>
      {children}
    </RiskIntelligenceContext.Provider>
  );
}

export function useRiskIntelligence() {
  const context = useContext(RiskIntelligenceContext);
  if (!context) {
    throw new Error('useRiskIntelligence must be used within a RiskIntelligenceProvider');
  }
  return context;
}

export default RiskIntelligenceContext;
