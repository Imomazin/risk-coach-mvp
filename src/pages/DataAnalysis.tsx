import { useState, useCallback, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Trash2,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Table,
  Calculator,
  Sparkles,
  Search,
  ArrowUpDown,
} from 'lucide-react';

interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  nullCount: number;
  uniqueCount: number;
  stats?: {
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    stdDev?: number;
  };
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: 'csv' | 'excel' | 'json';
  uploadedAt: Date;
  rows: number;
  columns: DataColumn[];
  data: Record<string, unknown>[];
  analyzed: boolean;
}

interface AnalysisResult {
  type: 'risk_distribution' | 'trend' | 'anomaly' | 'correlation';
  title: string;
  description: string;
  data: unknown;
  severity?: 'low' | 'medium' | 'high';
}

// Parse CSV string to array of objects
function parseCSV(csvText: string): { data: Record<string, unknown>[]; columns: string[] } {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { data: [], columns: [] };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const data: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, unknown> = {};
    headers.forEach((header, idx) => {
      const value = values[idx] || '';
      // Try to parse as number
      const num = parseFloat(value);
      row[header] = !isNaN(num) && value !== '' ? num : value;
    });
    data.push(row);
  }

  return { data, columns: headers };
}

// Analyze column data
function analyzeColumn(data: Record<string, unknown>[], columnName: string): DataColumn {
  const values = data.map(row => row[columnName]);
  const nullCount = values.filter(v => v === null || v === undefined || v === '').length;
  const uniqueValues = new Set(values.filter(v => v !== null && v !== undefined && v !== ''));

  // Determine type
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  let type: DataColumn['type'] = 'string';

  if (nonNullValues.length > 0) {
    const allNumbers = nonNullValues.every(v => typeof v === 'number' || !isNaN(Number(v)));
    const allBooleans = nonNullValues.every(v => typeof v === 'boolean' || v === 'true' || v === 'false');
    const allDates = nonNullValues.every(v => !isNaN(Date.parse(String(v))));

    if (allBooleans) type = 'boolean';
    else if (allNumbers) type = 'number';
    else if (allDates && uniqueValues.size > 10) type = 'date';
  }

  const column: DataColumn = {
    name: columnName,
    type,
    nullCount,
    uniqueCount: uniqueValues.size,
  };

  // Calculate stats for numeric columns
  if (type === 'number') {
    const numbers = nonNullValues.map(v => Number(v));
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;

    column.stats = {
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      mean,
      median: sorted[Math.floor(sorted.length / 2)],
      stdDev: Math.sqrt(variance),
    };
  }

  return column;
}

// Generate AI analysis insights
function generateInsights(file: UploadedFile): AnalysisResult[] {
  const insights: AnalysisResult[] = [];

  // Find numeric columns for analysis
  const numericCols = file.columns.filter(c => c.type === 'number');

  // Risk Distribution Analysis
  if (numericCols.length > 0) {
    const riskCol = numericCols.find(c =>
      c.name.toLowerCase().includes('risk') ||
      c.name.toLowerCase().includes('score') ||
      c.name.toLowerCase().includes('impact')
    ) || numericCols[0];

    if (riskCol.stats) {
      const highRiskThreshold = (riskCol.stats.mean || 0) + (riskCol.stats.stdDev || 0);
      const highRiskCount = file.data.filter(row => Number(row[riskCol.name]) > highRiskThreshold).length;
      const highRiskPercentage = (highRiskCount / file.data.length) * 100;

      insights.push({
        type: 'risk_distribution',
        title: 'Risk Distribution Analysis',
        description: `${highRiskPercentage.toFixed(1)}% of records (${highRiskCount} items) exceed the high-risk threshold based on ${riskCol.name}. Mean: ${riskCol.stats.mean?.toFixed(2)}, Std Dev: ${riskCol.stats.stdDev?.toFixed(2)}.`,
        data: {
          column: riskCol.name,
          highRiskCount,
          totalCount: file.data.length,
          threshold: highRiskThreshold,
        },
        severity: highRiskPercentage > 25 ? 'high' : highRiskPercentage > 10 ? 'medium' : 'low',
      });
    }
  }

  // Data Quality Analysis
  const qualityIssues = file.columns.filter(c => c.nullCount > file.data.length * 0.1);
  if (qualityIssues.length > 0) {
    insights.push({
      type: 'anomaly',
      title: 'Data Quality Alert',
      description: `${qualityIssues.length} column(s) have more than 10% missing values: ${qualityIssues.map(c => c.name).join(', ')}. This may affect analysis accuracy.`,
      data: { columns: qualityIssues.map(c => ({ name: c.name, nullPercentage: (c.nullCount / file.data.length * 100).toFixed(1) })) },
      severity: 'medium',
    });
  }

  // Trend Analysis (if date column exists)
  const dateCol = file.columns.find(c => c.type === 'date');
  if (dateCol && numericCols.length > 0) {
    insights.push({
      type: 'trend',
      title: 'Temporal Trend Detected',
      description: `Time-series data detected in column "${dateCol.name}". Consider running trend analysis to identify patterns over time.`,
      data: { dateColumn: dateCol.name, valueColumns: numericCols.map(c => c.name) },
      severity: 'low',
    });
  }

  // Correlation hints
  if (numericCols.length >= 2) {
    insights.push({
      type: 'correlation',
      title: 'Correlation Analysis Available',
      description: `${numericCols.length} numeric columns found. Correlation analysis can reveal relationships between variables like ${numericCols.slice(0, 3).map(c => c.name).join(', ')}.`,
      data: { columns: numericCols.map(c => c.name) },
      severity: 'low',
    });
  }

  return insights;
}

export function DataAnalysis() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<'data' | 'stats' | 'insights'>('data');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      let fileType: 'csv' | 'excel' | 'json' = 'csv';

      if (file.name.endsWith('.json')) {
        fileType = 'json';
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        fileType = 'excel';
      }

      let parsedData: Record<string, unknown>[] = [];
      let columnNames: string[] = [];

      if (fileType === 'csv') {
        const result = parseCSV(content);
        parsedData = result.data;
        columnNames = result.columns;
      } else if (fileType === 'json') {
        try {
          const jsonData = JSON.parse(content);
          parsedData = Array.isArray(jsonData) ? jsonData : [jsonData];
          if (parsedData.length > 0) {
            columnNames = Object.keys(parsedData[0]);
          }
        } catch {
          console.error('Invalid JSON');
          return;
        }
      }

      // Analyze columns
      const columns = columnNames.map(name => analyzeColumn(parsedData, name));

      const uploadedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: fileType,
        uploadedAt: new Date(),
        rows: parsedData.length,
        columns,
        data: parsedData,
        analyzed: false,
      };

      setFiles(prev => [...prev, uploadedFile]);
      setSelectedFile(uploadedFile);
    };

    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(file => {
      if (file.name.endsWith('.csv') || file.name.endsWith('.json') || file.name.endsWith('.xlsx')) {
        processFile(file);
      }
    });
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(file => processFile(file));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFile]);

  const runAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setActiveTab('insights');

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const insights = generateInsights(selectedFile);
    setAnalysisResults(insights);

    // Mark file as analyzed
    setFiles(prev => prev.map(f => f.id === selectedFile.id ? { ...f, analyzed: true } : f));
    setSelectedFile(prev => prev ? { ...prev, analyzed: true } : null);

    setIsAnalyzing(false);
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
      setAnalysisResults([]);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  const displayData = selectedFile ? [...selectedFile.data]
    .filter(row => {
      if (!searchQuery) return true;
      return Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
    })
    .slice(0, 100) : []; // Limit to 100 rows for display

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Layout title="Data Analysis" subtitle="Upload and analyze risk data from CSV, Excel, or JSON files">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Data Analysis
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Upload and analyze risk data from CSV, Excel, or JSON files
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-lumina-600 text-white rounded-xl hover:bg-lumina-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File List Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                p-6 border-2 border-dashed rounded-xl text-center transition-all cursor-pointer
                ${isDragging
                  ? 'border-lumina-500 bg-lumina-50 dark:bg-lumina-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-lumina-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-lumina-500' : 'text-slate-400'}`} />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isDragging ? 'Drop files here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                CSV, JSON, XLSX supported
              </p>
            </div>

            {/* Uploaded Files */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-medium text-slate-900 dark:text-white text-sm">Uploaded Files</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {files.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    No files uploaded yet
                  </div>
                ) : (
                  files.map(file => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`
                        p-3 flex items-center gap-3 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0
                        ${selectedFile?.id === file.id
                          ? 'bg-lumina-50 dark:bg-lumina-900/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        file.type === 'csv' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                        file.type === 'json' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                      }`}>
                        {file.type === 'csv' ? <FileText className="w-4 h-4" /> :
                         file.type === 'json' ? <FileText className="w-4 h-4" /> :
                         <FileSpreadsheet className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {file.rows} rows • {formatFileSize(file.size)}
                        </p>
                      </div>
                      {file.analyzed && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                        className="p-1 text-slate-400 hover:text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedFile ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* File Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedFile.type === 'csv' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                        selectedFile.type === 'json' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                      }`}>
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">{selectedFile.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {selectedFile.rows.toLocaleString()} rows × {selectedFile.columns.length} columns
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 px-4 py-2 bg-lumina-600 text-white rounded-lg hover:bg-lumina-700 transition-colors disabled:opacity-60"
                    >
                      {isAnalyzing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                  {(['data', 'stats', 'insights'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        px-4 py-3 text-sm font-medium transition-colors relative
                        ${activeTab === tab
                          ? 'text-lumina-600 dark:text-lumina-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {tab === 'data' && <Table className="w-4 h-4" />}
                        {tab === 'stats' && <Calculator className="w-4 h-4" />}
                        {tab === 'insights' && <Sparkles className="w-4 h-4" />}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {tab === 'insights' && analysisResults.length > 0 && (
                          <span className="px-1.5 py-0.5 text-xs rounded-full bg-lumina-100 dark:bg-lumina-900/30 text-lumina-600">
                            {analysisResults.length}
                          </span>
                        )}
                      </div>
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lumina-600" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {activeTab === 'data' && (
                    <div className="space-y-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search data..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-sm text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Data Table */}
                      <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr>
                              {selectedFile.columns.map((col) => (
                                <th
                                  key={col.name}
                                  onClick={() => handleSort(col.name)}
                                  className="px-4 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                                >
                                  <div className="flex items-center gap-1">
                                    {col.name}
                                    <ArrowUpDown className="w-3 h-3" />
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {displayData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                {selectedFile.columns.map((col) => (
                                  <td key={col.name} className="px-4 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                    {String(row[col.name] ?? '—')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {selectedFile.rows > 100 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          Showing first 100 rows of {selectedFile.rows.toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedFile.columns.map((col) => (
                        <div
                          key={col.name}
                          className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-slate-900 dark:text-white">{col.name}</h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              col.type === 'number' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                              col.type === 'date' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                              col.type === 'boolean' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                              'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              {col.type}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                              <span>Unique Values:</span>
                              <span className="font-medium text-slate-900 dark:text-white">{col.uniqueCount}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                              <span>Missing:</span>
                              <span className={`font-medium ${col.nullCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                                {col.nullCount} ({((col.nullCount / selectedFile.rows) * 100).toFixed(1)}%)
                              </span>
                            </div>
                            {col.stats && (
                              <>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                  <span>Min:</span>
                                  <span className="font-medium text-slate-900 dark:text-white">{col.stats.min?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                  <span>Max:</span>
                                  <span className="font-medium text-slate-900 dark:text-white">{col.stats.max?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                  <span>Mean:</span>
                                  <span className="font-medium text-slate-900 dark:text-white">{col.stats.mean?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                  <span>Std Dev:</span>
                                  <span className="font-medium text-slate-900 dark:text-white">{col.stats.stdDev?.toFixed(2)}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'insights' && (
                    <div className="space-y-4">
                      {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-16 h-16 rounded-full bg-lumina-100 dark:bg-lumina-900/30 flex items-center justify-center mb-4">
                            <RefreshCw className="w-8 h-8 text-lumina-600 animate-spin" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">Analyzing your data with AI...</p>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">This may take a moment</p>
                        </div>
                      ) : analysisResults.length > 0 ? (
                        analysisResults.map((result, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border ${
                              result.severity === 'high'
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                : result.severity === 'medium'
                                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                result.severity === 'high'
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                                  : result.severity === 'medium'
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                              }`}>
                                {result.type === 'risk_distribution' && <BarChart3 className="w-4 h-4" />}
                                {result.type === 'trend' && <TrendingUp className="w-4 h-4" />}
                                {result.type === 'anomaly' && <AlertTriangle className="w-4 h-4" />}
                                {result.type === 'correlation' && <PieChart className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-slate-900 dark:text-white">{result.title}</h4>
                                  {result.severity && (
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                      result.severity === 'high'
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                                        : result.severity === 'medium'
                                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                                    }`}>
                                      {result.severity}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{result.description}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">No analysis results yet</p>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                            Click "Run AI Analysis" to get insights
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No File Selected
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Upload a CSV, JSON, or Excel file to start analyzing your risk data.
                  Drag and drop or click the upload button.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
