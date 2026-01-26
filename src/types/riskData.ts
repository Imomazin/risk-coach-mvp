/**
 * Enterprise Risk Management Data Types
 * These types are flexible to accommodate various ERM data structures
 */

// Detected data type for uploaded files
export type ERMDataType =
  | 'risk_register'
  | 'risk_events'
  | 'kri_metrics'
  | 'controls'
  | 'risk_appetite'
  | 'stress_scenarios'
  | 'generic';

// Column pattern definitions for data type detection
export interface ColumnPattern {
  required: string[];  // At least N of these patterns must match
  optional: string[];  // Additional patterns that strengthen the match
  minRequired: number; // Minimum required patterns to match
}

// Risk Register record
export interface RiskRegisterRecord {
  riskId: string | number;
  category: string;
  description?: string;
  rootCause?: string;
  likelihood: number;
  impact: number;
  velocity?: string;
  inherentScore: number;
  controls?: string;
  controlEffectiveness?: string;
  residualScore: number;
  appetiteAlignment?: string;
  owner?: string;
  region?: string;
  status?: string;
  [key: string]: unknown;
}

// Risk Event record
export interface RiskEventRecord {
  eventId: string | number;
  relatedRiskId: string | number;
  description?: string;
  eventDate: string;
  financialImpact: number;
  operationalImpact?: string;
  rootCauseConfirmed?: boolean | string;
  [key: string]: unknown;
}

// KRI (Key Risk Indicator) record
export interface KRIRecord {
  kriId: string | number;
  riskId: string | number;
  indicator: string;
  currentValue: number;
  threshold: number;
  trend?: string;
  status: string;
  [key: string]: unknown;
}

// Control record
export interface ControlRecord {
  controlId: string;
  name: string;
  type: string;
  automationLevel?: string;
  owner?: string;
  mappedRiskIds?: string;
  [key: string]: unknown;
}

// Risk Appetite record
export interface RiskAppetiteRecord {
  category: string;
  appetiteLevel: string;
  guidance?: string;
  [key: string]: unknown;
}

// Stress Scenario record
export interface StressScenarioRecord {
  scenarioId: string | number;
  name: string;
  triggeredRisks: string;
  probability: number;
  estimatedLoss: number;
  [key: string]: unknown;
}

// Analysis result types
export interface RiskDistributionAnalysis {
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  byRegion: Record<string, number>;
  byOwner: Record<string, number>;
  highRiskCount: number;
  totalCount: number;
}

export interface RiskScoreAnalysis {
  inherentScores: {
    min: number;
    max: number;
    mean: number;
    median: number;
    distribution: { range: string; count: number }[];
  };
  residualScores: {
    min: number;
    max: number;
    mean: number;
    median: number;
    distribution: { range: string; count: number }[];
  };
  controlEffectiveness: number; // % reduction from inherent to residual
}

export interface KRIAnalysis {
  totalKRIs: number;
  breachedCount: number;
  breachRate: number;
  byStatus: Record<string, number>;
  byTrend: Record<string, number>;
  criticalBreaches: { indicator: string; value: number; threshold: number; riskId: string | number }[];
}

export interface EventAnalysis {
  totalEvents: number;
  totalFinancialImpact: number;
  averageImpact: number;
  byMonth: { month: string; count: number; totalImpact: number }[];
  byOperationalImpact: Record<string, number>;
  topRisksbyEventCount: { riskId: string | number; count: number }[];
}

export interface ControlAnalysis {
  totalControls: number;
  byType: Record<string, number>;
  byAutomationLevel: Record<string, number>;
  byOwner: Record<string, number>;
  coverageGaps: string[]; // Risk IDs without controls
  averageControlsPerRisk: number;
}

export interface StressAnalysis {
  totalScenarios: number;
  totalExpectedLoss: number;
  worstCaseScenario: { name: string; probability: number; loss: number };
  riskExposureByScenario: { name: string; expectedLoss: number }[];
}

export interface AppetiteAnalysis {
  alignedCount: number;
  outsideAppetiteCount: number;
  byCategory: Record<string, { aligned: number; outside: number }>;
}

// Comprehensive analysis result
export interface ERMAnalysisResult {
  dataType: ERMDataType;
  recordCount: number;
  columns: string[];
  insights: AnalysisInsight[];
  riskDistribution?: RiskDistributionAnalysis;
  riskScores?: RiskScoreAnalysis;
  kriAnalysis?: KRIAnalysis;
  eventAnalysis?: EventAnalysis;
  controlAnalysis?: ControlAnalysis;
  stressAnalysis?: StressAnalysis;
  appetiteAnalysis?: AppetiteAnalysis;
}

export interface AnalysisInsight {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: string;
  title: string;
  description: string;
  metric?: string | number;
  recommendation?: string;
}
