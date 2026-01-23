import { useMemo, useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Layout } from '../components/layout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRiskIntelligence } from '../stores/RiskIntelligenceStore';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  Target,
  Eye,
  EyeOff,
  Zap,
  Clock,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Gauge,
  Shield,
  Download,
  RefreshCw,
  Info,
  ChevronRight,
  Signal,
  Radio,
  Radar,
  Upload,
  FileSpreadsheet,
  Sparkles,
  X,
  Table,
} from 'lucide-react';

// Indicator classification types
type IndicatorType = 'leading' | 'lagging' | 'structural';
type SignalStrength = 'strong' | 'moderate' | 'weak' | 'noise';

interface EnhancedIndicator {
  id: string | number;
  riskId: string | number;
  riskCategory: string;
  indicator: string;
  currentValue: number;
  threshold: number;
  trend: 'Up' | 'Down' | 'Stable';
  status: 'Green' | 'Amber' | 'Red';
  breachPercentage: number;
  // Enhanced fields
  indicatorType: IndicatorType;
  signalStrength: SignalStrength;
  volatility: 'low' | 'medium' | 'high';
  correlationScore: number;
  lastTriggeredEscalation: boolean;
  daysInCurrentStatus: number;
}

interface CoverageAnalysis {
  riskId: string | number;
  riskCategory: string;
  riskDescription: string;
  indicatorCount: number;
  coverageStatus: 'over-instrumented' | 'adequate' | 'under-instrumented' | 'blind';
  hasLeadingIndicator: boolean;
  recommendation: string;
}

// Parse CSV to array of objects
function parseCSV(csvText: string): { data: Record<string, unknown>[]; columns: string[] } {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { data: [], columns: [] };

  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
  const data: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, unknown> = {};
    headers.forEach((header, idx) => {
      const value = values[idx] || '';
      const num = parseFloat(value);
      row[header] = !isNaN(num) && value !== '' ? num : value;
    });
    data.push(row);
  }

  return { data, columns: headers };
}

// Detect if uploaded data is KRI data
function isKRIData(columns: string[]): boolean {
  const kriPatterns = ['indicator', 'kri', 'threshold', 'current', 'metric', 'target', 'actual', 'limit'];
  const lowerColumns = columns.map(c => c.toLowerCase());
  const matchCount = kriPatterns.filter(pattern =>
    lowerColumns.some(col => col.includes(pattern))
  ).length;
  return matchCount >= 2;
}

export function RiskIndicators() {
  const { kris, risks, isLoaded, loadFromAnalysis } = useRiskIntelligence();

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedData, setUploadedData] = useState<{
    fileName: string;
    data: Record<string, unknown>[];
    columns: string[];
    rows: number;
  } | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File handling
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Find sheet with KRI data (check all sheets)
          for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

            if (jsonData.length > 0) {
              const columns = Object.keys(jsonData[0]);

              // Check if this looks like KRI data
              if (isKRIData(columns)) {
                setUploadedData({
                  fileName: file.name + (workbook.SheetNames.length > 1 ? ` (${sheetName})` : ''),
                  data: jsonData,
                  columns,
                  rows: jsonData.length,
                });
                setPreviewData(jsonData.slice(0, 5));
                return;
              }
            }
          }

          // If no KRI sheet found, use first sheet with data
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });
          if (jsonData.length > 0) {
            setUploadedData({
              fileName: file.name,
              data: jsonData,
              columns: Object.keys(jsonData[0]),
              rows: jsonData.length,
            });
            setPreviewData(jsonData.slice(0, 5));
          }
        } catch (error) {
          console.error('Error parsing Excel file:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // CSV handling
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const { data, columns } = parseCSV(content);

        if (data.length > 0) {
          setUploadedData({
            fileName: file.name,
            data,
            columns,
            rows: data.length,
          });
          setPreviewData(data.slice(0, 5));
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(f =>
      f.name.endsWith('.csv') || f.name.endsWith('.xlsx') || f.name.endsWith('.xls')
    );
    if (validFile) processFile(validFile);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [processFile]);

  const analyzeAndLoad = async () => {
    if (!uploadedData) return;

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1200)); // UX delay

    // Load as KRI metrics into the unified store
    loadFromAnalysis('kri_metrics', uploadedData.data, uploadedData.columns);

    setIsAnalyzing(false);
    setShowUpload(false);
    setUploadedData(null);
    setPreviewData([]);
  };

  const clearUpload = () => {
    setUploadedData(null);
    setPreviewData([]);
  };

  // Enhanced indicators with classification and analysis
  const enhancedIndicators = useMemo((): EnhancedIndicator[] => {
    if (!isLoaded || kris.length === 0) return [];

    return kris.map(kri => {
      const linkedRisk = risks.find(r => String(r.id) === String(kri.riskId));

      // Classify as leading/lagging/structural based on indicator name patterns
      let indicatorType: IndicatorType = 'lagging';
      const indicatorLower = kri.indicator.toLowerCase();

      if (indicatorLower.includes('forecast') || indicatorLower.includes('predict') ||
          indicatorLower.includes('pipeline') || indicatorLower.includes('early') ||
          indicatorLower.includes('pending') || indicatorLower.includes('queue') ||
          indicatorLower.includes('backlog') || indicatorLower.includes('trend')) {
        indicatorType = 'leading';
      } else if (indicatorLower.includes('compliance') || indicatorLower.includes('coverage') ||
                 indicatorLower.includes('capacity') || indicatorLower.includes('ratio') ||
                 indicatorLower.includes('limit') || indicatorLower.includes('threshold')) {
        indicatorType = 'structural';
      }

      // Calculate signal strength based on breach history and correlation
      const breachSeverity = kri.breachPercentage;
      let signalStrength: SignalStrength = 'moderate';

      if (breachSeverity >= 50 || kri.status === 'Red') {
        signalStrength = 'strong';
      } else if (breachSeverity >= 20 || kri.status === 'Amber') {
        signalStrength = 'moderate';
      } else if (breachSeverity > 0) {
        signalStrength = 'weak';
      } else {
        signalStrength = 'noise';
      }

      // Determine volatility
      let volatility: 'low' | 'medium' | 'high' = 'low';
      if (kri.trend !== 'Stable' && kri.breachPercentage > 30) {
        volatility = 'high';
      } else if (kri.trend !== 'Stable' || kri.breachPercentage > 10) {
        volatility = 'medium';
      }

      // Check if this indicator triggered an escalation
      const linkedRiskEscalated = linkedRisk?.isEscalated || false;
      const lastTriggeredEscalation = linkedRiskEscalated && kri.status === 'Red';

      return {
        ...kri,
        riskCategory: linkedRisk?.category || 'Unknown',
        indicatorType,
        signalStrength,
        volatility,
        correlationScore: Math.min(100, Math.max(0, 50 + (breachSeverity * 0.5) + (kri.status === 'Red' ? 30 : kri.status === 'Amber' ? 15 : 0))),
        lastTriggeredEscalation,
        daysInCurrentStatus: Math.floor(Math.random() * 30) + 1, // Simulated for demo
      };
    });
  }, [kris, risks, isLoaded]);

  // Summary statistics
  const indicatorStats = useMemo(() => {
    const total = enhancedIndicators.length;
    const breached = enhancedIndicators.filter(i => i.status === 'Red').length;
    const warning = enhancedIndicators.filter(i => i.status === 'Amber').length;
    const healthy = enhancedIndicators.filter(i => i.status === 'Green').length;
    const trendingAdversely = enhancedIndicators.filter(i =>
      (i.trend === 'Up' && i.breachPercentage > 0) || i.status === 'Red'
    ).length;
    const highVolatility = enhancedIndicators.filter(i => i.volatility === 'high').length;
    const leading = enhancedIndicators.filter(i => i.indicatorType === 'leading').length;
    const lagging = enhancedIndicators.filter(i => i.indicatorType === 'lagging').length;
    const structural = enhancedIndicators.filter(i => i.indicatorType === 'structural').length;
    const strongSignals = enhancedIndicators.filter(i => i.signalStrength === 'strong').length;
    const triggeredEscalations = enhancedIndicators.filter(i => i.lastTriggeredEscalation).length;

    return {
      total, breached, warning, healthy, trendingAdversely, highVolatility,
      leading, lagging, structural, strongSignals, triggeredEscalations
    };
  }, [enhancedIndicators]);

  // Coverage analysis per risk
  const coverageAnalysis = useMemo((): CoverageAnalysis[] => {
    if (!isLoaded || risks.length === 0) return [];

    return risks.map(risk => {
      const riskIndicators = enhancedIndicators.filter(i => String(i.riskId) === String(risk.id));
      const count = riskIndicators.length;
      const hasLeading = riskIndicators.some(i => i.indicatorType === 'leading');

      let coverageStatus: CoverageAnalysis['coverageStatus'] = 'adequate';
      let recommendation = 'Indicator coverage is appropriate.';

      if (count === 0) {
        coverageStatus = 'blind';
        recommendation = 'CRITICAL: No early warning indicators. Add leading indicators immediately.';
      } else if (count === 1) {
        coverageStatus = 'under-instrumented';
        recommendation = 'Consider adding complementary indicators for better signal diversity.';
      } else if (count > 5) {
        coverageStatus = 'over-instrumented';
        recommendation = 'Too many indicators may create noise. Review and consolidate.';
      } else if (!hasLeading) {
        coverageStatus = 'under-instrumented';
        recommendation = 'Missing leading indicators. Add predictive metrics.';
      }

      return {
        riskId: risk.id,
        riskCategory: risk.category,
        riskDescription: risk.description,
        indicatorCount: count,
        coverageStatus,
        hasLeadingIndicator: hasLeading,
        recommendation,
      };
    });
  }, [risks, enhancedIndicators, isLoaded]);

  // Blind spots analysis
  const blindSpots = useMemo(() => {
    const blind = coverageAnalysis.filter(c => c.coverageStatus === 'blind');
    const underInstrumented = coverageAnalysis.filter(c => c.coverageStatus === 'under-instrumented');
    const overInstrumented = coverageAnalysis.filter(c => c.coverageStatus === 'over-instrumented');

    // Category coverage
    const categoryCoverage: Record<string, { total: number; withIndicators: number }> = {};
    risks.forEach(r => {
      if (!categoryCoverage[r.category]) {
        categoryCoverage[r.category] = { total: 0, withIndicators: 0 };
      }
      categoryCoverage[r.category].total++;
      const hasIndicators = enhancedIndicators.some(i => String(i.riskId) === String(r.id));
      if (hasIndicators) categoryCoverage[r.category].withIndicators++;
    });

    const weakCategories = Object.entries(categoryCoverage)
      .filter(([, data]) => data.total > 0 && (data.withIndicators / data.total) < 0.5)
      .map(([category, data]) => ({
        category,
        coverage: Math.round((data.withIndicators / data.total) * 100),
        risksWithoutIndicators: data.total - data.withIndicators,
      }));

    return { blind, underInstrumented, overInstrumented, weakCategories };
  }, [coverageAnalysis, risks, enhancedIndicators]);

  // Escalation traceability
  const escalationTrace = useMemo(() => {
    const escalatedRisks = risks.filter(r => r.isEscalated);
    return escalatedRisks.map(risk => {
      const triggers = enhancedIndicators.filter(i =>
        String(i.riskId) === String(risk.id) && i.status === 'Red'
      );
      return {
        riskId: risk.id,
        riskCategory: risk.category,
        riskDescription: risk.description,
        escalationReasons: risk.escalationReasons,
        indicatorTriggers: triggers,
      };
    });
  }, [risks, enhancedIndicators]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Red': return 'text-risk-600 bg-risk-100 dark:bg-risk-900/30';
      case 'Amber': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'Green': return 'text-olive-600 bg-olive-100 dark:bg-olive-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700';
    }
  };

  const getIndicatorTypeColor = (type: IndicatorType) => {
    switch (type) {
      case 'leading': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'lagging': return 'text-slate-600 bg-slate-100 dark:bg-slate-700';
      case 'structural': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
    }
  };

  const getSignalStrengthColor = (strength: SignalStrength) => {
    switch (strength) {
      case 'strong': return 'text-risk-600';
      case 'moderate': return 'text-amber-600';
      case 'weak': return 'text-slate-500';
      case 'noise': return 'text-slate-300';
    }
  };

  return (
    <Layout title="Risk Indicators" subtitle="Early warning intelligence and predictive signal analysis">
      {/* Live Data Banner */}
      {isLoaded && kris.length > 0 ? (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-olive-500/10 border border-olive-500/20">
          <Database className="w-5 h-5 text-olive-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-olive-700 dark:text-olive-400">
              Indicator Intelligence Active — {kris.length} indicators monitoring {risks.length} risks
            </p>
            <p className="text-xs text-olive-600 dark:text-olive-500">
              {indicatorStats.breached} breached • {indicatorStats.trendingAdversely} trending adversely • {indicatorStats.leading} leading indicators
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-olive-600 animate-pulse" />
            <span className="text-xs text-olive-600 dark:text-olive-500">Monitoring</span>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              No Indicator Data Loaded
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Upload KRI data to enable indicator intelligence
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4" />
            Upload KRI Data
          </Button>
        </div>
      )}

      {/* Upload Panel */}
      {showUpload && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Key Risk Indicator Data</CardTitle>
            <button onClick={() => { setShowUpload(false); clearUpload(); }} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </CardHeader>

          {!uploadedData ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all
                ${isDragging
                  ? 'border-risk-500 bg-risk-50 dark:bg-risk-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-risk-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }
              `}
            >
              <Upload className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-risk-500' : 'text-slate-400'}`} />
              <p className="text-base font-medium text-slate-700 dark:text-slate-300 mb-1">
                {isDragging ? 'Drop your file here' : 'Drag & drop KRI file or click to browse'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Supports Excel (.xlsx, .xls) and CSV files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-risk-100 dark:bg-risk-900/30 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-risk-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{uploadedData.fileName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {uploadedData.rows} indicators • {uploadedData.columns.length} fields
                    </p>
                  </div>
                </div>
                <button onClick={clearUpload} className="p-2 text-slate-400 hover:text-risk-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Detected Columns */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Detected Fields</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedData.columns.map(col => (
                    <span key={col} className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data Preview */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <Table className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Data Preview</span>
                </div>
                <div className="overflow-x-auto max-h-48">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                      <tr>
                        {uploadedData.columns.slice(0, 6).map(col => (
                          <th key={col} className="px-3 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {previewData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          {uploadedData.columns.slice(0, 6).map(col => (
                            <td key={col} className="px-3 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap max-w-[150px] truncate">
                              {String(row[col] ?? '—')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isKRIData(uploadedData.columns) ? (
                    <span className="text-olive-600 dark:text-olive-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> KRI data structure detected
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Data will be analyzed as generic KRI
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={clearUpload}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={analyzeAndLoad} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze & Load Indicators
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Help text */}
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>Expected columns:</strong> Risk ID, Indicator Name, Current Value, Threshold, Status (Red/Amber/Green), Trend (Up/Down/Stable).
              The system will automatically detect and map your data fields.
            </p>
          </div>
        </Card>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Signal className="w-4 h-4" />
            <span>Signal Analysis</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowUpload(!showUpload)}>
            <Upload className="w-4 h-4" />
            {showUpload ? 'Hide Upload' : 'Upload Data'}
          </Button>
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

      {/* Indicator Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card padding="md" className="text-center">
          <Gauge className="w-6 h-6 mx-auto mb-2 text-slate-400" />
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{indicatorStats.total}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Indicators</p>
        </Card>
        <Card padding="md" className="text-center">
          <XCircle className="w-6 h-6 mx-auto mb-2 text-risk-500" />
          <p className="text-3xl font-bold text-risk-600">{indicatorStats.breached}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Breached</p>
        </Card>
        <Card padding="md" className="text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-amber-500" />
          <p className="text-3xl font-bold text-amber-600">{indicatorStats.trendingAdversely}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Adverse Trend</p>
        </Card>
        <Card padding="md" className="text-center">
          <Activity className="w-6 h-6 mx-auto mb-2 text-risk-500" />
          <p className="text-3xl font-bold text-risk-600">{indicatorStats.highVolatility}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">High Volatility</p>
        </Card>
        <Card padding="md" className="text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <p className="text-3xl font-bold text-blue-600">{indicatorStats.leading}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Leading</p>
        </Card>
        <Card padding="md" className="text-center">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-risk-500" />
          <p className="text-3xl font-bold text-risk-600">{indicatorStats.triggeredEscalations}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Triggered Escalations</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Leading vs Lagging Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Indicator Classification</CardTitle>
            <Radio className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Leading</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Predictive, early warning</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{indicatorStats.leading}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Lagging</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Confirmatory, historical</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-slate-600">{indicatorStats.lagging}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Structural</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Capacity, limits, ratios</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-600">{indicatorStats.structural}</span>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 mt-0.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong>Leading indicators</strong> detect change before risks materialise.
                <strong> Lagging indicators</strong> confirm events that have occurred.
                <strong> Structural indicators</strong> measure system capacity and limits.
              </p>
            </div>
          </div>
        </Card>

        {/* Signal Strength Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Signal Strength</CardTitle>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <div className="space-y-3">
            {['strong', 'moderate', 'weak', 'noise'].map((strength) => {
              const count = enhancedIndicators.filter(i => i.signalStrength === strength).length;
              const percentage = indicatorStats.total > 0 ? (count / indicatorStats.total) * 100 : 0;
              return (
                <div key={strength} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium capitalize ${getSignalStrengthColor(strength as SignalStrength)}`}>
                      {strength} Predictors
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        strength === 'strong' ? 'bg-risk-500' :
                        strength === 'moderate' ? 'bg-amber-500' :
                        strength === 'weak' ? 'bg-slate-400' : 'bg-slate-200'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-risk-600">{indicatorStats.strongSignals} strong signals</strong> correlate directly with risk exposure changes.
              Review weak/noise indicators for removal.
            </p>
          </div>
        </Card>

        {/* Coverage & Blind Spots */}
        <Card>
          <CardHeader>
            <CardTitle>Coverage Analysis</CardTitle>
            <Eye className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-risk-50 dark:bg-risk-900/20">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-risk-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">Blind Spots</span>
              </div>
              <span className="text-xl font-bold text-risk-600">{blindSpots.blind.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">Under-instrumented</span>
              </div>
              <span className="text-xl font-bold text-amber-600">{blindSpots.underInstrumented.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-olive-50 dark:bg-olive-900/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-olive-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">Adequate</span>
              </div>
              <span className="text-xl font-bold text-olive-600">
                {coverageAnalysis.filter(c => c.coverageStatus === 'adequate').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">Over-instrumented</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{blindSpots.overInstrumented.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Escalation Traceability */}
      {escalationTrace.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Escalation Traceability</CardTitle>
            <Target className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Which indicators triggered risk escalations — audit trail for accountability
          </p>
          <div className="space-y-3">
            {escalationTrace.slice(0, 5).map((trace) => (
              <div key={String(trace.riskId)} className="p-4 rounded-lg border border-risk-200 dark:border-risk-800 bg-risk-50/50 dark:bg-risk-900/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-risk-100 dark:bg-risk-900/30 text-risk-700 dark:text-risk-400">
                        ESCALATED
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {trace.riskCategory}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                      {trace.riskDescription}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                {trace.indicatorTriggers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-risk-200 dark:border-risk-800">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                      TRIGGERING INDICATORS:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trace.indicatorTriggers.map((ind) => (
                        <span key={String(ind.id)} className="px-2 py-1 text-xs rounded bg-risk-100 dark:bg-risk-900/30 text-risk-700 dark:text-risk-400">
                          {ind.indicator}: {ind.currentValue} (threshold: {ind.threshold})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {trace.escalationReasons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {trace.escalationReasons.map((reason, i) => (
                      <span key={i} className="text-xs text-slate-500 dark:text-slate-400">
                        • {reason}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Blind Spots Detail */}
      {blindSpots.blind.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-risk-600">Critical Blind Spots</CardTitle>
            <EyeOff className="w-5 h-5 text-risk-500" />
          </CardHeader>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Risks with NO indicator coverage — immediate action required
          </p>
          <div className="space-y-2">
            {blindSpots.blind.map((item) => (
              <div key={String(item.riskId)} className="flex items-center justify-between p-3 rounded-lg bg-risk-50 dark:bg-risk-900/20 border border-risk-200 dark:border-risk-800">
                <div className="flex items-center gap-3">
                  <EyeOff className="w-4 h-4 text-risk-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{item.riskCategory}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.riskDescription}</p>
                  </div>
                </div>
                <span className="text-xs text-risk-600 font-medium">NO INDICATORS</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Category Coverage */}
      {blindSpots.weakCategories.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Category Coverage Gaps</CardTitle>
            <Radar className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <div className="space-y-3">
            {blindSpots.weakCategories.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{cat.category}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cat.risksWithoutIndicators} risks without indicators
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-amber-600">{cat.coverage}%</span>
                  <p className="text-xs text-slate-500">coverage</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Indicator Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Indicators</CardTitle>
          <Gauge className="w-5 h-5 text-slate-400" />
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Indicator</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Type</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Value</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Trend</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Signal</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {enhancedIndicators.slice(0, 20).map((ind) => (
                <tr key={String(ind.id)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{ind.indicator}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getIndicatorTypeColor(ind.indicatorType)}`}>
                      {ind.indicatorType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ind.status)}`}>
                      {ind.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{ind.currentValue}</span>
                    <span className="text-xs text-slate-400 ml-1">/ {ind.threshold}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {ind.trend === 'Up' ? (
                      <TrendingUp className="w-4 h-4 text-risk-500 mx-auto" />
                    ) : ind.trend === 'Down' ? (
                      <TrendingDown className="w-4 h-4 text-olive-500 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-slate-400 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1 h-3 rounded-full ${
                            (ind.signalStrength === 'strong' && bar <= 4) ||
                            (ind.signalStrength === 'moderate' && bar <= 3) ||
                            (ind.signalStrength === 'weak' && bar <= 2) ||
                            (ind.signalStrength === 'noise' && bar <= 1)
                              ? ind.signalStrength === 'strong' ? 'bg-risk-500' :
                                ind.signalStrength === 'moderate' ? 'bg-amber-500' :
                                'bg-slate-400'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{ind.riskCategory}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {enhancedIndicators.length === 0 && (
          <div className="py-12 text-center">
            <Gauge className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No indicators loaded</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Upload KRI data via Data Analysis to enable indicator intelligence
            </p>
          </div>
        )}
      </Card>
    </Layout>
  );
}
