import { useState } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Plus,
  Search,
  Eye,
  Trash2,
  Share2,
  FileBarChart,
  FileSpreadsheet,
  FilePieChart,
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'summary' | 'detailed' | 'executive' | 'compliance';
  format: 'pdf' | 'excel' | 'ppt';
  createdAt: string;
  createdBy: string;
  size: string;
  status: 'ready' | 'generating' | 'scheduled';
}

const sampleReports: Report[] = [
  {
    id: '1',
    title: 'Q4 2025 Risk Summary Report',
    type: 'summary',
    format: 'pdf',
    createdAt: 'Dec 15, 2025',
    createdBy: 'John Doe',
    size: '2.4 MB',
    status: 'ready',
  },
  {
    id: '2',
    title: 'Annual Risk Assessment 2025',
    type: 'detailed',
    format: 'pdf',
    createdAt: 'Dec 10, 2025',
    createdBy: 'Sarah Chen',
    size: '8.1 MB',
    status: 'ready',
  },
  {
    id: '3',
    title: 'Executive Board Presentation',
    type: 'executive',
    format: 'ppt',
    createdAt: 'Dec 8, 2025',
    createdBy: 'Mike Johnson',
    size: '5.2 MB',
    status: 'ready',
  },
  {
    id: '4',
    title: 'Compliance Audit Report',
    type: 'compliance',
    format: 'pdf',
    createdAt: 'Dec 5, 2025',
    createdBy: 'Lisa Wang',
    size: '3.7 MB',
    status: 'ready',
  },
  {
    id: '5',
    title: 'Weekly Risk Dashboard Export',
    type: 'summary',
    format: 'excel',
    createdAt: 'Scheduled',
    createdBy: 'System',
    size: '—',
    status: 'scheduled',
  },
];

const reportTemplates = [
  {
    id: 'summary',
    title: 'Risk Summary',
    description: 'High-level overview of all risks with key metrics',
    icon: FileText,
  },
  {
    id: 'detailed',
    title: 'Detailed Analysis',
    description: 'Comprehensive report with full risk details and history',
    icon: FileBarChart,
  },
  {
    id: 'executive',
    title: 'Executive Summary',
    description: 'Board-ready presentation with key insights',
    icon: FilePieChart,
  },
  {
    id: 'compliance',
    title: 'Compliance Report',
    description: 'Regulatory compliance status and audit trail',
    icon: FileSpreadsheet,
  },
];

export function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewReport, setShowNewReport] = useState(false);

  const filteredReports = sampleReports.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Reports" subtitle="Generate and manage risk reports">
      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
                     text-sm text-slate-900 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
          />
        </div>

        <Button variant="primary" onClick={() => setShowNewReport(true)}>
          <Plus className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      {/* New Report Modal/Section */}
      {showNewReport && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-slate-900">
              Generate New Report
            </h3>
            <button
              onClick={() => setShowNewReport(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-lumina-300 hover:bg-lumina-50 text-left transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 w-fit group-hover:bg-lumina-100 group-hover:text-lumina-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-slate-900 mt-3">{template.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Reports List */}
      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-medium text-slate-900">Recent Reports</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${
                  report.format === 'pdf' ? 'bg-red-50 text-red-600' :
                  report.format === 'excel' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  <FileText className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900">{report.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-slate-500 capitalize">{report.type}</span>
                    <span className="text-sm text-slate-400">•</span>
                    <span className="text-sm text-slate-500 uppercase">{report.format}</span>
                    <span className="text-sm text-slate-400">•</span>
                    <span className="text-sm text-slate-500">{report.size}</span>
                  </div>
                </div>

                {/* Meta */}
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    {report.status === 'scheduled' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                    {report.createdAt}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">by {report.createdBy}</p>
                </div>

                {/* Status Badge */}
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  report.status === 'ready' ? 'bg-emerald-50 text-emerald-700' :
                  report.status === 'generating' ? 'bg-blue-50 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {report.status === 'ready' ? 'Ready' :
                   report.status === 'generating' ? 'Generating...' : 'Scheduled'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {report.status === 'ready' && (
                    <>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-lumina-600 hover:bg-lumina-50">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500">No reports found</p>
          </div>
        )}
      </Card>
    </Layout>
  );
}
