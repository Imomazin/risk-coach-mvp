import { useState, useMemo } from 'react';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { RiskBadge } from '../components/ui/Badge';
import { sampleRisks } from '../lib/sampleData';
import { useRiskIntelligence } from '../stores/RiskIntelligenceStore';
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
  Database,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  operational: Zap,
  financial: DollarSign,
  strategic: Shield,
  compliance: Scale,
  technology: Cpu,
  reputational: Building,
  environmental: Leaf,
  'human-capital': Users,
  // Additional categories from uploaded data
  credit: DollarSign,
  market: TrendingUp,
  liquidity: DollarSign,
  cyber: Cpu,
  regulatory: Scale,
  legal: Scale,
  fraud: AlertTriangle,
  thirdparty: Building,
  'third party': Building,
  model: Cpu,
  conduct: Users,
  default: Shield,
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

// Map store status to display format
function mapStoreStatus(status: string): 'open' | 'assessing' | 'mitigating' | 'resolved' | 'accepted' {
  const lower = status.toLowerCase();
  if (lower === 'closed') return 'resolved';
  if (lower === 'under review') return 'assessing';
  if (lower === 'escalated') return 'mitigating';
  return 'open';
}

// Get risk level from score
function getRiskLevel(score: number): RiskLevel {
  if (score >= 20) return 'critical';
  if (score >= 15) return 'high';
  if (score >= 8) return 'medium';
  return 'low';
}

// Get icon for a category string
function getCategoryIcon(category: string): React.ElementType {
  const lower = category.toLowerCase().replace(/[_\-\s]+/g, '');
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (lower.includes(key.replace(/[_\-\s]+/g, ''))) {
      return icon;
    }
  }
  return categoryIcons.default;
}

export function RiskRegister() {
  const { risks: storeRisks, isLoaded, intelligence } = useRiskIntelligence();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'title'>('score');

  // Determine which data source to use
  const isUsingLiveData = isLoaded && storeRisks.length > 0;

  // Transform store risks to display format
  const displayRisks = useMemo(() => {
    if (!isUsingLiveData) {
      return sampleRisks.map(risk => ({
        id: risk.id,
        title: risk.title,
        description: risk.description,
        category: risk.category,
        level: risk.level,
        score: risk.probability * risk.impact,
        status: risk.status,
        owner: risk.owner || '—',
        updatedAt: risk.updatedAt,
        isEscalated: false,
        riskTrend: 'Stable' as const,
        appetiteAlignment: 'Within Appetite' as const,
      }));
    }

    return storeRisks.map(risk => ({
      id: risk.id,
      title: risk.description.substring(0, 60) + (risk.description.length > 60 ? '...' : ''),
      description: risk.description,
      category: risk.category.toLowerCase().replace(/\s+/g, '-') as string,
      level: getRiskLevel(risk.residualScore),
      score: risk.residualScore,
      status: mapStoreStatus(risk.status),
      owner: risk.owner || '—',
      updatedAt: new Date().toISOString(),
      isEscalated: risk.isEscalated,
      riskTrend: risk.riskTrend,
      appetiteAlignment: risk.appetiteAlignment,
    }));
  }, [storeRisks, isUsingLiveData]);

  // Get unique categories from data
  const availableCategories = useMemo(() => {
    if (!isUsingLiveData) {
      return Object.entries(categoryLabels);
    }
    const cats = [...new Set(storeRisks.map(r => r.category))];
    return cats.map(c => [c.toLowerCase().replace(/\s+/g, '-'), c]);
  }, [storeRisks, isUsingLiveData]);

  const filteredRisks = displayRisks
    .filter((risk) => {
      const matchesSearch =
        risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' ||
        risk.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase().replace(/\s+/g, '-');
      const matchesLevel = selectedLevel === 'all' || risk.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'date') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return a.title.localeCompare(b.title);
    });

  return (
    <Layout title="Risk Register" subtitle="Comprehensive view of all identified risks">
      {/* Live Data Banner */}
      {isUsingLiveData && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Database className="w-5 h-5 text-emerald-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Live Risk Data Active — {storeRisks.length} risks loaded from uploaded dataset
            </p>
            {intelligence && (
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                {intelligence.escalatedRisks} escalated • {intelligence.outsideAppetiteRisks} outside appetite •
                Systemic Risk: {intelligence.systemicIndicator.score}/100
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-500">Synced</span>
          </div>
        </div>
      )}

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
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900
                     text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-risk-500/20 focus:border-risk-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300
                     focus:outline-none focus:ring-2 focus:ring-risk-500/20 focus:border-risk-500"
          >
            <option value="all">All Categories</option>
            {availableCategories.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as RiskLevel | 'all')}
            className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300
                     focus:outline-none focus:ring-2 focus:ring-risk-500/20 focus:border-risk-500"
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
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-medium text-slate-700 dark:text-slate-300">{filteredRisks.length}</span> of{' '}
          <span className="font-medium text-slate-700 dark:text-slate-300">{displayRisks.length}</span> risks
          {isUsingLiveData && <span className="ml-2 text-emerald-600 dark:text-emerald-500">(Live Data)</span>}
        </p>
        <button
          onClick={() => setSortBy(sortBy === 'score' ? 'date' : sortBy === 'date' ? 'title' : 'score')}
          className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
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
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Risk
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Score
                </th>
                {isUsingLiveData && (
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Trend
                  </th>
                )}
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredRisks.map((risk) => {
                const CategoryIcon = getCategoryIcon(risk.category);
                return (
                  <tr
                    key={risk.id}
                    className={`transition-all ${
                      risk.isEscalated
                        ? 'bg-risk-50/30 dark:bg-risk-950/20 hover:bg-risk-50/50 dark:hover:bg-risk-950/30 border-l-2 border-l-risk-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    } ${risk.level === 'critical' || risk.level === 'high' ? 'escalated' : ''}`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-md ${risk.isEscalated ? 'bg-risk-100 dark:bg-risk-900/40 text-risk-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900 dark:text-white tracking-tight">{risk.title}</p>
                            {risk.isEscalated && (
                              <span className="risk-badge risk-badge--critical uppercase text-[10px]" style={{ boxShadow: '0 0 6px rgba(220, 38, 38, 0.3)' }}>
                                Escalated
                              </span>
                            )}
                            {risk.appetiteAlignment === 'Outside Appetite' && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded uppercase">
                                Outside Appetite
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md">
                            {risk.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                        {risk.category.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <RiskBadge level={risk.level} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`metric-number--sm font-bold ${
                          risk.score >= 15 ? 'text-risk-600 dark:text-risk-500' :
                          risk.score >= 8 ? 'text-amber-600' :
                          risk.score >= 4 ? 'text-yellow-600' : 'text-olive-600 dark:text-olive-500'
                        }`}
                        style={risk.score >= 15 ? { textShadow: '0 0 8px rgba(220, 38, 38, 0.3)' } : undefined}
                      >
                        {risk.score}
                      </span>
                    </td>
                    {isUsingLiveData && (
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          {risk.riskTrend === 'Deteriorating' ? (
                            <TrendingUp className="w-4 h-4 text-red-500" />
                          ) : risk.riskTrend === 'Improving' ? (
                            <TrendingDown className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Minus className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </td>
                    )}
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded capitalize ${
                        risk.status === 'resolved' ? 'bg-olive-100 dark:bg-olive-900/30 text-olive-700 dark:text-olive-400' :
                        risk.status === 'mitigating' ? 'bg-olive-50 dark:bg-olive-900/20 text-olive-600 dark:text-olive-400' :
                        risk.status === 'assessing' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        risk.status === 'accepted' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                        'bg-risk-100 dark:bg-risk-900/30 text-risk-700 dark:text-risk-400'
                      }`}>
                        {risk.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{risk.owner}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
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
            <Shield className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No risks match your filters</p>
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
