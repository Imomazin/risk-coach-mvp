/**
 * Risk Data Analyzer - Generalizable ERM Data Analysis Engine
 *
 * This module provides pattern-based detection and analysis of enterprise
 * risk management datasets. It uses fuzzy matching to avoid overfitting
 * to specific column naming conventions.
 */

import type {
  ERMDataType,
  ERMAnalysisResult,
  AnalysisInsight,
  RiskDistributionAnalysis,
  RiskScoreAnalysis,
  KRIAnalysis,
  EventAnalysis,
  ControlAnalysis,
  StressAnalysis,
} from '../types/riskData';

// Column pattern definitions for flexible data type detection
const DATA_TYPE_PATTERNS: Record<ERMDataType, { patterns: string[][]; minMatches: number }> = {
  risk_register: {
    patterns: [
      ['risk', 'id'],
      ['category', 'type'],
      ['likelihood', 'probability'],
      ['impact', 'severity', 'consequence'],
      ['score', 'rating', 'level'],
      ['status', 'state'],
      ['owner', 'responsible'],
    ],
    minMatches: 4,
  },
  risk_events: {
    patterns: [
      ['event', 'incident'],
      ['risk', 'id'],
      ['date', 'time', 'when'],
      ['financial', 'monetary', 'cost', 'loss'],
      ['impact', 'severity'],
    ],
    minMatches: 3,
  },
  kri_metrics: {
    patterns: [
      ['kri', 'indicator', 'metric'],
      ['risk', 'id'],
      ['value', 'current', 'actual'],
      ['threshold', 'limit', 'target'],
      ['status', 'breach', 'alert'],
      ['trend', 'direction'],
    ],
    minMatches: 4,
  },
  controls: {
    patterns: [
      ['control', 'mitigation'],
      ['type', 'category'],
      ['automation', 'automated', 'manual'],
      ['owner', 'responsible'],
      ['risk', 'mapped', 'linked'],
    ],
    minMatches: 3,
  },
  risk_appetite: {
    patterns: [
      ['appetite', 'tolerance'],
      ['category', 'type'],
      ['level', 'threshold'],
      ['guidance', 'policy', 'board'],
    ],
    minMatches: 2,
  },
  stress_scenarios: {
    patterns: [
      ['scenario', 'stress', 'simulation'],
      ['probability', 'likelihood'],
      ['loss', 'impact', 'exposure'],
      ['risk', 'triggered'],
    ],
    minMatches: 3,
  },
  generic: {
    patterns: [],
    minMatches: 0,
  },
};

/**
 * Normalize column name for pattern matching
 */
function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[_\-\s]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Check if a column name matches any pattern in a pattern group
 */
function matchesPatternGroup(columnName: string, patterns: string[]): boolean {
  const normalized = normalizeColumnName(columnName);
  return patterns.some(pattern => normalized.includes(pattern));
}

/**
 * Detect the type of ERM data based on column names
 */
export function detectDataType(columns: string[]): ERMDataType {
  const normalizedColumns = columns.map(normalizeColumnName);

  let bestMatch: ERMDataType = 'generic';
  let bestScore = 0;

  for (const [dataType, config] of Object.entries(DATA_TYPE_PATTERNS)) {
    if (dataType === 'generic') continue;

    let matchCount = 0;
    for (const patternGroup of config.patterns) {
      const hasMatch = normalizedColumns.some(col =>
        patternGroup.some(pattern => col.includes(pattern))
      );
      if (hasMatch) matchCount++;
    }

    const score = matchCount / config.patterns.length;
    if (matchCount >= config.minMatches && score > bestScore) {
      bestScore = score;
      bestMatch = dataType as ERMDataType;
    }
  }

  return bestMatch;
}

/**
 * Find the column that best matches a pattern
 */
export function findColumn(columns: string[], patterns: string[]): string | null {
  for (const col of columns) {
    if (matchesPatternGroup(col, patterns)) {
      return col;
    }
  }
  return null;
}

/**
 * Extract numeric value from various formats
 */
function parseNumeric(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[,$%]/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

/**
 * Calculate statistics for numeric array
 */
function calculateStats(values: number[]): { min: number; max: number; mean: number; median: number; stdDev: number } {
  if (values.length === 0) return { min: 0, max: 0, mean: 0, median: 0, stdDev: 0 };

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    stdDev: Math.sqrt(variance),
  };
}

/**
 * Group and count values in a column
 */
function countByColumn(data: Record<string, unknown>[], column: string | null): Record<string, number> {
  if (!column) return {};

  const counts: Record<string, number> = {};
  for (const row of data) {
    const value = String(row[column] || 'Unknown');
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

/**
 * Create score distribution buckets
 */
function createScoreDistribution(values: number[], bucketSize: number = 5): { range: string; count: number }[] {
  if (values.length === 0) return [];

  const buckets: Record<string, number> = {};

  for (const val of values) {
    const bucketStart = Math.floor(val / bucketSize) * bucketSize;
    const bucketEnd = bucketStart + bucketSize - 1;
    const range = `${bucketStart}-${bucketEnd}`;
    buckets[range] = (buckets[range] || 0) + 1;
  }

  return Object.entries(buckets)
    .map(([range, count]) => ({ range, count }))
    .sort((a, b) => parseInt(a.range) - parseInt(b.range));
}

/**
 * Analyze Risk Register data
 */
function analyzeRiskRegister(
  data: Record<string, unknown>[],
  columns: string[]
): { distribution: RiskDistributionAnalysis; scores: RiskScoreAnalysis; insights: AnalysisInsight[] } {
  const categoryCol = findColumn(columns, ['category', 'type', 'class']);
  const statusCol = findColumn(columns, ['status', 'state']);
  const regionCol = findColumn(columns, ['region', 'location', 'geography', 'country']);
  const ownerCol = findColumn(columns, ['owner', 'responsible', 'assigned']);
  const inherentCol = findColumn(columns, ['inherent', 'gross', 'initial']);
  const residualCol = findColumn(columns, ['residual', 'net', 'current']);
  const appetiteCol = findColumn(columns, ['appetite', 'tolerance', 'alignment']);

  // Distribution analysis
  const distribution: RiskDistributionAnalysis = {
    byCategory: countByColumn(data, categoryCol),
    byStatus: countByColumn(data, statusCol),
    byRegion: countByColumn(data, regionCol),
    byOwner: countByColumn(data, ownerCol),
    highRiskCount: 0,
    totalCount: data.length,
  };

  // Score analysis
  const inherentScores = inherentCol
    ? data.map(row => parseNumeric(row[inherentCol])).filter(v => v > 0)
    : [];
  const residualScores = residualCol
    ? data.map(row => parseNumeric(row[residualCol])).filter(v => v > 0)
    : [];

  const inherentStats = calculateStats(inherentScores);
  const residualStats = calculateStats(residualScores);

  // Calculate high risk count (above median inherent score)
  const highRiskThreshold = inherentStats.median || 10;
  distribution.highRiskCount = inherentScores.filter(s => s > highRiskThreshold).length;

  // Control effectiveness
  const controlEffectiveness = inherentStats.mean > 0
    ? ((inherentStats.mean - residualStats.mean) / inherentStats.mean) * 100
    : 0;

  const scores: RiskScoreAnalysis = {
    inherentScores: {
      ...inherentStats,
      distribution: createScoreDistribution(inherentScores),
    },
    residualScores: {
      ...residualStats,
      distribution: createScoreDistribution(residualScores),
    },
    controlEffectiveness: Math.max(0, controlEffectiveness),
  };

  // Generate insights
  const insights: AnalysisInsight[] = [];

  // High risk concentration
  const highRiskPct = (distribution.highRiskCount / data.length) * 100;
  if (highRiskPct > 30) {
    insights.push({
      id: 'high-risk-concentration',
      type: 'critical',
      category: 'Risk Distribution',
      title: 'High Risk Concentration',
      description: `${highRiskPct.toFixed(1)}% of risks (${distribution.highRiskCount} items) exceed the high-risk threshold. This indicates significant risk exposure.`,
      metric: `${highRiskPct.toFixed(1)}%`,
      recommendation: 'Prioritize mitigation efforts on the highest-scoring risks and review control effectiveness.',
    });
  }

  // Control effectiveness assessment
  if (controlEffectiveness < 20 && inherentScores.length > 0 && residualScores.length > 0) {
    insights.push({
      id: 'low-control-effectiveness',
      type: 'warning',
      category: 'Control Assessment',
      title: 'Low Control Effectiveness',
      description: `Controls are only reducing risk scores by ${controlEffectiveness.toFixed(1)}% on average. Industry benchmark is typically 30-50%.`,
      metric: `${controlEffectiveness.toFixed(1)}%`,
      recommendation: 'Review and strengthen existing controls, or implement additional mitigating measures.',
    });
  } else if (controlEffectiveness >= 40) {
    insights.push({
      id: 'strong-controls',
      type: 'success',
      category: 'Control Assessment',
      title: 'Strong Control Environment',
      description: `Controls are reducing risk scores by ${controlEffectiveness.toFixed(1)}% on average, indicating effective risk mitigation.`,
      metric: `${controlEffectiveness.toFixed(1)}%`,
    });
  }

  // Category concentration
  if (categoryCol) {
    const categories = Object.entries(distribution.byCategory);
    const maxCategory = categories.reduce((a, b) => (b[1] > a[1] ? b : a), ['', 0]);
    const categoryPct = (maxCategory[1] / data.length) * 100;

    if (categoryPct > 40) {
      insights.push({
        id: 'category-concentration',
        type: 'warning',
        category: 'Risk Distribution',
        title: `${maxCategory[0]} Risk Concentration`,
        description: `${categoryPct.toFixed(1)}% of all risks are in the "${maxCategory[0]}" category. This may indicate a concentration risk.`,
        metric: maxCategory[1],
        recommendation: 'Ensure adequate resources are allocated to manage this risk category.',
      });
    }
  }

  // Appetite alignment check
  if (appetiteCol) {
    const outsideAppetite = data.filter(row => {
      const val = String(row[appetiteCol] || '').toLowerCase();
      return val.includes('outside') || val.includes('exceed') || val.includes('above');
    }).length;

    if (outsideAppetite > 0) {
      const outsidePct = (outsideAppetite / data.length) * 100;
      insights.push({
        id: 'appetite-breach',
        type: outsidePct > 20 ? 'critical' : 'warning',
        category: 'Risk Appetite',
        title: 'Risks Outside Appetite',
        description: `${outsideAppetite} risks (${outsidePct.toFixed(1)}%) are flagged as outside risk appetite boundaries.`,
        metric: outsideAppetite,
        recommendation: 'Escalate to senior management and develop action plans to bring risks within appetite.',
      });
    }
  }

  return { distribution, scores, insights };
}

/**
 * Analyze Risk Events data
 */
function analyzeRiskEvents(
  data: Record<string, unknown>[],
  columns: string[]
): { analysis: EventAnalysis; insights: AnalysisInsight[] } {
  const riskIdCol = findColumn(columns, ['risk', 'related']);
  const dateCol = findColumn(columns, ['date', 'time', 'when']);
  const financialCol = findColumn(columns, ['financial', 'monetary', 'cost', 'loss', 'amount']);
  const operationalCol = findColumn(columns, ['operational', 'impact', 'severity']);

  // Financial impact analysis
  const financialImpacts = financialCol
    ? data.map(row => parseNumeric(row[financialCol])).filter(v => v > 0)
    : [];

  const totalFinancialImpact = financialImpacts.reduce((a, b) => a + b, 0);
  const averageImpact = financialImpacts.length > 0 ? totalFinancialImpact / financialImpacts.length : 0;

  // Monthly trend
  const byMonth: Record<string, { count: number; totalImpact: number }> = {};
  if (dateCol) {
    for (const row of data) {
      const dateStr = String(row[dateCol] || '');
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!byMonth[monthKey]) byMonth[monthKey] = { count: 0, totalImpact: 0 };
        byMonth[monthKey].count++;
        if (financialCol) {
          byMonth[monthKey].totalImpact += parseNumeric(row[financialCol]);
        }
      }
    }
  }

  // Top risks by event count
  const riskEventCounts: Record<string, number> = {};
  if (riskIdCol) {
    for (const row of data) {
      const riskId = String(row[riskIdCol] || '');
      riskEventCounts[riskId] = (riskEventCounts[riskId] || 0) + 1;
    }
  }

  const topRisks = Object.entries(riskEventCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([riskId, count]) => ({ riskId, count }));

  const analysis: EventAnalysis = {
    totalEvents: data.length,
    totalFinancialImpact,
    averageImpact,
    byMonth: Object.entries(byMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, stats]) => ({ month, ...stats })),
    byOperationalImpact: countByColumn(data, operationalCol),
    topRisksbyEventCount: topRisks,
  };

  // Generate insights
  const insights: AnalysisInsight[] = [];

  // Total financial impact
  if (totalFinancialImpact > 0) {
    insights.push({
      id: 'total-financial-impact',
      type: 'info',
      category: 'Financial Impact',
      title: 'Total Financial Loss',
      description: `Total financial impact from ${data.length} risk events: ${formatCurrency(totalFinancialImpact)}. Average impact per event: ${formatCurrency(averageImpact)}.`,
      metric: formatCurrency(totalFinancialImpact),
    });
  }

  // Recurring risks
  const recurringRisks = topRisks.filter(r => r.count >= 3);
  if (recurringRisks.length > 0) {
    insights.push({
      id: 'recurring-events',
      type: 'warning',
      category: 'Event Patterns',
      title: 'Recurring Risk Events',
      description: `${recurringRisks.length} risk(s) have experienced 3+ events. Risk IDs: ${recurringRisks.map(r => r.riskId).join(', ')}.`,
      metric: recurringRisks.length,
      recommendation: 'Investigate root causes and strengthen preventive controls for these recurring risks.',
    });
  }

  // Trend analysis
  const monthlyData = analysis.byMonth;
  if (monthlyData.length >= 3) {
    const recentMonths = monthlyData.slice(-3);
    const previousMonths = monthlyData.slice(-6, -3);

    if (previousMonths.length >= 3) {
      const recentAvg = recentMonths.reduce((a, b) => a + b.count, 0) / recentMonths.length;
      const previousAvg = previousMonths.reduce((a, b) => a + b.count, 0) / previousMonths.length;

      if (recentAvg > previousAvg * 1.5) {
        insights.push({
          id: 'increasing-events',
          type: 'critical',
          category: 'Event Trends',
          title: 'Increasing Event Frequency',
          description: `Risk events have increased by ${((recentAvg / previousAvg - 1) * 100).toFixed(0)}% compared to the previous period.`,
          recommendation: 'Conduct a root cause analysis to understand the drivers of increased event frequency.',
        });
      }
    }
  }

  return { analysis, insights };
}

/**
 * Analyze KRI data
 */
function analyzeKRIs(
  data: Record<string, unknown>[],
  columns: string[]
): { analysis: KRIAnalysis; insights: AnalysisInsight[] } {
  const valueCol = findColumn(columns, ['value', 'current', 'actual']);
  const thresholdCol = findColumn(columns, ['threshold', 'limit', 'target']);
  const statusCol = findColumn(columns, ['status', 'breach', 'alert']);
  const trendCol = findColumn(columns, ['trend', 'direction']);
  const indicatorCol = findColumn(columns, ['indicator', 'kri', 'metric', 'name']);
  const riskIdCol = findColumn(columns, ['risk', 'id']);

  // Calculate breaches
  const breachedKRIs: { indicator: string; value: number; threshold: number; riskId: string | number }[] = [];

  for (const row of data) {
    const value = valueCol ? parseNumeric(row[valueCol]) : 0;
    const threshold = thresholdCol ? parseNumeric(row[thresholdCol]) : 0;
    const status = statusCol ? String(row[statusCol] || '').toLowerCase() : '';

    // Determine breach: either explicit status or value exceeds threshold
    const isBreached = status.includes('red') || status.includes('breach') ||
                       status.includes('critical') || (threshold > 0 && value > threshold);

    if (isBreached) {
      breachedKRIs.push({
        indicator: indicatorCol ? String(row[indicatorCol]) : 'Unknown',
        value,
        threshold,
        riskId: riskIdCol ? row[riskIdCol] as string | number : 'Unknown',
      });
    }
  }

  const analysis: KRIAnalysis = {
    totalKRIs: data.length,
    breachedCount: breachedKRIs.length,
    breachRate: data.length > 0 ? (breachedKRIs.length / data.length) * 100 : 0,
    byStatus: countByColumn(data, statusCol),
    byTrend: countByColumn(data, trendCol),
    criticalBreaches: breachedKRIs.slice(0, 10),
  };

  // Generate insights
  const insights: AnalysisInsight[] = [];

  // Breach rate
  if (analysis.breachRate > 50) {
    insights.push({
      id: 'high-breach-rate',
      type: 'critical',
      category: 'KRI Performance',
      title: 'Critical KRI Breach Rate',
      description: `${analysis.breachRate.toFixed(1)}% of KRIs (${analysis.breachedCount} of ${analysis.totalKRIs}) are in breach status. This indicates significant risk exposure.`,
      metric: `${analysis.breachRate.toFixed(1)}%`,
      recommendation: 'Immediate management attention required. Review and remediate breached KRIs.',
    });
  } else if (analysis.breachRate > 25) {
    insights.push({
      id: 'elevated-breach-rate',
      type: 'warning',
      category: 'KRI Performance',
      title: 'Elevated KRI Breach Rate',
      description: `${analysis.breachRate.toFixed(1)}% of KRIs are in breach. Target should be below 20%.`,
      metric: `${analysis.breachRate.toFixed(1)}%`,
      recommendation: 'Develop action plans to address breached indicators.',
    });
  } else {
    insights.push({
      id: 'healthy-kri-status',
      type: 'success',
      category: 'KRI Performance',
      title: 'Healthy KRI Status',
      description: `Only ${analysis.breachRate.toFixed(1)}% of KRIs are in breach. This indicates good risk control.`,
      metric: `${analysis.breachRate.toFixed(1)}%`,
    });
  }

  // Trend analysis
  if (trendCol) {
    const downTrend = Object.entries(analysis.byTrend)
      .filter(([trend]) => trend.toLowerCase().includes('down') || trend.toLowerCase().includes('decreas'))
      .reduce((sum, [, count]) => sum + count, 0);

    const upTrend = Object.entries(analysis.byTrend)
      .filter(([trend]) => trend.toLowerCase().includes('up') || trend.toLowerCase().includes('increas'))
      .reduce((sum, [, count]) => sum + count, 0);

    if (upTrend > downTrend && upTrend > data.length * 0.3) {
      insights.push({
        id: 'deteriorating-trends',
        type: 'warning',
        category: 'KRI Trends',
        title: 'Deteriorating KRI Trends',
        description: `${upTrend} KRIs show upward (worsening) trends vs ${downTrend} improving. Monitor closely.`,
        metric: upTrend,
      });
    }
  }

  return { analysis, insights };
}

/**
 * Analyze Controls data
 */
function analyzeControls(
  data: Record<string, unknown>[],
  columns: string[],
  riskIds?: Set<string | number>
): { analysis: ControlAnalysis; insights: AnalysisInsight[] } {
  const typeCol = findColumn(columns, ['type', 'category', 'class']);
  const automationCol = findColumn(columns, ['automation', 'automated', 'manual']);
  const ownerCol = findColumn(columns, ['owner', 'responsible']);
  const mappedRisksCol = findColumn(columns, ['mapped', 'risk', 'linked', 'associated']);

  // Parse mapped risks
  const allMappedRisks = new Set<string>();
  let totalMappings = 0;

  if (mappedRisksCol) {
    for (const row of data) {
      const mapped = String(row[mappedRisksCol] || '');
      const riskList = mapped.split(/[,;]/).map(r => r.trim()).filter(r => r);
      riskList.forEach(r => allMappedRisks.add(r));
      totalMappings += riskList.length;
    }
  }

  // Identify coverage gaps
  const coverageGaps: string[] = [];
  if (riskIds) {
    for (const riskId of riskIds) {
      if (!allMappedRisks.has(String(riskId))) {
        coverageGaps.push(String(riskId));
      }
    }
  }

  const analysis: ControlAnalysis = {
    totalControls: data.length,
    byType: countByColumn(data, typeCol),
    byAutomationLevel: countByColumn(data, automationCol),
    byOwner: countByColumn(data, ownerCol),
    coverageGaps,
    averageControlsPerRisk: allMappedRisks.size > 0 ? totalMappings / allMappedRisks.size : 0,
  };

  // Generate insights
  const insights: AnalysisInsight[] = [];

  // Automation level
  if (automationCol) {
    const manualCount = Object.entries(analysis.byAutomationLevel)
      .filter(([level]) => level.toLowerCase().includes('manual'))
      .reduce((sum, [, count]) => sum + count, 0);

    const manualPct = (manualCount / data.length) * 100;

    if (manualPct > 60) {
      insights.push({
        id: 'high-manual-controls',
        type: 'warning',
        category: 'Control Design',
        title: 'High Manual Control Reliance',
        description: `${manualPct.toFixed(1)}% of controls are manual, increasing operational risk and human error potential.`,
        metric: `${manualPct.toFixed(1)}%`,
        recommendation: 'Evaluate opportunities to automate key controls to improve reliability.',
      });
    }
  }

  // Control type balance
  if (typeCol) {
    const preventive = Object.entries(analysis.byType)
      .filter(([type]) => type.toLowerCase().includes('prevent'))
      .reduce((sum, [, count]) => sum + count, 0);

    const detective = Object.entries(analysis.byType)
      .filter(([type]) => type.toLowerCase().includes('detect'))
      .reduce((sum, [, count]) => sum + count, 0);

    if (detective > preventive) {
      insights.push({
        id: 'detective-heavy',
        type: 'info',
        category: 'Control Design',
        title: 'Detective Control Emphasis',
        description: `${detective} detective controls vs ${preventive} preventive. Consider strengthening preventive controls.`,
        recommendation: 'A balanced control environment typically favors preventive controls to stop issues before they occur.',
      });
    }
  }

  // Coverage gaps
  if (coverageGaps.length > 0) {
    insights.push({
      id: 'control-gaps',
      type: 'critical',
      category: 'Control Coverage',
      title: 'Risks Without Controls',
      description: `${coverageGaps.length} risk(s) have no mapped controls: ${coverageGaps.slice(0, 5).join(', ')}${coverageGaps.length > 5 ? '...' : ''}.`,
      metric: coverageGaps.length,
      recommendation: 'Assess these risks and implement appropriate controls.',
    });
  }

  return { analysis, insights };
}

/**
 * Analyze Stress Scenarios data
 */
function analyzeStressScenarios(
  data: Record<string, unknown>[],
  columns: string[]
): { analysis: StressAnalysis; insights: AnalysisInsight[] } {
  const probabilityCol = findColumn(columns, ['probability', 'likelihood', 'chance']);
  const lossCol = findColumn(columns, ['loss', 'impact', 'exposure', 'estimated']);
  const nameCol = findColumn(columns, ['name', 'scenario', 'description']);

  // Calculate expected losses
  let totalExpectedLoss = 0;
  let worstCase = { name: '', probability: 0, loss: 0 };
  const scenarios: { name: string; expectedLoss: number }[] = [];

  for (const row of data) {
    const probability = probabilityCol ? parseNumeric(row[probabilityCol]) : 0;
    const loss = lossCol ? parseNumeric(row[lossCol]) : 0;
    const name = nameCol ? String(row[nameCol]) : 'Unknown Scenario';

    const expectedLoss = probability * loss;
    totalExpectedLoss += expectedLoss;
    scenarios.push({ name, expectedLoss });

    if (loss > worstCase.loss) {
      worstCase = { name, probability, loss };
    }
  }

  const analysis: StressAnalysis = {
    totalScenarios: data.length,
    totalExpectedLoss,
    worstCaseScenario: worstCase,
    riskExposureByScenario: scenarios.sort((a, b) => b.expectedLoss - a.expectedLoss),
  };

  // Generate insights
  const insights: AnalysisInsight[] = [];

  insights.push({
    id: 'total-stress-exposure',
    type: 'info',
    category: 'Stress Testing',
    title: 'Expected Loss from Stress Scenarios',
    description: `Total expected loss across ${data.length} scenarios: ${formatCurrency(totalExpectedLoss)}. This represents probability-weighted exposure.`,
    metric: formatCurrency(totalExpectedLoss),
  });

  if (worstCase.loss > 0) {
    insights.push({
      id: 'worst-case-scenario',
      type: worstCase.probability > 0.25 ? 'critical' : 'warning',
      category: 'Stress Testing',
      title: 'Worst-Case Scenario',
      description: `"${worstCase.name}" could result in ${formatCurrency(worstCase.loss)} loss with ${(worstCase.probability * 100).toFixed(0)}% probability.`,
      metric: formatCurrency(worstCase.loss),
      recommendation: 'Ensure adequate capital reserves and contingency plans for high-impact scenarios.',
    });
  }

  return { analysis, insights };
}

/**
 * Format currency for display
 */
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Main analysis function - analyzes any ERM dataset
 */
export function analyzeERMData(
  data: Record<string, unknown>[],
  columns: string[],
  knownRiskIds?: Set<string | number>
): ERMAnalysisResult {
  const dataType = detectDataType(columns);

  const result: ERMAnalysisResult = {
    dataType,
    recordCount: data.length,
    columns,
    insights: [],
  };

  // Add data type detection insight
  result.insights.push({
    id: 'data-type-detected',
    type: 'info',
    category: 'Data Classification',
    title: `Detected: ${formatDataTypeName(dataType)}`,
    description: `This dataset has been identified as ${formatDataTypeName(dataType)} based on column patterns. ${data.length} records loaded for analysis.`,
    metric: data.length,
  });

  // Run type-specific analysis
  switch (dataType) {
    case 'risk_register': {
      const { distribution, scores, insights } = analyzeRiskRegister(data, columns);
      result.riskDistribution = distribution;
      result.riskScores = scores;
      result.insights.push(...insights);
      break;
    }
    case 'risk_events': {
      const { analysis, insights } = analyzeRiskEvents(data, columns);
      result.eventAnalysis = analysis;
      result.insights.push(...insights);
      break;
    }
    case 'kri_metrics': {
      const { analysis, insights } = analyzeKRIs(data, columns);
      result.kriAnalysis = analysis;
      result.insights.push(...insights);
      break;
    }
    case 'controls': {
      const { analysis, insights } = analyzeControls(data, columns, knownRiskIds);
      result.controlAnalysis = analysis;
      result.insights.push(...insights);
      break;
    }
    case 'stress_scenarios': {
      const { analysis, insights } = analyzeStressScenarios(data, columns);
      result.stressAnalysis = analysis;
      result.insights.push(...insights);
      break;
    }
    case 'risk_appetite':
    case 'generic':
    default: {
      // Generic analysis for unrecognized data
      result.insights.push({
        id: 'generic-analysis',
        type: 'info',
        category: 'General',
        title: 'Generic Data Analysis',
        description: `Dataset contains ${columns.length} columns and ${data.length} rows. Consider uploading risk register, events, KRIs, or controls data for specialized analysis.`,
      });
      break;
    }
  }

  return result;
}

function formatDataTypeName(type: ERMDataType): string {
  const names: Record<ERMDataType, string> = {
    risk_register: 'Risk Register',
    risk_events: 'Risk Events / Incidents',
    kri_metrics: 'Key Risk Indicators (KRIs)',
    controls: 'Control Inventory',
    risk_appetite: 'Risk Appetite Framework',
    stress_scenarios: 'Stress Scenarios',
    generic: 'General Dataset',
  };
  return names[type];
}

/**
 * Generate executive summary from multiple analyses
 */
export function generateExecutiveSummary(analyses: ERMAnalysisResult[]): AnalysisInsight[] {
  const summary: AnalysisInsight[] = [];

  // Aggregate critical insights
  const criticalInsights = analyses
    .flatMap(a => a.insights)
    .filter(i => i.type === 'critical');

  const warningInsights = analyses
    .flatMap(a => a.insights)
    .filter(i => i.type === 'warning');

  if (criticalInsights.length > 0) {
    summary.push({
      id: 'exec-critical',
      type: 'critical',
      category: 'Executive Summary',
      title: `${criticalInsights.length} Critical Finding(s)`,
      description: `Immediate attention required: ${criticalInsights.map(i => i.title).join(', ')}.`,
      recommendation: 'Review critical findings and develop remediation plans.',
    });
  }

  if (warningInsights.length > 0) {
    summary.push({
      id: 'exec-warnings',
      type: 'warning',
      category: 'Executive Summary',
      title: `${warningInsights.length} Warning(s)`,
      description: `Areas requiring attention: ${warningInsights.slice(0, 5).map(i => i.title).join(', ')}${warningInsights.length > 5 ? '...' : ''}.`,
    });
  }

  return summary;
}
