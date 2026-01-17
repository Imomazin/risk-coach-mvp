import { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/layout';
import {
  StatsCard,
  RiskMatrix,
  RiskList,
  AICoachWidget,
} from '../components/dashboard';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Activity,
  Calendar,
  Target,
  TrendingUp,
  Users,
  FileText,
  Gauge,
  BarChart3,
  PieChart,
  LineChart,
  Radar,
  Layers,
  GitBranch,
  Zap,
  Download,
  Settings,
  Bell,
  Database,
  Lock,
  Globe,
  Building,
  DollarSign,
  Scale,
  HeartPulse,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  AlertCircle,
  TrendingDown,
  Thermometer,
  CircleDot,
  Crosshair,
} from 'lucide-react';
import { sampleRisks, riskStats, riskMatrixData } from '../lib/sampleData';

type TabId = 'overview' | 'tools' | 'kri' | 'appetite' | 'cases' | 'matrix' | 'activity' | 'timeline' | 'mitigation';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'tools', label: 'Risk Tools', icon: Layers },
  { id: 'kri', label: 'Key Risk Indicators', icon: Gauge },
  { id: 'appetite', label: 'Risk Appetite', icon: Thermometer },
  { id: 'cases', label: 'Case Studies', icon: FileText },
  { id: 'matrix', label: 'Risk Matrix', icon: Target },
  { id: 'activity', label: 'Recent Activity', icon: Activity },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'mitigation', label: 'Mitigation', icon: TrendingUp },
];

// 24 Risk Intelligence Tools
const riskTools = [
  { id: 1, name: 'Risk Heat Map', description: 'Visual probability vs impact matrix', icon: Target, color: 'bg-red-500', category: 'Assessment' },
  { id: 2, name: 'Bow-Tie Analysis', description: 'Cause-consequence visualization', icon: GitBranch, color: 'bg-blue-500', category: 'Analysis' },
  { id: 3, name: 'Monte Carlo Simulation', description: 'Probabilistic risk modeling', icon: BarChart3, color: 'bg-purple-500', category: 'Quantitative' },
  { id: 4, name: 'Scenario Analysis', description: 'What-if risk scenarios', icon: Layers, color: 'bg-amber-500', category: 'Planning' },
  { id: 5, name: 'Risk Register', description: 'Comprehensive risk database', icon: Database, color: 'bg-emerald-500', category: 'Documentation' },
  { id: 6, name: 'KRI Dashboard', description: 'Key Risk Indicator monitoring', icon: Gauge, color: 'bg-cyan-500', category: 'Monitoring' },
  { id: 7, name: 'Control Assessment', description: 'Control effectiveness testing', icon: Shield, color: 'bg-indigo-500', category: 'Controls' },
  { id: 8, name: 'RCSA Tool', description: 'Risk Control Self-Assessment', icon: CheckCircle2, color: 'bg-green-500', category: 'Assessment' },
  { id: 9, name: 'Loss Event Database', description: 'Historical loss tracking', icon: AlertTriangle, color: 'bg-orange-500', category: 'Documentation' },
  { id: 10, name: 'Risk Appetite Manager', description: 'Appetite threshold management', icon: Thermometer, color: 'bg-pink-500', category: 'Governance' },
  { id: 11, name: 'Compliance Tracker', description: 'Regulatory compliance monitoring', icon: Scale, color: 'bg-violet-500', category: 'Compliance' },
  { id: 12, name: 'Vendor Risk Portal', description: 'Third-party risk management', icon: Building, color: 'bg-slate-500', category: 'Third Party' },
  { id: 13, name: 'Cyber Risk Analyzer', description: 'Cybersecurity risk assessment', icon: Lock, color: 'bg-red-600', category: 'Technology' },
  { id: 14, name: 'Financial Risk Model', description: 'Market & credit risk analysis', icon: DollarSign, color: 'bg-emerald-600', category: 'Financial' },
  { id: 15, name: 'Operational Risk Tool', description: 'Operational risk management', icon: Zap, color: 'bg-amber-600', category: 'Operational' },
  { id: 16, name: 'Strategic Risk Radar', description: 'Strategic risk visualization', icon: Radar, color: 'bg-blue-600', category: 'Strategic' },
  { id: 17, name: 'ESG Risk Monitor', description: 'Environmental & social governance', icon: Globe, color: 'bg-teal-500', category: 'ESG' },
  { id: 18, name: 'Incident Manager', description: 'Risk incident response', icon: AlertCircle, color: 'bg-rose-500', category: 'Response' },
  { id: 19, name: 'Risk Reporting Suite', description: 'Automated risk reports', icon: FileText, color: 'bg-sky-500', category: 'Reporting' },
  { id: 20, name: 'Trend Analytics', description: 'Risk trend analysis', icon: LineChart, color: 'bg-fuchsia-500', category: 'Analytics' },
  { id: 21, name: 'Risk Aggregation', description: 'Enterprise risk aggregation', icon: PieChart, color: 'bg-lime-500', category: 'Enterprise' },
  { id: 22, name: 'Early Warning System', description: 'Predictive risk alerts', icon: Bell, color: 'bg-yellow-500', category: 'Monitoring' },
  { id: 23, name: 'Business Continuity', description: 'BCP & disaster recovery', icon: HeartPulse, color: 'bg-red-400', category: 'Resilience' },
  { id: 24, name: 'AI Risk Coach', description: 'AI-powered risk guidance', icon: Sparkles, color: 'bg-violet-600', category: 'AI' },
];

// Case Studies Data
const caseStudies = [
  {
    id: 1,
    title: 'Global Bank Credit Risk Transformation',
    company: 'Fortune 500 Bank',
    industry: 'Financial Services',
    challenge: 'Manual credit risk assessment causing $50M annual losses',
    solution: 'Implemented AI-powered KRI monitoring with real-time credit scoring',
    results: ['68% reduction in credit losses', '45% faster loan processing', 'ROI achieved in 8 months'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
  },
  {
    id: 2,
    title: 'Healthcare Compliance Revolution',
    company: 'Regional Health System',
    industry: 'Healthcare',
    challenge: 'HIPAA violations resulting in $2M fines over 3 years',
    solution: 'Deployed comprehensive compliance tracking with automated KRIs',
    results: ['Zero violations post-implementation', '90% audit preparation time saved', '$1.5M annual savings'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
  },
  {
    id: 3,
    title: 'Supply Chain Risk Mitigation',
    company: 'Manufacturing Leader',
    industry: 'Manufacturing',
    challenge: 'COVID-19 exposed critical supplier dependencies',
    solution: 'Built multi-tier supplier risk monitoring with early warning KRIs',
    results: ['95% supply disruption prediction accuracy', '40% reduction in stockouts', 'Diversified supplier base by 3x'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
  },
  {
    id: 4,
    title: 'Cybersecurity Risk Framework',
    company: 'Tech Enterprise',
    industry: 'Technology',
    challenge: 'Increasing cyber threats with limited visibility',
    solution: 'Integrated cyber KRIs with threat intelligence and SIEM',
    results: ['85% faster threat detection', '60% reduction in incident response time', 'Zero breaches in 24 months'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
  },
  {
    id: 5,
    title: 'Operational Risk Excellence',
    company: 'Insurance Giant',
    industry: 'Insurance',
    challenge: 'Fragmented operational risk data across 50+ business units',
    solution: 'Unified risk register with automated RCSA and loss event tracking',
    results: ['360° risk visibility achieved', '$25M identified risk exposure', '30% OpEx reduction'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
  },
  {
    id: 6,
    title: 'ESG Risk Integration',
    company: 'Energy Corporation',
    industry: 'Energy',
    challenge: 'Investor pressure on ESG transparency and reporting',
    solution: 'Developed ESG risk framework with 50+ sustainability KRIs',
    results: ['ESG rating improved from B to AA', '$500M green bond issued', 'Carbon neutral by 2030 roadmap'],
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400',
  },
];

// Key Risk Indicators Data
const kriCategories = [
  {
    category: 'Financial KRIs',
    icon: DollarSign,
    color: 'emerald',
    indicators: [
      { name: 'Debt-to-Equity Ratio', value: 1.2, threshold: 2.0, trend: 'stable', status: 'green' },
      { name: 'Liquidity Coverage Ratio', value: 125, threshold: 100, trend: 'up', status: 'green', unit: '%' },
      { name: 'Credit Loss Rate', value: 2.1, threshold: 3.0, trend: 'down', status: 'green', unit: '%' },
      { name: 'Revenue Concentration', value: 35, threshold: 40, trend: 'up', status: 'amber', unit: '%' },
    ],
  },
  {
    category: 'Operational KRIs',
    icon: Zap,
    color: 'amber',
    indicators: [
      { name: 'System Downtime', value: 99.8, threshold: 99.5, trend: 'stable', status: 'green', unit: '% uptime' },
      { name: 'Transaction Error Rate', value: 0.05, threshold: 0.1, trend: 'down', status: 'green', unit: '%' },
      { name: 'Process Cycle Time', value: 2.3, threshold: 3.0, trend: 'down', status: 'green', unit: ' days' },
      { name: 'Employee Turnover', value: 18, threshold: 15, trend: 'up', status: 'red', unit: '%' },
    ],
  },
  {
    category: 'Compliance KRIs',
    icon: Scale,
    color: 'violet',
    indicators: [
      { name: 'Audit Finding Closure', value: 92, threshold: 90, trend: 'up', status: 'green', unit: '%' },
      { name: 'Policy Exception Rate', value: 3, threshold: 5, trend: 'stable', status: 'green', unit: '%' },
      { name: 'Training Completion', value: 88, threshold: 95, trend: 'up', status: 'amber', unit: '%' },
      { name: 'Regulatory Changes Pending', value: 7, threshold: 10, trend: 'down', status: 'green' },
    ],
  },
  {
    category: 'Cybersecurity KRIs',
    icon: Lock,
    color: 'red',
    indicators: [
      { name: 'Patch Compliance', value: 94, threshold: 95, trend: 'up', status: 'amber', unit: '%' },
      { name: 'Phishing Click Rate', value: 2.1, threshold: 3, trend: 'down', status: 'green', unit: '%' },
      { name: 'Mean Time to Detect', value: 4.2, threshold: 6, trend: 'down', status: 'green', unit: ' hrs' },
      { name: 'Vulnerability Age', value: 28, threshold: 30, trend: 'stable', status: 'amber', unit: ' days' },
    ],
  },
  {
    category: 'Strategic KRIs',
    icon: Target,
    color: 'blue',
    indicators: [
      { name: 'Market Share', value: 23.5, threshold: 20, trend: 'up', status: 'green', unit: '%' },
      { name: 'Customer Satisfaction', value: 4.2, threshold: 4.0, trend: 'stable', status: 'green', unit: '/5' },
      { name: 'Innovation Pipeline', value: 15, threshold: 10, trend: 'up', status: 'green', unit: ' projects' },
      { name: 'Strategic Initiative Delivery', value: 78, threshold: 80, trend: 'up', status: 'amber', unit: '%' },
    ],
  },
  {
    category: 'Third-Party KRIs',
    icon: Building,
    color: 'slate',
    indicators: [
      { name: 'Critical Vendor SLA', value: 97, threshold: 95, trend: 'stable', status: 'green', unit: '%' },
      { name: 'Vendor Risk Score', value: 72, threshold: 70, trend: 'down', status: 'green', unit: '/100' },
      { name: 'Contract Compliance', value: 95, threshold: 98, trend: 'up', status: 'amber', unit: '%' },
      { name: 'Supplier Concentration', value: 25, threshold: 30, trend: 'stable', status: 'green', unit: '%' },
    ],
  },
];

// Risk Appetite Data
const riskAppetiteCategories = [
  {
    category: 'Strategic Risk',
    appetite: 'Moderate-High',
    tolerance: '15-25%',
    current: 18,
    description: 'Willing to pursue growth opportunities with calculated strategic risks',
    color: 'blue',
    statements: [
      'Accept moderate uncertainty in new market expansion',
      'Willing to invest in innovation with defined success criteria',
      'Strategic partnerships evaluated on risk-reward basis',
    ],
  },
  {
    category: 'Financial Risk',
    appetite: 'Moderate',
    tolerance: '10-20%',
    current: 12,
    description: 'Balanced approach to financial risks maintaining stability',
    color: 'emerald',
    statements: [
      'Debt-to-equity ratio maintained below 2.0',
      'Liquidity buffer minimum of 120% coverage',
      'Investment portfolio diversification required',
    ],
  },
  {
    category: 'Operational Risk',
    appetite: 'Low-Moderate',
    tolerance: '5-15%',
    current: 8,
    description: 'Limited tolerance for operational disruptions',
    color: 'amber',
    statements: [
      'System uptime target of 99.9%',
      'Business continuity plans tested quarterly',
      'Process automation prioritized for critical functions',
    ],
  },
  {
    category: 'Compliance Risk',
    appetite: 'Very Low',
    tolerance: '0-5%',
    current: 2,
    description: 'Near-zero tolerance for regulatory violations',
    color: 'violet',
    statements: [
      'Zero tolerance for material compliance breaches',
      'Proactive engagement with regulators',
      'Compliance training completion above 95%',
    ],
  },
  {
    category: 'Cybersecurity Risk',
    appetite: 'Low',
    tolerance: '0-10%',
    current: 6,
    description: 'Minimal tolerance for cyber incidents',
    color: 'red',
    statements: [
      'Defense-in-depth security architecture',
      'Zero tolerance for data breaches',
      'Continuous security monitoring required',
    ],
  },
  {
    category: 'Reputational Risk',
    appetite: 'Very Low',
    tolerance: '0-5%',
    current: 3,
    description: 'Protecting brand and stakeholder trust paramount',
    color: 'pink',
    statements: [
      'Crisis management protocols in place',
      'Social media monitoring active',
      'ESG commitments publicly tracked',
    ],
  },
];

const recentActivities = [
  { id: 1, type: 'risk_added', title: 'New risk identified', description: 'API Security Vulnerability added by Mike Johnson', time: '2 hours ago', icon: Shield },
  { id: 2, type: 'status_change', title: 'Status updated', description: 'Supply Chain Disruption moved to "Mitigating"', time: '4 hours ago', icon: Activity },
  { id: 3, type: 'comment', title: 'Comment added', description: 'Sarah Chen commented on Cybersecurity Breach', time: '6 hours ago', icon: FileText },
  { id: 4, type: 'owner_assigned', title: 'Owner assigned', description: 'Lisa Wang assigned to Regulatory Compliance Gap', time: '1 day ago', icon: Users },
  { id: 5, type: 'risk_resolved', title: 'Risk resolved', description: 'Legacy System Migration marked as resolved', time: '2 days ago', icon: CheckCircle2 },
  { id: 6, type: 'due_date', title: 'Due date approaching', description: 'Cybersecurity Breach mitigation due in 3 days', time: '2 days ago', icon: Clock },
];

const mitigationActions = [
  { id: 1, risk: 'Cybersecurity Breach', action: 'Complete penetration testing', assignee: 'Mike Johnson', dueDate: 'Dec 18', progress: 75, status: 'in_progress' },
  { id: 2, risk: 'Supply Chain Disruption', action: 'Identify backup suppliers', assignee: 'Sarah Chen', dueDate: 'Dec 20', progress: 40, status: 'in_progress' },
  { id: 3, risk: 'Regulatory Compliance', action: 'Update compliance documentation', assignee: 'Lisa Wang', dueDate: 'Jan 15', progress: 10, status: 'pending' },
  { id: 4, risk: 'Market Share Erosion', action: 'Competitive analysis report', assignee: 'Strategy Team', dueDate: 'Jan 30', progress: 60, status: 'in_progress' },
  { id: 5, risk: 'Reputation Risk', action: 'Social media monitoring setup', assignee: 'Marketing', dueDate: 'Dec 25', progress: 90, status: 'in_progress' },
];

const timelineEvents = [
  { date: 'Dec 2025', events: [
    { title: 'Q4 Risk Review', type: 'milestone', status: 'upcoming' },
    { title: 'Cybersecurity Assessment', type: 'deadline', status: 'upcoming' },
  ]},
  { date: 'Jan 2026', events: [
    { title: 'Compliance Audit', type: 'deadline', status: 'planned' },
    { title: 'Annual Risk Report', type: 'milestone', status: 'planned' },
    { title: 'KRI Framework Review', type: 'milestone', status: 'planned' },
  ]},
  { date: 'Feb 2026', events: [
    { title: 'Board Risk Presentation', type: 'milestone', status: 'planned' },
    { title: 'Risk Appetite Review', type: 'deadline', status: 'planned' },
  ]},
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [toolFilter, setToolFilter] = useState('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll case studies
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentCaseIndex((prev) => (prev + 1) % caseStudies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const activeRisks = sampleRisks.filter(
    (r) => r.status !== 'resolved' && r.status !== 'accepted'
  );

  const toolCategories = ['All', ...new Set(riskTools.map(t => t.category))];
  const filteredTools = toolFilter === 'All' ? riskTools : riskTools.filter(t => t.category === toolFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-emerald-500';
      case 'amber': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <CircleDot className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <Layout
      title="Risk Intelligence Dashboard"
      subtitle="Comprehensive risk monitoring, analysis, and management platform"
    >
      {/* Dashboard Tabs */}
      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${isActive
                    ? 'border-lumina-600 text-lumina-600 dark:text-lumina-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ==================== OVERVIEW TAB ==================== */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total Risks"
              value={riskStats.total}
              change={-8}
              changeLabel="vs last month"
              icon={Shield}
              iconColor="violet"
            />
            <StatsCard
              title="High Priority"
              value={riskStats.byLevel.high + riskStats.byLevel.critical}
              change={15}
              changeLabel="vs last month"
              icon={AlertTriangle}
              iconColor="red"
            />
            <StatsCard
              title="KRIs in Alert"
              value={4}
              change={-2}
              changeLabel="vs last week"
              icon={Gauge}
              iconColor="amber"
            />
            <StatsCard
              title="Appetite Breaches"
              value={1}
              change={-50}
              changeLabel="vs last month"
              icon={Thermometer}
              iconColor="emerald"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RiskMatrix risks={riskMatrixData} />
              <RiskList
                risks={activeRisks.slice(0, 5)}
                title="Active Risks"
                showViewAll
              />
            </div>

            <div className="space-y-6">
              <AICoachWidget />

              {/* Quick KRI Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>KRI Status Summary</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Within Tolerance</span>
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">18</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Approaching Threshold</span>
                    <span className="text-lg font-bold text-amber-700 dark:text-amber-400">4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/30">
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">Breached</span>
                    <span className="text-lg font-bold text-red-700 dark:text-red-400">2</span>
                  </div>
                </div>
              </Card>

              {/* Risk by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk by Category</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  {Object.entries(riskStats.byCategory)
                    .filter(([, count]) => count > 0)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                              {category.replace('-', ' ')}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{count}</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-lumina-500 to-lumina-600 rounded-full transition-all duration-500"
                              style={{ width: `${(count / riskStats.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* ==================== RISK TOOLS TAB ==================== */}
      {activeTab === 'tools' && (
        <>
          {/* Tool Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {toolCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setToolFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  toolFilter === cat
                    ? 'bg-lumina-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.id} padding="none" className="group hover:shadow-lg transition-all cursor-pointer">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${tool.color} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                        {tool.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-lumina-600 dark:group-hover:text-lumina-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {tool.description}
                    </p>
                  </div>
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <button className="text-sm font-medium text-lumina-600 dark:text-lumina-400 flex items-center gap-1 hover:gap-2 transition-all">
                      Launch Tool <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Tool Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <p className="text-3xl font-bold text-lumina-600 dark:text-lumina-400">24</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Tools</p>
            </Card>
            <Card className="text-center">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">12</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Daily</p>
            </Card>
            <Card className="text-center">
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">156</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Users This Week</p>
            </Card>
            <Card className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">98%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Satisfaction</p>
            </Card>
          </div>
        </>
      )}

      {/* ==================== KRI TAB ==================== */}
      {activeTab === 'kri' && (
        <>
          {/* KRI Header */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-lumina-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-display font-bold mb-2">Key Risk Indicators Dashboard</h2>
              <p className="text-white/80 max-w-2xl">
                Monitor leading indicators that provide early warning signals of emerging risks.
                KRIs are tied to your risk appetite thresholds and trigger alerts when approaching or breaching limits.
              </p>
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">24</p>
                  <p className="text-sm text-white/70">Active KRIs</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-300">18</p>
                  <p className="text-sm text-white/70">Green</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-300">4</p>
                  <p className="text-sm text-white/70">Amber</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-300">2</p>
                  <p className="text-sm text-white/70">Red</p>
                </div>
              </div>
            </div>
          </div>

          {/* KRI Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {kriCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card key={cat.category} padding="none">
                  <div className={`p-4 border-b border-slate-100 dark:border-slate-800 bg-${cat.color}-50 dark:bg-${cat.color}-900/20`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${cat.color}-500 text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{cat.category}</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {cat.indicators.map((kri, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(kri.status)}`} />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm">{kri.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Threshold: {kri.threshold}{kri.unit || ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-slate-900 dark:text-white">{kri.value}{kri.unit || ''}</p>
                          </div>
                          {getTrendIcon(kri.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* KRI Best Practices Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>KRI Development Best Practices</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Predictive Nature</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">KRIs should indicate future risk developments, not past losses. Focus on leading indicators.</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Clear Thresholds</h4>
                <p className="text-sm text-emerald-600 dark:text-emerald-300">Define inherent, residual, and target risk levels with specific trigger points for escalation.</p>
              </div>
              <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/30">
                <h4 className="font-semibold text-violet-700 dark:text-violet-400 mb-2">Actionability</h4>
                <p className="text-sm text-violet-600 dark:text-violet-300">Each KRI breach should trigger defined management actions and response protocols.</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* ==================== RISK APPETITE TAB ==================== */}
      {activeTab === 'appetite' && (
        <>
          {/* Appetite Header */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-display font-bold mb-2">Risk Appetite Framework</h2>
              <p className="text-white/80 max-w-2xl">
                Our risk appetite framework defines the amount and type of risk the organization is willing
                to pursue or retain to achieve strategic objectives. Aligned with ISO 31000 standards.
              </p>
              <div className="mt-4 flex gap-4">
                <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <Download className="w-4 h-4" /> Export Statement
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <Settings className="w-4 h-4" /> Configure
                </Button>
              </div>
            </div>
          </div>

          {/* Overall Appetite Statement */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enterprise Risk Appetite Statement</CardTitle>
            </CardHeader>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-l-4 border-lumina-500">
              <p className="text-slate-700 dark:text-slate-300 italic">
                "As an organization committed to sustainable growth, we maintain a <strong>Moderate</strong> overall
                risk appetite. We are willing to accept calculated risks in strategic initiatives while maintaining
                stringent controls over compliance, cybersecurity, and reputational risks. Our risk-taking is guided
                by our values, regulatory requirements, and stakeholder expectations."
              </p>
            </div>
          </Card>

          {/* Appetite Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {riskAppetiteCategories.map((cat) => (
              <Card key={cat.category} padding="none">
                <div className={`p-4 border-b border-slate-100 dark:border-slate-800`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{cat.category}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${cat.color}-100 dark:bg-${cat.color}-900/50 text-${cat.color}-700 dark:text-${cat.color}-400`}>
                      {cat.appetite}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{cat.description}</p>
                </div>
                <div className="p-4">
                  {/* Tolerance Gauge */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Tolerance Range: {cat.tolerance}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Current: {cat.current}%</span>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-${cat.color}-400 to-${cat.color}-600`}
                        style={{ width: `${cat.current}%` }}
                      />
                      {/* Threshold markers */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-amber-500" style={{ left: `${parseInt(cat.tolerance.split('-')[0])}%` }} />
                      <div className="absolute top-0 bottom-0 w-0.5 bg-red-500" style={{ left: `${parseInt(cat.tolerance.split('-')[1])}%` }} />
                    </div>
                  </div>

                  {/* Appetite Statements */}
                  <div className="space-y-2">
                    {cat.statements.map((statement, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 dark:text-slate-400">{statement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Appetite vs Tolerance Explanation */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Understanding Risk Appetite vs Tolerance</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-lumina-50 dark:bg-lumina-900/30">
                <h4 className="font-semibold text-lumina-700 dark:text-lumina-400 mb-2 flex items-center gap-2">
                  <Thermometer className="w-5 h-5" /> Risk Appetite
                </h4>
                <p className="text-sm text-lumina-600 dark:text-lumina-300">
                  The overall level of risk an enterprise is willing to take to achieve its objectives.
                  It is a strategic, high-level statement set by the board and executive leadership.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                  <Crosshair className="w-5 h-5" /> Risk Tolerance
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-300">
                  The level of variation acceptable in outcomes related to specific risks.
                  Tolerance levels are more granular, measurable, and tied to specific KRIs.
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* ==================== CASE STUDIES TAB ==================== */}
      {activeTab === 'cases' && (
        <>
          {/* Featured Case Study Carousel */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
              <div
                ref={scrollContainerRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentCaseIndex * 100}%)` }}
              >
                {caseStudies.map((study) => (
                  <div key={study.id} className="w-full flex-shrink-0 p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="text-white">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-lumina-500/30 text-lumina-300 mb-4">
                          {study.industry}
                        </span>
                        <h2 className="text-3xl font-display font-bold mb-4">{study.title}</h2>
                        <p className="text-white/70 mb-4">{study.company}</p>
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-lumina-400 mb-2">Challenge</h4>
                          <p className="text-white/80">{study.challenge}</p>
                        </div>
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-emerald-400 mb-2">Solution</h4>
                          <p className="text-white/80">{study.solution}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {study.results.map((result, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-300">
                              {result}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="hidden lg:block">
                        <img
                          src={study.image}
                          alt={study.title}
                          className="w-full h-64 object-cover rounded-xl opacity-80"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  onClick={() => setCurrentCaseIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {caseStudies.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentCaseIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentCaseIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentCaseIndex((prev) => (prev + 1) % caseStudies.length)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors ml-4"
                >
                  {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* All Case Studies Grid */}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">All Case Studies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study) => (
              <Card key={study.id} padding="none" className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5">
                  <span className="text-xs px-2 py-1 rounded-full bg-lumina-100 dark:bg-lumina-900/50 text-lumina-700 dark:text-lumina-400">
                    {study.industry}
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white mt-3 mb-2 line-clamp-2">
                    {study.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {study.challenge}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {study.results.slice(0, 2).map((result, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        {result.split(' ').slice(0, 3).join(' ')}...
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ==================== MATRIX TAB ==================== */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RiskMatrix risks={riskMatrixData} />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Matrix Legend</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Risk Levels</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-emerald-200 dark:bg-emerald-700" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Low (1-4)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-700" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Medium (5-9)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-amber-200 dark:bg-amber-700" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">High (10-14)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-200 dark:bg-red-700" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Critical (15-25)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Axes</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>X-axis:</strong> Impact (1-5)<br />
                    <strong>Y-axis:</strong> Probability (1-5)
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ==================== ACTIVITY TAB ==================== */}
      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="py-4 flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ==================== TIMELINE TAB ==================== */}
      {activeTab === 'timeline' && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Timeline</CardTitle>
          </CardHeader>
          <div className="space-y-8">
            {timelineEvents.map((month, idx) => (
              <div key={month.date} className="relative">
                {idx !== timelineEvents.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                )}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-lumina-100 dark:bg-lumina-900 text-lumina-600 dark:text-lumina-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {month.date.split(' ')[0].slice(0, 3)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">{month.date}</h4>
                    <div className="space-y-3">
                      {month.events.map((event, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                          <div className={`w-2 h-2 rounded-full ${
                            event.status === 'upcoming' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{event.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            event.type === 'milestone'
                              ? 'bg-lumina-100 text-lumina-700 dark:bg-lumina-900 dark:text-lumina-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ==================== MITIGATION TAB ==================== */}
      {activeTab === 'mitigation' && (
        <Card padding="none">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Mitigation Actions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track progress on risk mitigation activities</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Risk</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Action</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Assignee</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Due Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {mitigationActions.map((action) => (
                  <tr key={action.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-900 dark:text-white">{action.risk}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{action.action}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{action.assignee}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{action.dueDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              action.progress >= 75 ? 'bg-emerald-500' :
                              action.progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${action.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-10">
                          {action.progress}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </Layout>
  );
}
