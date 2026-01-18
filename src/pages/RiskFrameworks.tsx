import { useState, useCallback } from 'react';
import { Layout } from '../components/layout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Play,
  RefreshCw,
  Download,
  BarChart3,
  GitBranch,
  AlertTriangle,
  Target,
  Layers,
  Shield,
  CheckCircle2,
  ArrowRight,
  Info,
  Upload,
  Plus,
  Trash2,
  Save,
  Edit3,
  X,
} from 'lucide-react';

// Monte Carlo Simulation Component - FULLY DYNAMIC
function MonteCarloSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(10000);
  const [distribution, setDistribution] = useState('normal');

  // Custom input parameters
  const [minValue, setMinValue] = useState(500000);
  const [maxValue, setMaxValue] = useState(5000000);
  const [mostLikely, setMostLikely] = useState(2000000);
  const [stdDev, setStdDev] = useState(800000);

  const [results, setResults] = useState<{
    mean: number;
    p5: number;
    p50: number;
    p95: number;
    stdDev: number;
    var95: number;
    distribution: number[];
    rawData: number[];
  } | null>(null);

  // Actual Monte Carlo simulation
  const runSimulation = useCallback(() => {
    setIsRunning(true);

    // Run in setTimeout to not block UI
    setTimeout(() => {
      const samples: number[] = [];

      for (let i = 0; i < iterations; i++) {
        let value: number;

        switch (distribution) {
          case 'normal':
            // Box-Muller transform for normal distribution
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            value = mostLikely + z * stdDev;
            break;
          case 'triangular':
            // Triangular distribution
            const u = Math.random();
            const f = (mostLikely - minValue) / (maxValue - minValue);
            if (u < f) {
              value = minValue + Math.sqrt(u * (maxValue - minValue) * (mostLikely - minValue));
            } else {
              value = maxValue - Math.sqrt((1 - u) * (maxValue - minValue) * (maxValue - mostLikely));
            }
            break;
          case 'uniform':
            value = minValue + Math.random() * (maxValue - minValue);
            break;
          case 'lognormal':
            const u3 = Math.random();
            const u4 = Math.random();
            const z2 = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);
            const logMean = Math.log(mostLikely);
            const logStd = stdDev / mostLikely;
            value = Math.exp(logMean + z2 * logStd);
            break;
          default:
            value = mostLikely;
        }

        samples.push(Math.max(0, value));
      }

      // Sort for percentile calculations
      const sorted = [...samples].sort((a, b) => a - b);

      // Calculate statistics
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length;
      const calcStdDev = Math.sqrt(variance);

      const p5Index = Math.floor(samples.length * 0.05);
      const p50Index = Math.floor(samples.length * 0.50);
      const p95Index = Math.floor(samples.length * 0.95);

      // Create histogram (20 bins)
      const binCount = 20;
      const histMin = sorted[0];
      const histMax = sorted[sorted.length - 1];
      const binWidth = (histMax - histMin) / binCount;
      const histogram = Array(binCount).fill(0);

      samples.forEach(val => {
        const bin = Math.min(Math.floor((val - histMin) / binWidth), binCount - 1);
        histogram[bin]++;
      });

      // Normalize histogram to percentages
      const maxBin = Math.max(...histogram);
      const normalizedHist = histogram.map(h => (h / maxBin) * 100);

      setResults({
        mean,
        p5: sorted[p5Index],
        p50: sorted[p50Index],
        p95: sorted[p95Index],
        stdDev: calcStdDev,
        var95: sorted[p95Index] - mean,
        distribution: normalizedHist,
        rawData: sorted,
      });
      setIsRunning(false);
    }, 500);
  }, [iterations, distribution, minValue, maxValue, mostLikely, stdDev]);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">Monte Carlo Simulation</h2>
        <p className="text-white/80">
          Probabilistic risk modeling using random sampling. Enter your parameters below
          to quantify potential risk exposure and understand the range of possible outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Distribution Type
              </label>
              <select
                value={distribution}
                onChange={(e) => setDistribution(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="normal">Normal Distribution</option>
                <option value="lognormal">Log-Normal Distribution</option>
                <option value="triangular">Triangular Distribution</option>
                <option value="uniform">Uniform Distribution</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Minimum ($)
                </label>
                <input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Maximum ($)
                </label>
                <input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Most Likely / Mean ($)
              </label>
              <input
                type="number"
                value={mostLikely}
                onChange={(e) => setMostLikely(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            {(distribution === 'normal' || distribution === 'lognormal') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Standard Deviation ($)
                </label>
                <input
                  type="number"
                  value={stdDev}
                  onChange={(e) => setStdDev(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Iterations: {iterations.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={iterations}
                onChange={(e) => setIterations(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1K</span>
                <span>50K</span>
                <span>100K</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={runSimulation}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Simulating ({iterations.toLocaleString()} iterations)...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Simulation
                  </>
                )}
              </Button>
              {results && (
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4" />
                  Export Results (CSV)
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {results ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Mean (Expected)</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(results.mean)}</p>
                </Card>
                <Card className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">5th Percentile</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(results.p5)}</p>
                </Card>
                <Card className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Median (P50)</p>
                  <p className="text-2xl font-bold text-amber-600">{formatCurrency(results.p50)}</p>
                </Card>
                <Card className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">95th Percentile</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(results.p95)}</p>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Probability Distribution ({iterations.toLocaleString()} samples)</CardTitle>
                </CardHeader>
                <div className="h-64 flex items-end gap-1">
                  {results.distribution.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t transition-all hover:opacity-80 group relative"
                      style={{ height: `${val}%` }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {val.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{formatCurrency(results.rawData[0])}</span>
                  <span>{formatCurrency(results.rawData[Math.floor(results.rawData.length / 2)])}</span>
                  <span>{formatCurrency(results.rawData[results.rawData.length - 1])}</span>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis Summary</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-300">Value at Risk (VaR 95%)</p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        With 95% confidence, the risk exposure will not exceed <strong>{formatCurrency(results.p95)}</strong>.
                        This represents a {formatCurrency(results.var95)} variance from the expected value.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-300">Standard Deviation</p>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        The simulation shows a standard deviation of <strong>{formatCurrency(results.stdDev)}</strong>,
                        indicating {results.stdDev > mostLikely * 0.5 ? 'high' : results.stdDev > mostLikely * 0.25 ? 'moderate' : 'low'} uncertainty in outcomes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-800 dark:text-emerald-300">Recommendation</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">
                        Reserve allocation of <strong>{formatCurrency(results.p95)}</strong> (P95) is recommended
                        to cover potential exposure with 95% confidence.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 mb-2">Configure parameters and run simulation</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Enter min, max, and most likely values, then click "Run Simulation"
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Bow-Tie Analysis Component with editable fields
function BowTieAnalysis() {
  const [selectedRisk, setSelectedRisk] = useState('cybersecurity');
  const [isEditing, setIsEditing] = useState(false);

  const [risks, setRisks] = useState({
    cybersecurity: {
      name: 'Cybersecurity Breach',
      causes: ['Phishing Attack', 'Unpatched Systems', 'Insider Threat', 'Weak Passwords', 'Third-Party Access'],
      preventiveControls: ['Security Awareness Training', 'Patch Management', 'Access Controls', 'MFA Implementation', 'Vendor Assessment'],
      consequences: ['Data Loss', 'Financial Impact', 'Regulatory Fines', 'Reputation Damage', 'Business Disruption'],
      mitigatingControls: ['Incident Response Plan', 'Cyber Insurance', 'Backup Systems', 'PR Crisis Plan', 'BCP Activation'],
    },
    supply: {
      name: 'Supply Chain Disruption',
      causes: ['Supplier Bankruptcy', 'Natural Disaster', 'Geopolitical Issues', 'Quality Failures', 'Transport Disruption'],
      preventiveControls: ['Supplier Diversification', 'Geographic Spread', 'Political Risk Monitor', 'Quality Audits', 'Multi-modal Logistics'],
      consequences: ['Production Halt', 'Revenue Loss', 'Customer Impact', 'Contract Penalties', 'Market Share Loss'],
      mitigatingControls: ['Safety Stock', 'Revenue Hedging', 'Customer Communication', 'Force Majeure Clauses', 'Alternative Products'],
    },
    custom: {
      name: 'Custom Risk Event',
      causes: ['Cause 1', 'Cause 2', 'Cause 3'],
      preventiveControls: ['Control 1', 'Control 2', 'Control 3'],
      consequences: ['Consequence 1', 'Consequence 2', 'Consequence 3'],
      mitigatingControls: ['Mitigation 1', 'Mitigation 2', 'Mitigation 3'],
    },
  });

  const risk = risks[selectedRisk as keyof typeof risks];

  const updateRiskField = (field: 'causes' | 'preventiveControls' | 'consequences' | 'mitigatingControls', index: number, value: string) => {
    setRisks(prev => ({
      ...prev,
      [selectedRisk]: {
        ...prev[selectedRisk as keyof typeof prev],
        [field]: (prev[selectedRisk as keyof typeof prev][field] as string[]).map((item: string, i: number) =>
          i === index ? value : item
        ),
      },
    }));
  };

  const addItem = (field: 'causes' | 'preventiveControls' | 'consequences' | 'mitigatingControls') => {
    setRisks(prev => ({
      ...prev,
      [selectedRisk]: {
        ...prev[selectedRisk as keyof typeof prev],
        [field]: [...(prev[selectedRisk as keyof typeof prev][field] as string[]), 'New Item'],
      },
    }));
  };

  const removeItem = (field: 'causes' | 'preventiveControls' | 'consequences' | 'mitigatingControls', index: number) => {
    setRisks(prev => ({
      ...prev,
      [selectedRisk]: {
        ...prev[selectedRisk as keyof typeof prev],
        [field]: (prev[selectedRisk as keyof typeof prev][field] as string[]).filter((_: string, i: number) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">Bow-Tie Analysis</h2>
        <p className="text-white/80">
          Visual representation of risk pathways. Click "Edit" to customize causes, controls, and consequences.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {Object.entries(risks).map(([key, r]) => (
            <Button
              key={key}
              variant={selectedRisk === key ? 'primary' : 'secondary'}
              onClick={() => setSelectedRisk(key)}
              size="sm"
            >
              {r.name}
            </Button>
          ))}
        </div>
        <Button
          variant={isEditing ? 'primary' : 'secondary'}
          onClick={() => setIsEditing(!isEditing)}
          size="sm"
        >
          {isEditing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
        </Button>
      </div>

      {/* Bow-Tie Diagram */}
      <Card padding="lg">
        <div className="grid grid-cols-5 gap-4 items-start">
          {/* Causes */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center mb-3">CAUSES</h4>
            {risk.causes.map((cause, idx) => (
              <div key={idx} className="relative">
                {isEditing ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={cause}
                      onChange={(e) => updateRiskField('causes', idx, e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs border-none"
                    />
                    <button onClick={() => removeItem('causes', idx)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs text-center">
                    {cause}
                  </div>
                )}
              </div>
            ))}
            {isEditing && (
              <button onClick={() => addItem('causes')} className="w-full p-2 rounded-lg border-2 border-dashed border-red-300 text-red-500 text-xs hover:bg-red-50">
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            )}
          </div>

          {/* Preventive Controls */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center mb-3">PREVENTIVE</h4>
            {risk.preventiveControls.map((control, idx) => (
              <div key={idx} className="relative">
                {isEditing ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={control}
                      onChange={(e) => updateRiskField('preventiveControls', idx, e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs border-none"
                    />
                    <button onClick={() => removeItem('preventiveControls', idx)} className="text-blue-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs text-center flex items-center gap-1 justify-center">
                    <Shield className="w-3 h-3" />
                    {control}
                  </div>
                )}
              </div>
            ))}
            {isEditing && (
              <button onClick={() => addItem('preventiveControls')} className="w-full p-2 rounded-lg border-2 border-dashed border-blue-300 text-blue-500 text-xs hover:bg-blue-50">
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            )}
          </div>

          {/* Risk Event (Center) */}
          <div className="flex items-center justify-center pt-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center shadow-lg">
              <div className="text-center text-white p-2">
                <AlertTriangle className="w-8 h-8 mx-auto mb-1" />
                {isEditing ? (
                  <input
                    type="text"
                    value={risk.name}
                    onChange={(e) => setRisks(prev => ({
                      ...prev,
                      [selectedRisk]: { ...prev[selectedRisk as keyof typeof prev], name: e.target.value }
                    }))}
                    className="text-xs font-bold bg-transparent border-b border-white/50 text-center w-full"
                  />
                ) : (
                  <span className="text-xs font-bold">{risk.name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Mitigating Controls */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center mb-3">MITIGATING</h4>
            {risk.mitigatingControls.map((control, idx) => (
              <div key={idx} className="relative">
                {isEditing ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={control}
                      onChange={(e) => updateRiskField('mitigatingControls', idx, e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs border-none"
                    />
                    <button onClick={() => removeItem('mitigatingControls', idx)} className="text-emerald-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs text-center flex items-center gap-1 justify-center">
                    <CheckCircle2 className="w-3 h-3" />
                    {control}
                  </div>
                )}
              </div>
            ))}
            {isEditing && (
              <button onClick={() => addItem('mitigatingControls')} className="w-full p-2 rounded-lg border-2 border-dashed border-emerald-300 text-emerald-500 text-xs hover:bg-emerald-50">
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            )}
          </div>

          {/* Consequences */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center mb-3">CONSEQUENCES</h4>
            {risk.consequences.map((consequence, idx) => (
              <div key={idx} className="relative">
                {isEditing ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={consequence}
                      onChange={(e) => updateRiskField('consequences', idx, e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs border-none"
                    />
                    <button onClick={() => removeItem('consequences', idx)} className="text-orange-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs text-center">
                    {consequence}
                  </div>
                )}
              </div>
            ))}
            {isEditing && (
              <button onClick={() => addItem('consequences')} className="w-full p-2 rounded-lg border-2 border-dashed border-orange-300 text-orange-500 text-xs hover:bg-orange-50">
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            )}
          </div>
        </div>

        {/* Arrows */}
        <div className="flex justify-center gap-4 mt-6 text-slate-400">
          <ArrowRight className="w-6 h-6" />
          <ArrowRight className="w-6 h-6" />
          <span className="font-bold">RISK EVENT</span>
          <ArrowRight className="w-6 h-6" />
          <ArrowRight className="w-6 h-6" />
        </div>
      </Card>

      <div className="flex gap-4">
        <Button variant="primary">
          <Download className="w-4 h-4" />
          Export Diagram
        </Button>
        <Button variant="secondary">
          <Upload className="w-4 h-4" />
          Import Data
        </Button>
      </div>
    </div>
  );
}

// FMEA Component with editable table
function FMEAAnalysis() {
  const [fmeaData, setFmeaData] = useState([
    { id: 1, process: 'User Authentication', failureMode: 'Credential Theft', effect: 'Unauthorized Access', severity: 9, occurrence: 4, detection: 3, action: 'Implement MFA', owner: 'IT Security' },
    { id: 2, process: 'Data Backup', failureMode: 'Backup Failure', effect: 'Data Loss', severity: 10, occurrence: 2, detection: 2, action: 'Redundant backup systems', owner: 'IT Ops' },
    { id: 3, process: 'Payment Processing', failureMode: 'Transaction Error', effect: 'Financial Loss', severity: 8, occurrence: 3, detection: 4, action: 'Enhanced validation', owner: 'Finance' },
    { id: 4, process: 'Vendor Onboarding', failureMode: 'Incomplete Due Diligence', effect: 'Compliance Violation', severity: 7, occurrence: 5, detection: 5, action: 'Automated screening', owner: 'Procurement' },
    { id: 5, process: 'Software Deployment', failureMode: 'Untested Code', effect: 'System Outage', severity: 8, occurrence: 4, detection: 3, action: 'CI/CD pipeline', owner: 'DevOps' },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const getRPNColor = (rpn: number) => {
    if (rpn >= 150) return 'bg-red-500 text-white';
    if (rpn >= 100) return 'bg-amber-500 text-white';
    if (rpn >= 50) return 'bg-yellow-500 text-slate-900';
    return 'bg-emerald-500 text-white';
  };

  const updateRow = (id: number, field: string, value: string | number) => {
    setFmeaData(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addRow = () => {
    const newId = Math.max(...fmeaData.map(d => d.id)) + 1;
    setFmeaData(prev => [...prev, {
      id: newId,
      process: 'New Process',
      failureMode: 'Failure Mode',
      effect: 'Effect',
      severity: 5,
      occurrence: 5,
      detection: 5,
      action: 'Action Required',
      owner: 'Assign Owner',
    }]);
    setEditingId(newId);
  };

  const deleteRow = (id: number) => {
    setFmeaData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">FMEA - Failure Mode & Effects Analysis</h2>
        <p className="text-white/80">
          Systematic approach to identify potential failure modes. Click on any row to edit values.
          RPN = Severity × Occurrence × Detection (1-10 scale each).
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="primary" size="sm" onClick={addRow}>
          <Plus className="w-4 h-4" />
          Add Failure Mode
        </Button>
        <Button variant="secondary" size="sm">
          <Upload className="w-4 h-4" />
          Import CSV
        </Button>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Process</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Failure Mode</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Effect</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-16">S</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-16">O</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-16">D</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-20">RPN</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Action</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Owner</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {fmeaData.sort((a, b) => (b.severity * b.occurrence * b.detection) - (a.severity * a.occurrence * a.detection)).map((item) => {
                const rpn = item.severity * item.occurrence * item.detection;
                const isEditing = editingId === item.id;
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${isEditing ? 'bg-lumina-50 dark:bg-lumina-900/20' : ''}`}
                    onClick={() => setEditingId(isEditing ? null : item.id)}
                  >
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.process}
                          onChange={(e) => updateRow(item.id, 'process', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-1 rounded border border-lumina-300 text-sm"
                        />
                      ) : (
                        <span className="font-medium text-slate-900 dark:text-white">{item.process}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.failureMode}
                          onChange={(e) => updateRow(item.id, 'failureMode', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-1 rounded border border-lumina-300 text-sm"
                        />
                      ) : (
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.failureMode}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.effect}
                          onChange={(e) => updateRow(item.id, 'effect', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-1 rounded border border-lumina-300 text-sm"
                        />
                      ) : (
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.effect}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.severity}
                          onChange={(e) => updateRow(item.id, 'severity', parseInt(e.target.value) || 1)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 px-1 py-1 rounded border border-lumina-300 text-sm text-center"
                        />
                      ) : (
                        <span className="text-sm font-medium">{item.severity}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.occurrence}
                          onChange={(e) => updateRow(item.id, 'occurrence', parseInt(e.target.value) || 1)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 px-1 py-1 rounded border border-lumina-300 text-sm text-center"
                        />
                      ) : (
                        <span className="text-sm font-medium">{item.occurrence}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.detection}
                          onChange={(e) => updateRow(item.id, 'detection', parseInt(e.target.value) || 1)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 px-1 py-1 rounded border border-lumina-300 text-sm text-center"
                        />
                      ) : (
                        <span className="text-sm font-medium">{item.detection}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRPNColor(rpn)}`}>
                        {rpn}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.action}
                          onChange={(e) => updateRow(item.id, 'action', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-1 rounded border border-lumina-300 text-sm"
                        />
                      ) : (
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.action}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.owner}
                          onChange={(e) => updateRow(item.id, 'owner', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-1 rounded border border-lumina-300 text-sm"
                        />
                      ) : (
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.owner}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteRow(item.id); }}
                        className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center bg-red-50 dark:bg-red-900/30">
          <p className="text-sm text-red-600 dark:text-red-400">Critical (RPN ≥ 150)</p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300">{fmeaData.filter(d => d.severity * d.occurrence * d.detection >= 150).length}</p>
        </Card>
        <Card className="text-center bg-amber-50 dark:bg-amber-900/30">
          <p className="text-sm text-amber-600 dark:text-amber-400">High (100-149)</p>
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{fmeaData.filter(d => { const rpn = d.severity * d.occurrence * d.detection; return rpn >= 100 && rpn < 150; }).length}</p>
        </Card>
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/30">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Medium (50-99)</p>
          <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{fmeaData.filter(d => { const rpn = d.severity * d.occurrence * d.detection; return rpn >= 50 && rpn < 100; }).length}</p>
        </Card>
        <Card className="text-center bg-emerald-50 dark:bg-emerald-900/30">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">Low (&lt; 50)</p>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{fmeaData.filter(d => d.severity * d.occurrence * d.detection < 50).length}</p>
        </Card>
      </div>
    </div>
  );
}

// Scenario Analysis - Editable
function ScenarioAnalysis() {
  const [scenarios, setScenarios] = useState([
    { id: 1, name: 'Best Case', color: 'emerald', probability: 15, impact: 5200000, description: 'Economic recovery, increased demand, successful cost optimization', revenue: 12, costs: -8, risk: 'Low' },
    { id: 2, name: 'Base Case', color: 'blue', probability: 60, impact: 1800000, description: 'Moderate growth, stable operations, planned investments executed', revenue: 5, costs: 2, risk: 'Medium' },
    { id: 3, name: 'Stress Case', color: 'amber', probability: 20, impact: -2100000, description: 'Economic slowdown, supply chain issues, increased competition', revenue: -3, costs: 8, risk: 'High' },
    { id: 4, name: 'Worst Case', color: 'red', probability: 5, impact: -8500000, description: 'Major disruption, regulatory changes, cyber incident', revenue: -15, costs: 20, risk: 'Critical' },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const expectedValue = scenarios.reduce((sum, s) => sum + (s.probability / 100) * s.impact, 0);

  const formatCurrency = (val: number) => {
    const absVal = Math.abs(val);
    const formatted = absVal >= 1000000 ? `$${(absVal / 1000000).toFixed(1)}M` : `$${(absVal / 1000).toFixed(0)}K`;
    return val >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">Scenario Analysis</h2>
        <p className="text-white/80 mb-4">
          Explore different scenarios and their impacts. Click any card to edit values.
        </p>
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-white/60">Expected Value</p>
            <p className="text-2xl font-bold">{formatCurrency(expectedValue)}</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Total Probability</p>
            <p className="text-2xl font-bold">{scenarios.reduce((sum, s) => sum + s.probability, 0)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => {
          const isEditing = editingId === scenario.id;
          return (
            <Card
              key={scenario.id}
              padding="none"
              className={`overflow-hidden cursor-pointer ${isEditing ? 'ring-2 ring-lumina-500' : ''}`}
              onClick={() => setEditingId(isEditing ? null : scenario.id)}
            >
              <div className={`p-4 bg-${scenario.color}-500 text-white`}>
                <div className="flex items-center justify-between">
                  {isEditing ? (
                    <input
                      type="text"
                      value={scenario.name}
                      onChange={(e) => setScenarios(prev => prev.map(s => s.id === scenario.id ? { ...s, name: e.target.value } : s))}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent border-b border-white/50 text-lg font-semibold"
                    />
                  ) : (
                    <h3 className="font-semibold text-lg">{scenario.name}</h3>
                  )}
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="number"
                        value={scenario.probability}
                        onChange={(e) => setScenarios(prev => prev.map(s => s.id === scenario.id ? { ...s, probability: parseInt(e.target.value) || 0 } : s))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 bg-transparent border-b border-white/50 text-center"
                      />
                    ) : (
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{scenario.probability}%</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-5">
                {isEditing ? (
                  <textarea
                    value={scenario.description}
                    onChange={(e) => setScenarios(prev => prev.map(s => s.id === scenario.id ? { ...s, description: e.target.value } : s))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-sm text-slate-600 dark:text-slate-400 mb-4 p-2 border rounded"
                    rows={2}
                  />
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{scenario.description}</p>
                )}

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Revenue</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={scenario.revenue}
                        onChange={(e) => setScenarios(prev => prev.map(s => s.id === scenario.id ? { ...s, revenue: parseInt(e.target.value) || 0 } : s))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 text-center font-bold border-b"
                      />
                    ) : (
                      <p className={`font-bold ${scenario.revenue >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {scenario.revenue >= 0 ? '+' : ''}{scenario.revenue}%
                      </p>
                    )}
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Costs</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={scenario.costs}
                        onChange={(e) => setScenarios(prev => prev.map(s => s.id === scenario.id ? { ...s, costs: parseInt(e.target.value) || 0 } : s))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 text-center font-bold border-b"
                      />
                    ) : (
                      <p className={`font-bold ${scenario.costs <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {scenario.costs >= 0 ? '+' : ''}{scenario.costs}%
                      </p>
                    )}
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Risk Level</p>
                    <p className="font-bold text-slate-900 dark:text-white">{scenario.risk}</p>
                  </div>
                </div>

                <div className={`text-center p-3 rounded-lg bg-${scenario.color}-50 dark:bg-${scenario.color}-900/30`}>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Financial Impact</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={scenario.impact}
                      onChange={(e) => setScenarios(prev => prev.map(s => s.id === scenario.id ? { ...s, impact: parseInt(e.target.value) || 0 } : s))}
                      onClick={(e) => e.stopPropagation()}
                      className="text-2xl font-bold text-center border-b"
                    />
                  ) : (
                    <p className={`text-2xl font-bold text-${scenario.color}-600 dark:text-${scenario.color}-400`}>
                      {formatCurrency(scenario.impact)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Risk Assessment Matrix - Interactive
function RiskAssessmentMatrix() {
  const [selectedCell, setSelectedCell] = useState<{ likelihood: number; impact: number } | null>(null);
  const [risks, setRisks] = useState<{ [key: string]: string[] }>({
    '5-5': ['Critical Cyber Breach'],
    '4-4': ['Major Supplier Failure'],
    '3-3': ['Regulatory Change'],
    '2-2': ['Minor IT Outage'],
  });

  const [newRisk, setNewRisk] = useState('');

  const addRiskToCell = () => {
    if (!selectedCell || !newRisk.trim()) return;
    const key = `${selectedCell.likelihood}-${selectedCell.impact}`;
    setRisks(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newRisk.trim()],
    }));
    setNewRisk('');
  };

  const removeRisk = (key: string, index: number) => {
    setRisks(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">Risk Assessment Matrix</h2>
        <p className="text-white/80">
          Interactive 5x5 risk matrix. Click on any cell to add or view risks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2 w-24"></th>
                    <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Negligible<br/><span className="text-xs text-slate-400">1</span></th>
                    <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Minor<br/><span className="text-xs text-slate-400">2</span></th>
                    <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Moderate<br/><span className="text-xs text-slate-400">3</span></th>
                    <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Major<br/><span className="text-xs text-slate-400">4</span></th>
                    <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Catastrophic<br/><span className="text-xs text-slate-400">5</span></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Almost Certain', value: 5 },
                    { label: 'Likely', value: 4 },
                    { label: 'Possible', value: 3 },
                    { label: 'Unlikely', value: 2 },
                    { label: 'Rare', value: 1 },
                  ].map((likelihood) => (
                    <tr key={likelihood.value}>
                      <td className="p-2 text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {likelihood.label}<br/><span className="text-xs text-slate-400">{likelihood.value}</span>
                      </td>
                      {[1, 2, 3, 4, 5].map((impact) => {
                        const score = likelihood.value * impact;
                        const key = `${likelihood.value}-${impact}`;
                        const cellRisks = risks[key] || [];
                        const isSelected = selectedCell?.likelihood === likelihood.value && selectedCell?.impact === impact;

                        let bgColor = 'bg-emerald-200 dark:bg-emerald-800 hover:bg-emerald-300';
                        if (score >= 15) bgColor = 'bg-red-400 dark:bg-red-700 hover:bg-red-500';
                        else if (score >= 10) bgColor = 'bg-orange-300 dark:bg-orange-700 hover:bg-orange-400';
                        else if (score >= 5) bgColor = 'bg-yellow-200 dark:bg-yellow-700 hover:bg-yellow-300';

                        return (
                          <td key={impact} className="p-1">
                            <div
                              onClick={() => setSelectedCell({ likelihood: likelihood.value, impact })}
                              className={`${bgColor} min-h-[80px] rounded-lg p-2 cursor-pointer transition-all ${
                                isSelected ? 'ring-2 ring-lumina-500 ring-offset-2' : ''
                              }`}
                            >
                              <div className="text-xs font-bold text-slate-700 dark:text-white mb-1 text-center">{score}</div>
                              {cellRisks.length > 0 && (
                                <div className="space-y-1">
                                  {cellRisks.slice(0, 2).map((risk, i) => (
                                    <div key={i} className="text-[10px] bg-white/50 dark:bg-black/20 rounded px-1 py-0.5 truncate">
                                      {risk}
                                    </div>
                                  ))}
                                  {cellRisks.length > 2 && (
                                    <div className="text-[10px] text-center">+{cellRisks.length - 2} more</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Selected Cell Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCell
                  ? `Cell (${selectedCell.likelihood}, ${selectedCell.impact}) - Score: ${selectedCell.likelihood * selectedCell.impact}`
                  : 'Select a Cell'}
              </CardTitle>
            </CardHeader>
            {selectedCell ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    Likelihood: {['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'][selectedCell.likelihood - 1]}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Impact: {['Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic'][selectedCell.impact - 1]}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Add Risk to Cell
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRisk}
                      onChange={(e) => setNewRisk(e.target.value)}
                      placeholder="Risk name..."
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && addRiskToCell()}
                    />
                    <Button variant="primary" size="sm" onClick={addRiskToCell}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Risks in this cell
                  </p>
                  <div className="space-y-2">
                    {(risks[`${selectedCell.likelihood}-${selectedCell.impact}`] || []).map((risk, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <span className="text-sm">{risk}</span>
                        <button
                          onClick={() => removeRisk(`${selectedCell.likelihood}-${selectedCell.impact}`, idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(risks[`${selectedCell.likelihood}-${selectedCell.impact}`] || []).length === 0 && (
                      <p className="text-sm text-slate-400 italic">No risks added</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">Click on a matrix cell to add or view risks</p>
            )}
          </Card>
        </div>
      </div>

      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-200 dark:bg-emerald-800" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Low (1-4)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-700" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Medium (5-9)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-300 dark:bg-orange-700" />
          <span className="text-sm text-slate-600 dark:text-slate-400">High (10-14)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-400 dark:bg-red-700" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Critical (15-25)</span>
        </div>
      </div>
    </div>
  );
}

// Main Component with Tabs
type FrameworkTab = 'montecarlo' | 'bowtie' | 'fmea' | 'scenario' | 'matrix';

const frameworks = [
  { id: 'montecarlo' as const, name: 'Monte Carlo', icon: BarChart3, description: 'Probabilistic simulation' },
  { id: 'bowtie' as const, name: 'Bow-Tie', icon: GitBranch, description: 'Cause-effect analysis' },
  { id: 'fmea' as const, name: 'FMEA', icon: AlertTriangle, description: 'Failure mode analysis' },
  { id: 'scenario' as const, name: 'Scenario', icon: Layers, description: 'What-if scenarios' },
  { id: 'matrix' as const, name: 'Risk Matrix', icon: Target, description: '5x5 assessment' },
];

export function RiskFrameworks() {
  const [activeFramework, setActiveFramework] = useState<FrameworkTab>('montecarlo');

  return (
    <Layout title="Risk Frameworks" subtitle="Interactive risk analysis tools and methodologies">
      {/* Framework Selector */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {frameworks.map((framework) => {
          const Icon = framework.icon;
          const isActive = activeFramework === framework.id;
          return (
            <button
              key={framework.id}
              onClick={() => setActiveFramework(framework.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-lumina-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-lumina-600 dark:text-lumina-400'}`} />
              <p className={`font-semibold ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {framework.name}
              </p>
              <p className={`text-xs ${isActive ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                {framework.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Framework Content */}
      {activeFramework === 'montecarlo' && <MonteCarloSimulation />}
      {activeFramework === 'bowtie' && <BowTieAnalysis />}
      {activeFramework === 'fmea' && <FMEAAnalysis />}
      {activeFramework === 'scenario' && <ScenarioAnalysis />}
      {activeFramework === 'matrix' && <RiskAssessmentMatrix />}
    </Layout>
  );
}
