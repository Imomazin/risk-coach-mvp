import type { Risk, RiskStats } from '../types';

export const sampleRisks: Risk[] = [
  {
    id: '1',
    title: 'Supply Chain Disruption',
    description:
      'Potential delays or interruptions in key supplier deliveries affecting production timelines and customer commitments.',
    category: 'operational',
    level: 'high',
    probability: 4,
    impact: 5,
    status: 'mitigating',
    owner: 'Sarah Chen',
    dueDate: 'Dec 20, 2025',
    createdAt: '2025-11-01',
    updatedAt: '2025-12-15',
  },
  {
    id: '2',
    title: 'Cybersecurity Breach',
    description:
      'Risk of unauthorized access to sensitive customer data and proprietary business information through system vulnerabilities.',
    category: 'technology',
    level: 'critical',
    probability: 3,
    impact: 5,
    status: 'mitigating',
    owner: 'Mike Johnson',
    dueDate: 'Dec 18, 2025',
    createdAt: '2025-10-15',
    updatedAt: '2025-12-14',
  },
  {
    id: '3',
    title: 'Regulatory Compliance Gap',
    description:
      'Potential non-compliance with new industry regulations taking effect Q1 next year requiring updated processes.',
    category: 'compliance',
    level: 'medium',
    probability: 3,
    impact: 4,
    status: 'assessing',
    owner: 'Lisa Wang',
    dueDate: 'Jan 15, 2026',
    createdAt: '2025-11-20',
    updatedAt: '2025-12-10',
  },
  {
    id: '4',
    title: 'Key Employee Departure',
    description:
      'Risk of losing critical technical knowledge if senior engineers leave without proper knowledge transfer.',
    category: 'human-capital',
    level: 'medium',
    probability: 3,
    impact: 3,
    status: 'identified',
    owner: 'HR Team',
    dueDate: 'Feb 1, 2026',
    createdAt: '2025-12-01',
    updatedAt: '2025-12-12',
  },
  {
    id: '5',
    title: 'Currency Exchange Volatility',
    description:
      'Exposure to foreign exchange fluctuations affecting international revenue and supplier payments.',
    category: 'financial',
    level: 'low',
    probability: 2,
    impact: 3,
    status: 'accepted',
    owner: 'Finance Team',
    createdAt: '2025-09-15',
    updatedAt: '2025-11-30',
  },
  {
    id: '6',
    title: 'Market Share Erosion',
    description:
      'Competitive pressure from new market entrants offering similar services at lower price points.',
    category: 'strategic',
    level: 'high',
    probability: 4,
    impact: 4,
    status: 'assessing',
    owner: 'Strategy Team',
    dueDate: 'Jan 30, 2026',
    createdAt: '2025-11-10',
    updatedAt: '2025-12-08',
  },
  {
    id: '7',
    title: 'Environmental Compliance',
    description:
      'New sustainability requirements may require significant operational changes and investments.',
    category: 'environmental',
    level: 'low',
    probability: 2,
    impact: 2,
    status: 'identified',
    owner: 'Operations',
    createdAt: '2025-12-05',
    updatedAt: '2025-12-05',
  },
  {
    id: '8',
    title: 'Reputation Risk - Social Media',
    description:
      'Potential negative publicity from customer complaints or incidents going viral on social platforms.',
    category: 'reputational',
    level: 'medium',
    probability: 3,
    impact: 4,
    status: 'mitigating',
    owner: 'Marketing',
    dueDate: 'Dec 25, 2025',
    createdAt: '2025-11-25',
    updatedAt: '2025-12-13',
  },
];

export const riskStats: RiskStats = {
  total: sampleRisks.length,
  byLevel: {
    low: sampleRisks.filter((r) => r.level === 'low').length,
    medium: sampleRisks.filter((r) => r.level === 'medium').length,
    high: sampleRisks.filter((r) => r.level === 'high').length,
    critical: sampleRisks.filter((r) => r.level === 'critical').length,
  },
  byCategory: {
    operational: sampleRisks.filter((r) => r.category === 'operational').length,
    financial: sampleRisks.filter((r) => r.category === 'financial').length,
    strategic: sampleRisks.filter((r) => r.category === 'strategic').length,
    compliance: sampleRisks.filter((r) => r.category === 'compliance').length,
    technology: sampleRisks.filter((r) => r.category === 'technology').length,
    reputational: sampleRisks.filter((r) => r.category === 'reputational')
      .length,
    environmental: sampleRisks.filter((r) => r.category === 'environmental')
      .length,
    'human-capital': sampleRisks.filter((r) => r.category === 'human-capital')
      .length,
  },
  byStatus: {
    identified: sampleRisks.filter((r) => r.status === 'identified').length,
    assessing: sampleRisks.filter((r) => r.status === 'assessing').length,
    mitigating: sampleRisks.filter((r) => r.status === 'mitigating').length,
    resolved: sampleRisks.filter((r) => r.status === 'resolved').length,
    accepted: sampleRisks.filter((r) => r.status === 'accepted').length,
  },
};

export const riskMatrixData = sampleRisks.map((r) => ({
  id: r.id,
  title: r.title,
  probability: r.probability,
  impact: r.impact,
}));
