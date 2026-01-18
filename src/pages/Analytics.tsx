import { Layout } from '../components/layout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { sampleRisks, riskStats } from '../lib/sampleData';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
} from 'lucide-react';

export function Analytics() {
  const totalScore = sampleRisks.reduce((sum, r) => sum + r.probability * r.impact, 0);
  const avgScore = (totalScore / sampleRisks.length).toFixed(1);

  return (
    <Layout title="Analytics" subtitle="Risk trends and insights">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
          {['7D', '30D', '90D', '1Y', 'All'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                period === '30D'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total Risk Score</p>
              <p className="text-3xl font-bold text-slate-900">{totalScore}</p>
            </div>
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-lumina-500 to-lumina-600 rounded-full" />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Average Risk Score</p>
              <p className="text-3xl font-bold text-slate-900">{avgScore}</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-sm">
              <TrendingDown className="w-4 h-4" />
              -5%
            </div>
          </div>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Mitigation Rate</p>
              <p className="text-3xl font-bold text-slate-900">67%</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              +8%
            </div>
          </div>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Risks Resolved</p>
              <p className="text-3xl font-bold text-slate-900">24</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              +15%
            </div>
          </div>
          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Trend</CardTitle>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[65, 72, 58, 80, 75, 68, 82, 70, 65, 78, 72, 68].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-lumina-600 to-lumina-400 rounded-t-lg transition-all hover:from-lumina-700 hover:to-lumina-500"
                  style={{ height: `${value}%` }}
                />
                <span className="text-[10px] text-slate-400">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Risk by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <PieChart className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <div className="flex items-center justify-center gap-8">
            {/* Simple Donut Visualization */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {(() => {
                  const categories = Object.entries(riskStats.byCategory).filter(([, v]) => v > 0);
                  const colors = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#6366f1', '#14b8a6'];
                  let offset = 0;
                  return categories.map(([cat, count], i) => {
                    const percentage = (count / riskStats.total) * 100;
                    const dashArray = `${percentage} ${100 - percentage}`;
                    const element = (
                      <circle
                        key={cat}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={colors[i % colors.length]}
                        strokeWidth="20"
                        strokeDasharray={dashArray}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += percentage;
                    return element;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">{riskStats.total}</p>
                  <p className="text-xs text-slate-500">Total Risks</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {Object.entries(riskStats.byCategory)
                .filter(([, v]) => v > 0)
                .map(([category, count], i) => {
                  const colors = ['bg-lumina-500', 'bg-amber-500', 'bg-emerald-500', 'bg-red-500', 'bg-blue-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
                  return (
                    <div key={category} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                      <span className="text-sm text-slate-600 capitalize">
                        {category.replace('-', ' ')}
                      </span>
                      <span className="text-sm font-medium text-slate-900">{count}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Level Distribution</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-4 gap-4">
          {[
            { level: 'Low', count: riskStats.byLevel.low, color: 'emerald', percentage: 25 },
            { level: 'Medium', count: riskStats.byLevel.medium, color: 'amber', percentage: 37 },
            { level: 'High', count: riskStats.byLevel.high, color: 'red', percentage: 25 },
            { level: 'Critical', count: riskStats.byLevel.critical, color: 'red', percentage: 13 },
          ].map((item) => (
            <div key={item.level} className="text-center p-4 rounded-xl bg-slate-50">
              <p className={`text-4xl font-bold ${
                item.color === 'emerald' ? 'text-emerald-600' :
                item.color === 'amber' ? 'text-amber-600' : 'text-red-600'
              }`}>
                {item.count}
              </p>
              <p className="text-sm font-medium text-slate-700 mt-1">{item.level}</p>
              <p className="text-xs text-slate-400">
                {((item.count / riskStats.total) * 100).toFixed(0)}% of total
              </p>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}
