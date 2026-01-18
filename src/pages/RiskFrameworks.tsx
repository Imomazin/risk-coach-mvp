import { useState } from 'react';
import { Layout } from '../components/layout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Play,
  RefreshCw,
  Download,
  Settings,
  BarChart3,
  GitBranch,
  AlertTriangle,
  Target,
  Layers,
  Shield,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';

// Monte Carlo Simulation Component
function MonteCarloSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(10000);
  const [results, setResults] = useState<{
    mean: number;
    p5: number;
    p50: number;
    p95: number;
    distribution: number[];
  } | null>(null);

  const runSimulation = () => {
    setIsRunning(true);
    // Simulate Monte Carlo
    setTimeout(() => {
      const dist = Array.from({ length: 20 }, () => Math.random() * 100);
      setResults({
        mean: 2450000,
        p5: 1200000,
        p50: 2300000,
        p95: 4100000,
        distribution: dist,
      });
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">Monte Carlo Simulation</h2>
        <p className="text-white/80">
          Probabilistic risk modeling using random sampling to understand the range of possible outcomes
          and their likelihood. Ideal for financial risk, project risk, and operational risk quantification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Number of Iterations
              </label>
              <select
                value={iterations}
                onChange={(e) => setIterations(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value={1000}>1,000</option>
                <option value={10000}>10,000</option>
                <option value={50000}>50,000</option>
                <option value={100000}>100,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Risk Distribution Type
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option>Normal Distribution</option>
                <option>Log-Normal Distribution</option>
                <option>Triangular Distribution</option>
                <option>PERT Distribution</option>
                <option>Uniform Distribution</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confidence Level
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option>90%</option>
                <option>95%</option>
                <option>99%</option>
              </select>
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
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Simulation
                  </>
                )}
              </Button>
              <Button variant="secondary" className="w-full">
                <Download className="w-4 h-4" />
                Export Results
              </Button>
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
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">${(results.mean / 1000000).toFixed(2)}M</p>
                </Card>
                <Card className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">5th Percentile</p>
                  <p className="text-2xl font-bold text-emerald-600">${(results.p5 / 1000000).toFixed(2)}M</p>
                </Card>
                <Card className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Median (P50)</p>
                  <p className="text-2xl font-bold text-amber-600">${(results.p50 / 1000000).toFixed(2)}M</p>
                </Card>
                <Card className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">95th Percentile</p>
                  <p className="text-2xl font-bold text-red-600">${(results.p95 / 1000000).toFixed(2)}M</p>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Probability Distribution</CardTitle>
                </CardHeader>
                <div className="h-64 flex items-end gap-1">
                  {results.distribution.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>$0</span>
                  <span>$2.5M</span>
                  <span>$5M+</span>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Insights</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-300">High Variance Detected</p>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        The range between P5 and P95 is $2.9M, indicating significant uncertainty.
                        Consider additional risk mitigation measures.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-300">Recommendation</p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Based on the simulation, allocate reserves of at least $4.1M (P95)
                        to cover potential risk exposure with 95% confidence.
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
                <p className="text-slate-500 dark:text-slate-400">Configure parameters and run simulation to see results</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Bow-Tie Analysis Component
function BowTieAnalysis() {
  const [selectedRisk, setSelectedRisk] = useState('cybersecurity');

  const risks = {
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
  };

  const risk = risks[selectedRisk as keyof typeof risks];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">Bow-Tie Analysis</h2>
        <p className="text-white/80">
          Visual representation of risk pathways showing causes, preventive controls, the risk event,
          consequences, and mitigating controls. Essential for understanding and managing complex risks.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant={selectedRisk === 'cybersecurity' ? 'primary' : 'secondary'}
          onClick={() => setSelectedRisk('cybersecurity')}
        >
          Cybersecurity Breach
        </Button>
        <Button
          variant={selectedRisk === 'supply' ? 'primary' : 'secondary'}
          onClick={() => setSelectedRisk('supply')}
        >
          Supply Chain Disruption
        </Button>
      </div>

      {/* Bow-Tie Diagram */}
      <Card padding="lg">
        <div className="grid grid-cols-5 gap-4 items-center">
          {/* Causes */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center mb-3">CAUSES</h4>
            {risk.causes.map((cause, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs text-center">
                {cause}
              </div>
            ))}
          </div>

          {/* Preventive Controls */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center mb-3">PREVENTIVE</h4>
            {risk.preventiveControls.map((control, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs text-center flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {control}
              </div>
            ))}
          </div>

          {/* Risk Event (Center) */}
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center shadow-lg">
              <div className="text-center text-white p-2">
                <AlertTriangle className="w-8 h-8 mx-auto mb-1" />
                <span className="text-xs font-bold">{risk.name}</span>
              </div>
            </div>
          </div>

          {/* Mitigating Controls */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center mb-3">MITIGATING</h4>
            {risk.mitigatingControls.map((control, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs text-center flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {control}
              </div>
            ))}
          </div>

          {/* Consequences */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center mb-3">CONSEQUENCES</h4>
            {risk.consequences.map((consequence, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs text-center">
                {consequence}
              </div>
            ))}
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
          <Settings className="w-4 h-4" />
          Edit Analysis
        </Button>
      </div>
    </div>
  );
}

// FMEA Component
function FMEAAnalysis() {
  const [fmeaData] = useState([
    { id: 1, process: 'User Authentication', failureMode: 'Credential Theft', effect: 'Unauthorized Access', severity: 9, occurrence: 4, detection: 3, rpn: 108, action: 'Implement MFA', owner: 'IT Security' },
    { id: 2, process: 'Data Backup', failureMode: 'Backup Failure', effect: 'Data Loss', severity: 10, occurrence: 2, detection: 2, rpn: 40, action: 'Redundant backup systems', owner: 'IT Ops' },
    { id: 3, process: 'Payment Processing', failureMode: 'Transaction Error', effect: 'Financial Loss', severity: 8, occurrence: 3, detection: 4, rpn: 96, action: 'Enhanced validation', owner: 'Finance' },
    { id: 4, process: 'Vendor Onboarding', failureMode: 'Incomplete Due Diligence', effect: 'Compliance Violation', severity: 7, occurrence: 5, detection: 5, rpn: 175, action: 'Automated screening', owner: 'Procurement' },
    { id: 5, process: 'Software Deployment', failureMode: 'Untested Code', effect: 'System Outage', severity: 8, occurrence: 4, detection: 3, rpn: 96, action: 'CI/CD pipeline', owner: 'DevOps' },
  ]);

  const getRPNColor = (rpn: number) => {
    if (rpn >= 150) return 'bg-red-500 text-white';
    if (rpn >= 100) return 'bg-amber-500 text-white';
    if (rpn >= 50) return 'bg-yellow-500 text-slate-900';
    return 'bg-emerald-500 text-white';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">FMEA - Failure Mode & Effects Analysis</h2>
        <p className="text-white/80">
          Systematic approach to identify potential failure modes, their causes and effects,
          and prioritize actions based on Risk Priority Number (RPN = Severity × Occurrence × Detection).
        </p>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Process</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Failure Mode</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Effect</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">S</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">O</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">D</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">RPN</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Action</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {fmeaData.sort((a, b) => b.rpn - a.rpn).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{item.process}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{item.failureMode}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{item.effect}</td>
                  <td className="py-3 px-4 text-center text-sm font-medium">{item.severity}</td>
                  <td className="py-3 px-4 text-center text-sm font-medium">{item.occurrence}</td>
                  <td className="py-3 px-4 text-center text-sm font-medium">{item.detection}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRPNColor(item.rpn)}`}>
                      {item.rpn}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{item.action}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{item.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center bg-red-50 dark:bg-red-900/30">
          <p className="text-sm text-red-600 dark:text-red-400">Critical (RPN ≥ 150)</p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300">{fmeaData.filter(d => d.rpn >= 150).length}</p>
        </Card>
        <Card className="text-center bg-amber-50 dark:bg-amber-900/30">
          <p className="text-sm text-amber-600 dark:text-amber-400">High (100-149)</p>
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{fmeaData.filter(d => d.rpn >= 100 && d.rpn < 150).length}</p>
        </Card>
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/30">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Medium (50-99)</p>
          <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{fmeaData.filter(d => d.rpn >= 50 && d.rpn < 100).length}</p>
        </Card>
        <Card className="text-center bg-emerald-50 dark:bg-emerald-900/30">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">Low (&lt; 50)</p>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{fmeaData.filter(d => d.rpn < 50).length}</p>
        </Card>
      </div>
    </div>
  );
}

// Scenario Analysis Component
function ScenarioAnalysis() {
  const scenarios = [
    {
      name: 'Best Case',
      color: 'emerald',
      probability: '15%',
      impact: '+$5.2M',
      description: 'Economic recovery, increased demand, successful cost optimization',
      metrics: { revenue: '+12%', costs: '-8%', risk: 'Low' },
    },
    {
      name: 'Base Case',
      color: 'blue',
      probability: '60%',
      impact: '+$1.8M',
      description: 'Moderate growth, stable operations, planned investments executed',
      metrics: { revenue: '+5%', costs: '+2%', risk: 'Medium' },
    },
    {
      name: 'Stress Case',
      color: 'amber',
      probability: '20%',
      impact: '-$2.1M',
      description: 'Economic slowdown, supply chain issues, increased competition',
      metrics: { revenue: '-3%', costs: '+8%', risk: 'High' },
    },
    {
      name: 'Worst Case',
      color: 'red',
      probability: '5%',
      impact: '-$8.5M',
      description: 'Major disruption, regulatory changes, cyber incident',
      metrics: { revenue: '-15%', costs: '+20%', risk: 'Critical' },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">Scenario Analysis</h2>
        <p className="text-white/80">
          Explore different future scenarios and their potential impacts on your organization.
          Plan for various outcomes and develop appropriate response strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <Card key={scenario.name} padding="none" className="overflow-hidden">
            <div className={`p-4 bg-${scenario.color}-500 text-white`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{scenario.name}</h3>
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{scenario.probability} probability</span>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{scenario.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Revenue</p>
                  <p className={`font-bold ${scenario.metrics.revenue.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {scenario.metrics.revenue}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Costs</p>
                  <p className={`font-bold ${scenario.metrics.costs.startsWith('-') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {scenario.metrics.costs}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Risk Level</p>
                  <p className="font-bold text-slate-900 dark:text-white">{scenario.metrics.risk}</p>
                </div>
              </div>

              <div className={`text-center p-3 rounded-lg bg-${scenario.color}-50 dark:bg-${scenario.color}-900/30`}>
                <p className="text-sm text-slate-500 dark:text-slate-400">Financial Impact</p>
                <p className={`text-2xl font-bold text-${scenario.color}-600 dark:text-${scenario.color}-400`}>
                  {scenario.impact}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Risk Assessment Matrix Component
function RiskAssessmentMatrix() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-2">Risk Assessment Matrix</h2>
        <p className="text-white/80">
          5x5 risk assessment matrix for evaluating and prioritizing risks based on
          likelihood and impact. Click on cells to view or add risks.
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2"></th>
                <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Negligible</th>
                <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Minor</th>
                <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Moderate</th>
                <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Major</th>
                <th className="p-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">Catastrophic</th>
              </tr>
            </thead>
            <tbody>
              {['Almost Certain', 'Likely', 'Possible', 'Unlikely', 'Rare'].map((likelihood, lIdx) => (
                <tr key={likelihood}>
                  <td className="p-2 text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{likelihood}</td>
                  {[1, 2, 3, 4, 5].map((impact) => {
                    const score = (5 - lIdx) * impact;
                    let bgColor = 'bg-emerald-200 dark:bg-emerald-800';
                    if (score >= 15) bgColor = 'bg-red-400 dark:bg-red-700';
                    else if (score >= 10) bgColor = 'bg-orange-300 dark:bg-orange-700';
                    else if (score >= 5) bgColor = 'bg-yellow-200 dark:bg-yellow-700';

                    return (
                      <td key={impact} className="p-1">
                        <div className={`${bgColor} h-16 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}>
                          <span className="text-xs font-bold text-slate-700 dark:text-white">{score}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
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
      </Card>
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
    <Layout title="Risk Frameworks" subtitle="Professional risk analysis tools and methodologies">
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
