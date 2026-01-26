import { useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Layout } from '../components/layout/Layout';
import { ERMAnalysisPanel } from '../components/analysis/ERMAnalysisPanel';
import { analyzeERMData, detectDataType } from '../utils/riskDataAnalyzer';
import { useRiskIntelligence } from '../stores/RiskIntelligenceStore';
import type { ERMAnalysisResult, ERMDataType } from '../types/riskData';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Trash2,
  RefreshCw,
  Table,
  Calculator,
  Sparkles,
  Search,
  ArrowUpDown,
  Database,
  CheckCircle2,
  Layers,
  Download,
  FileJson,
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
  columnNames: string[];
  data: Record<string, unknown>[];
  analyzed: boolean;
  ermDataType?: ERMDataType;
  analysisResult?: ERMAnalysisResult;
}

// Parse CSV string to array of objects
function parseCSV(csvText: string): { data: Record<string, unknown>[]; columns: string[] } {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { data: [], columns: [] };

  // Handle both comma and tab-separated values
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
  const data: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Better CSV parsing that handles quoted values
    const values = parseCSVLine(lines[i], delimiter);
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

// Parse a single CSV line handling quoted values
function parseCSVLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      values.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim().replace(/^"|"$/g, ''));
  return values;
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
    const allDates = nonNullValues.every(v => {
      const dateStr = String(v);
      return !isNaN(Date.parse(dateStr)) && dateStr.match(/^\d{4}[-/]\d{2}[-/]\d{2}/);
    });

    if (allBooleans) type = 'boolean';
    else if (allNumbers) type = 'number';
    else if (allDates && uniqueValues.size > 5) type = 'date';
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
    if (numbers.length > 0) {
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
  }

  return column;
}

// Get data type display info
function getDataTypeInfo(type: ERMDataType): { label: string; color: string; description: string } {
  const info: Record<ERMDataType, { label: string; color: string; description: string }> = {
    risk_register: {
      label: 'Risk Register',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
      description: 'Enterprise risk inventory with scores and controls',
    },
    risk_events: {
      label: 'Risk Events',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-600',
      description: 'Historical risk incidents and financial impacts',
    },
    kri_metrics: {
      label: 'KRI Metrics',
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
      description: 'Key Risk Indicators with thresholds and trends',
    },
    controls: {
      label: 'Controls',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600',
      description: 'Control inventory and risk mappings',
    },
    risk_appetite: {
      label: 'Risk Appetite',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
      description: 'Risk tolerance levels and board guidance',
    },
    stress_scenarios: {
      label: 'Stress Scenarios',
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
      description: 'Stress testing scenarios and loss estimates',
    },
    generic: {
      label: 'Generic Data',
      color: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
      description: 'General tabular data',
    },
  };
  return info[type];
}

export function DataAnalysis() {
  // Access the unified risk intelligence store
  const { loadFromAnalysis } = useRiskIntelligence();

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    let fileType: 'csv' | 'excel' | 'json' = 'csv';

    if (file.name.endsWith('.json')) {
      fileType = 'json';
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      fileType = 'excel';
    }

    // Handle Excel files with ArrayBuffer
    if (fileType === 'excel') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Process all sheets and combine them
          const allSheetData: { sheetName: string; data: Record<string, unknown>[]; columns: string[] }[] = [];

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

            if (jsonData.length > 0) {
              const columns = Object.keys(jsonData[0]);
              allSheetData.push({ sheetName, data: jsonData, columns });
            }
          });

          // Create a file for each sheet with data
          allSheetData.forEach((sheet, index) => {
            const columns = sheet.columns.map(name => analyzeColumn(sheet.data, name));
            const ermDataType = detectDataType(sheet.columns);

            const uploadedFile: UploadedFile = {
              id: `${Date.now()}-${index}`,
              name: allSheetData.length > 1 ? `${file.name} - ${sheet.sheetName}` : file.name,
              size: file.size,
              type: fileType,
              uploadedAt: new Date(),
              rows: sheet.data.length,
              columns,
              columnNames: sheet.columns,
              data: sheet.data,
              analyzed: false,
              ermDataType,
            };

            setFiles(prev => [...prev, uploadedFile]);
            if (index === 0) {
              setSelectedFile(uploadedFile);
            }
          });
        } catch (error) {
          console.error('Error parsing Excel file:', error);
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // Handle CSV and JSON files with text
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
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

      // Detect ERM data type
      const ermDataType = detectDataType(columnNames);

      const uploadedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: fileType,
        uploadedAt: new Date(),
        rows: parsedData.length,
        columns,
        columnNames,
        data: parsedData,
        analyzed: false,
        ermDataType,
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
      if (file.name.endsWith('.csv') || file.name.endsWith('.json') || file.name.endsWith('.xlsx') || file.name.endsWith('.tsv')) {
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

    // Simulate analysis delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Collect known risk IDs from risk register if available
    const riskRegisterFile = files.find(f => f.ermDataType === 'risk_register');
    let knownRiskIds: Set<string | number> | undefined;
    if (riskRegisterFile) {
      const riskIdCol = riskRegisterFile.columnNames.find(c =>
        c.toLowerCase().includes('risk') && c.toLowerCase().includes('id')
      );
      if (riskIdCol) {
        knownRiskIds = new Set(riskRegisterFile.data.map(row => row[riskIdCol] as string | number));
      }
    }

    // Run ERM analysis
    const analysisResult = analyzeERMData(selectedFile.data, selectedFile.columnNames, knownRiskIds);

    // LOAD DATA INTO THE UNIFIED RISK INTELLIGENCE STORE
    // This enables cross-pillar propagation to all other modules
    if (selectedFile.ermDataType && selectedFile.ermDataType !== 'generic') {
      loadFromAnalysis(selectedFile.ermDataType, selectedFile.data);
    }

    // Update file with analysis result
    const updatedFile = { ...selectedFile, analyzed: true, analysisResult };
    setFiles(prev => prev.map(f => f.id === selectedFile.id ? updatedFile : f));
    setSelectedFile(updatedFile);

    setIsAnalyzing(false);
  };

  // NOTE: Data is loaded into the unified store directly in runAnalysis()
  // No auto-reload effect needed - this prevents duplicate loading and potential loops

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
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

  // Export analysis results
  const exportResults = () => {
    if (!selectedFile?.analysisResult) return;

    const exportData = {
      fileName: selectedFile.name,
      analyzedAt: new Date().toISOString(),
      dataType: selectedFile.ermDataType,
      recordCount: selectedFile.rows,
      insights: selectedFile.analysisResult.insights,
      ...(selectedFile.analysisResult.riskDistribution && { riskDistribution: selectedFile.analysisResult.riskDistribution }),
      ...(selectedFile.analysisResult.riskScores && { riskScores: selectedFile.analysisResult.riskScores }),
      ...(selectedFile.analysisResult.kriAnalysis && { kriAnalysis: selectedFile.analysisResult.kriAnalysis }),
      ...(selectedFile.analysisResult.eventAnalysis && { eventAnalysis: selectedFile.analysisResult.eventAnalysis }),
      ...(selectedFile.analysisResult.controlAnalysis && { controlAnalysis: selectedFile.analysisResult.controlAnalysis }),
      ...(selectedFile.analysisResult.stressAnalysis && { stressAnalysis: selectedFile.analysisResult.stressAnalysis }),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile.name.replace(/\.[^/.]+$/, '')}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    .slice(0, 100) : [];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Summary stats across all files
  const fileSummary = {
    totalFiles: files.length,
    analyzedFiles: files.filter(f => f.analyzed).length,
    totalRecords: files.reduce((sum, f) => sum + f.rows, 0),
    dataTypes: [...new Set(files.map(f => f.ermDataType).filter(Boolean))],
  };

  return (
    <Layout title="Data Analysis" subtitle="Upload and analyze enterprise risk management data">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Risk Data Analysis
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Upload risk registers, events, KRIs, controls, and stress scenarios for AI-powered analysis
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-lumina-600 text-white rounded-xl hover:bg-lumina-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.xlsx,.xls,.tsv"
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
          </div>
        </div>

        {/* Summary Stats */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Files Loaded</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{fileSummary.totalFiles}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Analyzed</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{fileSummary.analyzedFiles}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Database className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Records</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{fileSummary.totalRecords.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Data Types</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{fileSummary.dataTypes.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                {isDragging ? 'Drop files here' : 'Drag & drop or click'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                CSV, JSON, TSV supported
              </p>
            </div>

            {/* Supported Data Types */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-medium text-slate-900 dark:text-white text-sm">Supported Data Types</h3>
              </div>
              <div className="p-2 space-y-1 text-xs">
                {(['risk_register', 'risk_events', 'kri_metrics', 'controls', 'stress_scenarios'] as ERMDataType[]).map(type => {
                  const info = getDataTypeInfo(type);
                  return (
                    <div key={type} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${info.color}`}>
                        {info.label}
                      </span>
                    </div>
                  );
                })}
              </div>
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
                  files.map(file => {
                    const typeInfo = file.ermDataType ? getDataTypeInfo(file.ermDataType) : null;
                    return (
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
                           file.type === 'json' ? <FileJson className="w-4 h-4" /> :
                           <FileSpreadsheet className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {file.rows} rows
                            </p>
                            {typeInfo && (
                              <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${typeInfo.color}`}>
                                {typeInfo.label}
                              </span>
                            )}
                          </div>
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
                    );
                  })
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
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedFile.type === 'csv' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                        selectedFile.type === 'json' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                      }`}>
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-semibold text-slate-900 dark:text-white">{selectedFile.name}</h2>
                          {selectedFile.ermDataType && (
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getDataTypeInfo(selectedFile.ermDataType).color}`}>
                              {getDataTypeInfo(selectedFile.ermDataType).label}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {selectedFile.rows.toLocaleString()} rows × {selectedFile.columns.length} columns • {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedFile.analyzed && selectedFile.analysisResult && (
                        <button
                          onClick={exportResults}
                          className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      )}
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
                        {isAnalyzing ? 'Analyzing...' : selectedFile.analyzed ? 'Re-analyze' : 'Run Analysis'}
                      </button>
                    </div>
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
                        {tab === 'insights' && selectedFile.analysisResult && (
                          <span className="px-1.5 py-0.5 text-xs rounded-full bg-lumina-100 dark:bg-lumina-900/30 text-lumina-600">
                            {selectedFile.analysisResult.insights.length}
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
                                  <td key={col.name} className="px-4 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap max-w-xs truncate">
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
                            <h4 className="font-medium text-slate-900 dark:text-white truncate" title={col.name}>{col.name}</h4>
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
                                  <span className="font-medium text-slate-900 dark:text-white">{col.stats.min?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                  <span>Max:</span>
                                  <span className="font-medium text-slate-900 dark:text-white">{col.stats.max?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                  <span>Mean:</span>
                                  <span className="font-medium text-slate-900 dark:text-white">{col.stats.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                  <span>Std Dev:</span>
                                  <span className="font-medium text-slate-900 dark:text-white">{col.stats.stdDev?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
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
                          <p className="text-slate-600 dark:text-slate-400">Analyzing your risk data...</p>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                            Detecting patterns and generating insights
                          </p>
                        </div>
                      ) : selectedFile.analysisResult ? (
                        <ERMAnalysisPanel result={selectedFile.analysisResult} />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">No analysis results yet</p>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                            Click "Run Analysis" to generate ERM insights
                          </p>
                          {selectedFile.ermDataType && (
                            <p className="text-sm text-lumina-600 dark:text-lumina-400 mt-3">
                              Detected as: {getDataTypeInfo(selectedFile.ermDataType).label}
                            </p>
                          )}
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
                  Upload Risk Data
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Upload your enterprise risk management data files for AI-powered analysis.
                  Supported formats include Risk Registers, Risk Events, KRIs, Controls, and Stress Scenarios.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-lumina-600 text-white rounded-xl hover:bg-lumina-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Choose Files
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
