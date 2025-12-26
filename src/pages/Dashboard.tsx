import { useState } from 'react';
import { Layout } from '../components/layout';
import {
  StatsCard,
  RiskMatrix,
  RiskList,
  AICoachWidget,
} from '../components/dashboard';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
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
} from 'lucide-react';
import { sampleRisks, riskStats, riskMatrixData } from '../lib/sampleData';

type TabId = 'overview' | 'matrix' | 'activity' | 'timeline' | 'mitigation';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'matrix', label: 'Risk Matrix', icon: Target },
  { id: 'activity', label: 'Recent Activity', icon: Activity },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'mitigation', label: 'Mitigation', icon: TrendingUp },
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
  ]},
  { date: 'Feb 2026', events: [
    { title: 'Board Risk Presentation', type: 'milestone', status: 'planned' },
  ]},
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const activeRisks = sampleRisks.filter(
    (r) => r.status !== 'resolved' && r.status !== 'accepted'
  );

  return (
    <Layout
      title="Risk Dashboard"
      subtitle="Monitor and manage your organization's risk landscape"
    >
      {/* Dashboard Tabs */}
      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
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

      {/* Tab Content */}
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
              title="Being Mitigated"
              value={riskStats.byStatus.mitigating}
              change={-5}
              changeLabel="vs last month"
              icon={Clock}
              iconColor="amber"
            />
            <StatsCard
              title="Resolved This Month"
              value={2}
              change={-25}
              changeLabel="vs last month"
              icon={CheckCircle2}
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

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <div className="p-2 rounded-lg bg-lumina-50 dark:bg-lumina-900/50 text-lumina-600 dark:text-lumina-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Add New Risk</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Identify and document a new risk</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Review Overdue</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">2 risks need attention</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Generate Report</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Export monthly summary</p>
                    </div>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

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
