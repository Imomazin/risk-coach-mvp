import { Layout } from '../components/layout';
import {
  StatsCard,
  RiskMatrix,
  RiskList,
  AICoachWidget,
} from '../components/dashboard';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { sampleRisks, riskStats, riskMatrixData } from '../lib/sampleData';

export function Dashboard() {
  const activeRisks = sampleRisks.filter(
    (r) => r.status !== 'resolved' && r.status !== 'accepted'
  );

  return (
    <Layout
      title="Risk Dashboard"
      subtitle="Monitor and manage your organization's risk landscape"
    >
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
        {/* Left Column - Risk Matrix & List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Heat Map */}
          <RiskMatrix risks={riskMatrixData} />

          {/* Recent Risks */}
          <RiskList
            risks={activeRisks.slice(0, 5)}
            title="Active Risks"
            showViewAll
          />
        </div>

        {/* Right Column - AI Coach & Quick Stats */}
        <div className="space-y-6">
          {/* AI Coach Widget */}
          <AICoachWidget />

          {/* Risk Distribution */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
            <h3 className="font-display font-semibold text-lg text-slate-900 mb-4">
              Risk by Category
            </h3>
            <div className="space-y-3">
              {Object.entries(riskStats.byCategory)
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {category.replace('-', ' ')}
                        </span>
                        <span className="text-sm text-slate-500">{count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-lumina-500 to-lumina-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${(count / riskStats.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
            <h3 className="font-display font-semibold text-lg text-slate-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 transition-colors">
                <div className="p-2 rounded-lg bg-lumina-50 text-lumina-600">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Add New Risk
                  </p>
                  <p className="text-xs text-slate-500">
                    Identify and document a new risk
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 transition-colors">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Review Overdue
                  </p>
                  <p className="text-xs text-slate-500">
                    2 risks need attention
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 transition-colors">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Generate Report
                  </p>
                  <p className="text-xs text-slate-500">
                    Export monthly summary
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
