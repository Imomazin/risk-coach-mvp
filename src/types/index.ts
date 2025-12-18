export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  level: RiskLevel;
  probability: number;
  impact: number;
  status: 'identified' | 'assessing' | 'mitigating' | 'resolved' | 'accepted';
  owner?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type RiskCategory =
  | 'operational'
  | 'financial'
  | 'strategic'
  | 'compliance'
  | 'technology'
  | 'reputational'
  | 'environmental'
  | 'human-capital';

export interface RiskStats {
  total: number;
  byLevel: Record<RiskLevel, number>;
  byCategory: Record<RiskCategory, number>;
  byStatus: Record<Risk['status'], number>;
}

export interface MitigationAction {
  id: string;
  riskId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee?: string;
  dueDate?: string;
  completedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  avatar?: string;
}
