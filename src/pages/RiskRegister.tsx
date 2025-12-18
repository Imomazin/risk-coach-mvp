import { useState } from 'react';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { RiskBadge } from '../components/ui/Badge';
import { sampleRisks } from '../lib/sampleData';
import type { RiskCategory, RiskLevel } from '../types';
import {
  Plus,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye,
  Shield,
  Zap,
  DollarSign,
  Scale,
  Cpu,
  Building,
  Leaf,
  Users,
} from 'lucide-react';

const categoryIcons: Record<RiskCategory, React.ElementType> = {
  operational: Zap,
  financial: DollarSign,
  strategic: Shield,
  compliance: Scale,
  technology: Cpu,
  reputational: Building,
  environmental: Leaf,
  'human-capital': Users,
};

const categoryLabels: Record<RiskCategory, string> = {
  operational: 'Operational',
  financial: 'Financial',
  strategic: 'Strategic',
  compliance: 'Compliance',
  technology: 'Technology',
  reputational: 'Reputational',
  environmental: 'Environmental',
  'human-capital': 'Human Capital',
};

export function RiskRegister() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'title'>('score');

  const filteredRisks = sampleRisks
    .filter((risk) => {
      const matchesSearch =
        risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || risk.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || risk.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.probability * b.impact - a.probability * a.impact;
      if (sortBy === 'date') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return a.title.localeCompare(b.title);
    });

  return (
    <Layout title="Risk Register" subtitle="Comprehensive view of all identified risks">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search risks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
                     text-sm text-slate-900 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as RiskCategory | 'all')}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as RiskLevel | 'all')}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
          >
            <option value="all">All Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <Button variant="secondary" size="md">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="secondary" size="md">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Add Risk
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{filteredRisks.length}</span> of{' '}
          <span className="font-medium text-slate-700">{sampleRisks.length}</span> risks
        </p>
        <button
          onClick={() => setSortBy(sortBy === 'score' ? 'date' : sortBy === 'date' ? 'title' : 'score')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowUpDown className="w-4 h-4" />
          Sort by: {sortBy === 'score' ? 'Risk Score' : sortBy === 'date' ? 'Last Updated' : 'Title'}
        </button>
      </div>

      {/* Risk Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Risk
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRisks.map((risk) => {
                const CategoryIcon = categoryIcons[risk.category];
                const score = risk.probability * risk.impact;
                return (
                  <tr key={risk.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{risk.title}</p>
                          <p className="text-sm text-slate-500 line-clamp-1 max-w-md">
                            {risk.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600 capitalize">
                        {risk.category.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <RiskBadge level={risk.level} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-lg font-bold ${
                        score >= 15 ? 'text-red-600' :
                        score >= 8 ? 'text-amber-600' :
                        score >= 4 ? 'text-yellow-600' : 'text-emerald-600'
                      }`}>
                        {score}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        risk.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' :
                        risk.status === 'mitigating' ? 'bg-blue-50 text-blue-700' :
                        risk.status === 'assessing' ? 'bg-amber-50 text-amber-700' :
                        risk.status === 'accepted' ? 'bg-slate-100 text-slate-600' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {risk.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600">{risk.owner || '—'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRisks.length === 0 && (
          <div className="py-12 text-center">
            <Shield className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500">No risks match your filters</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
            }}>
              Clear filters
            </Button>
          </div>
        )}
      </Card>
    </Layout>
  );
}
