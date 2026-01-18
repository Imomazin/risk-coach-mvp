import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import {
  Plug,
  Plus,
  Settings,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronRight,
  Code,
  X,
} from 'lucide-react';

interface APIConnection {
  id: string;
  name: string;
  type: 'rest' | 'graphql' | 'webhook' | 'database';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  endpoint: string;
  authType: 'api_key' | 'oauth' | 'basic' | 'none';
  lastSync?: Date;
  syncInterval?: number;
  dataPoints?: number;
  errorMessage?: string;
  config: Record<string, string>;
}

interface APITemplate {
  id: string;
  name: string;
  provider: string;
  type: 'rest' | 'graphql' | 'webhook' | 'database';
  description: string;
  icon: string;
  category: 'risk_data' | 'financial' | 'security' | 'compliance' | 'custom';
  popular: boolean;
}

const apiTemplates: APITemplate[] = [
  {
    id: 'servicenow',
    name: 'ServiceNow',
    provider: 'ServiceNow',
    type: 'rest',
    description: 'Connect to ServiceNow for incident and risk data',
    icon: '🔧',
    category: 'risk_data',
    popular: true,
  },
  {
    id: 'jira',
    name: 'Jira',
    provider: 'Atlassian',
    type: 'rest',
    description: 'Import issues and risk tickets from Jira',
    icon: '📋',
    category: 'risk_data',
    popular: true,
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    provider: 'Salesforce',
    type: 'rest',
    description: 'Sync customer risk data from Salesforce',
    icon: '☁️',
    category: 'risk_data',
    popular: true,
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    provider: 'Bloomberg LP',
    type: 'rest',
    description: 'Real-time market and financial risk data',
    icon: '📈',
    category: 'financial',
    popular: true,
  },
  {
    id: 'refinitiv',
    name: 'Refinitiv',
    provider: 'LSEG',
    type: 'rest',
    description: 'Financial market data and analytics',
    icon: '💹',
    category: 'financial',
    popular: false,
  },
  {
    id: 'splunk',
    name: 'Splunk',
    provider: 'Splunk',
    type: 'rest',
    description: 'Security event and threat data',
    icon: '🔒',
    category: 'security',
    popular: true,
  },
  {
    id: 'crowdstrike',
    name: 'CrowdStrike',
    provider: 'CrowdStrike',
    type: 'rest',
    description: 'Endpoint threat intelligence',
    icon: '🛡️',
    category: 'security',
    popular: false,
  },
  {
    id: 'archer',
    name: 'RSA Archer',
    provider: 'RSA',
    type: 'rest',
    description: 'GRC and compliance data',
    icon: '🎯',
    category: 'compliance',
    popular: true,
  },
  {
    id: 'onetrust',
    name: 'OneTrust',
    provider: 'OneTrust',
    type: 'rest',
    description: 'Privacy and compliance management',
    icon: '🔐',
    category: 'compliance',
    popular: false,
  },
  {
    id: 'custom_rest',
    name: 'Custom REST API',
    provider: 'Custom',
    type: 'rest',
    description: 'Connect to any REST API endpoint',
    icon: '🔗',
    category: 'custom',
    popular: false,
  },
  {
    id: 'custom_graphql',
    name: 'Custom GraphQL',
    provider: 'Custom',
    type: 'graphql',
    description: 'Connect to GraphQL endpoints',
    icon: '⚡',
    category: 'custom',
    popular: false,
  },
  {
    id: 'webhook',
    name: 'Webhook Receiver',
    provider: 'Custom',
    type: 'webhook',
    description: 'Receive data via webhooks',
    icon: '📩',
    category: 'custom',
    popular: false,
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    provider: 'PostgreSQL',
    type: 'database',
    description: 'Direct database connection',
    icon: '🐘',
    category: 'custom',
    popular: false,
  },
];

// Simulated existing connections
const initialConnections: APIConnection[] = [
  {
    id: '1',
    name: 'Production ServiceNow',
    type: 'rest',
    provider: 'ServiceNow',
    status: 'active',
    endpoint: 'https://company.service-now.com/api/v1',
    authType: 'oauth',
    lastSync: new Date(Date.now() - 5 * 60000),
    syncInterval: 15,
    dataPoints: 1247,
    config: { instance: 'company', scope: 'incident,risk' },
  },
  {
    id: '2',
    name: 'Jira Risk Tracker',
    type: 'rest',
    provider: 'Atlassian',
    status: 'active',
    endpoint: 'https://company.atlassian.net/rest/api/3',
    authType: 'api_key',
    lastSync: new Date(Date.now() - 30 * 60000),
    syncInterval: 60,
    dataPoints: 523,
    config: { project: 'RISK', jql: 'type = Risk' },
  },
  {
    id: '3',
    name: 'Bloomberg Terminal',
    type: 'rest',
    provider: 'Bloomberg LP',
    status: 'error',
    endpoint: 'https://api.bloomberg.com/v3/market',
    authType: 'api_key',
    lastSync: new Date(Date.now() - 2 * 3600000),
    syncInterval: 5,
    dataPoints: 0,
    errorMessage: 'API rate limit exceeded. Please upgrade your plan.',
    config: { feeds: 'equity,fx,rates' },
  },
  {
    id: '4',
    name: 'Splunk SIEM',
    type: 'rest',
    provider: 'Splunk',
    status: 'inactive',
    endpoint: 'https://splunk.company.com:8089',
    authType: 'basic',
    syncInterval: 30,
    dataPoints: 8923,
    config: { index: 'security_events' },
  },
];

export function APIGateway() {
  const [connections, setConnections] = useState<APIConnection[]>(initialConnections);
  const [selectedConnection, setSelectedConnection] = useState<APIConnection | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<APITemplate | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

  // New connection form
  const [newConnection, setNewConnection] = useState({
    name: '',
    endpoint: '',
    authType: 'api_key' as APIConnection['authType'],
    apiKey: '',
    username: '',
    password: '',
  });

  // Stats
  const stats = {
    total: connections.length,
    active: connections.filter(c => c.status === 'active').length,
    errors: connections.filter(c => c.status === 'error').length,
    totalDataPoints: connections.reduce((sum, c) => sum + (c.dataPoints || 0), 0),
  };

  // Sync connection
  const syncConnection = async (connectionId: string) => {
    setIsSyncing(connectionId);

    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));

    setConnections(prev => prev.map(c => {
      if (c.id === connectionId) {
        const success = Math.random() > 0.2;
        return {
          ...c,
          status: success ? 'active' : 'error',
          lastSync: new Date(),
          dataPoints: success ? (c.dataPoints || 0) + Math.floor(Math.random() * 50) : c.dataPoints,
          errorMessage: success ? undefined : 'Connection timeout. Please check your network.',
        };
      }
      return c;
    }));

    setIsSyncing(null);
  };

  // Toggle connection status
  const toggleConnection = (connectionId: string) => {
    setConnections(prev => prev.map(c => {
      if (c.id === connectionId) {
        return {
          ...c,
          status: c.status === 'active' ? 'inactive' : 'active',
        };
      }
      return c;
    }));
  };

  // Delete connection
  const deleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
    if (selectedConnection?.id === connectionId) {
      setSelectedConnection(null);
    }
  };

  // Add new connection
  const handleAddConnection = () => {
    if (!selectedTemplate || !newConnection.name || !newConnection.endpoint) return;

    const connection: APIConnection = {
      id: Date.now().toString(),
      name: newConnection.name,
      type: selectedTemplate.type,
      provider: selectedTemplate.provider,
      status: 'pending',
      endpoint: newConnection.endpoint,
      authType: newConnection.authType,
      config: {},
    };

    setConnections(prev => [...prev, connection]);
    setShowAddModal(false);
    setSelectedTemplate(null);
    setNewConnection({
      name: '',
      endpoint: '',
      authType: 'api_key',
      apiKey: '',
      username: '',
      password: '',
    });

    // Auto-sync after adding
    setTimeout(() => syncConnection(connection.id), 500);
  };

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredTemplates = apiTemplates.filter(t =>
    filterCategory === 'all' || t.category === filterCategory
  );

  return (
    <Layout title="API Gateway" subtitle="Connect external data sources and manage integrations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              API Gateway
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Connect external data sources and manage integrations
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-lumina-600 text-white rounded-xl hover:bg-lumina-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Connection
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Plug}
            label="Total Connections"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Active"
            value={stats.active}
            color="green"
          />
          <StatCard
            icon={AlertTriangle}
            label="Errors"
            value={stats.errors}
            color="red"
          />
          <StatCard
            icon={Database}
            label="Data Points"
            value={stats.totalDataPoints.toLocaleString()}
            color="purple"
          />
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className={`
                bg-white dark:bg-slate-800 rounded-xl border overflow-hidden transition-all
                ${connection.status === 'error'
                  ? 'border-red-200 dark:border-red-800'
                  : 'border-slate-200 dark:border-slate-700'
                }
                ${selectedConnection?.id === connection.id ? 'ring-2 ring-lumina-500' : ''}
              `}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                      connection.type === 'rest' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      connection.type === 'graphql' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      connection.type === 'webhook' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                      {connection.provider === 'ServiceNow' ? '🔧' :
                       connection.provider === 'Atlassian' ? '📋' :
                       connection.provider === 'Bloomberg LP' ? '📈' :
                       connection.provider === 'Splunk' ? '🔒' :
                       '🔗'}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{connection.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{connection.provider}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                    connection.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : connection.status === 'error'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                      : connection.status === 'pending'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      connection.status === 'active' ? 'bg-green-500' :
                      connection.status === 'error' ? 'bg-red-500' :
                      connection.status === 'pending' ? 'bg-amber-500' :
                      'bg-slate-500'
                    }`} />
                    {connection.status}
                  </span>
                </div>

                {connection.errorMessage && (
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-600 dark:text-red-400">{connection.errorMessage}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatLastSync(connection.lastSync)}
                    </span>
                    {connection.dataPoints !== undefined && (
                      <span className="flex items-center gap-1">
                        <Database className="w-3.5 h-3.5" />
                        {connection.dataPoints.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    connection.authType === 'oauth' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                    connection.authType === 'api_key' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                    connection.authType === 'basic' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-600'
                  }`}>
                    {connection.authType.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <div className="flex gap-1">
                  <button
                    onClick={() => syncConnection(connection.id)}
                    disabled={isSyncing === connection.id}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Sync now"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing === connection.id ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleConnection(connection.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      connection.status === 'active'
                        ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                        : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    title={connection.status === 'active' ? 'Pause' : 'Activate'}
                  >
                    {connection.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedConnection(connection);
                      setShowConfigModal(true);
                    }}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => deleteConnection(connection.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Connection Card */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-lumina-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:bg-lumina-100 dark:group-hover:bg-lumina-900/30 transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-lumina-600" />
            </div>
            <span className="font-medium text-slate-600 dark:text-slate-400 group-hover:text-lumina-600">
              Add New Connection
            </span>
          </button>
        </div>

        {/* API Documentation Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="w-5 h-5" />
              Lumina R API
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Use our REST API to integrate Lumina R with your systems
            </p>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Your API Key</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Keep this secret. Do not share in client-side code.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-600 dark:text-slate-300">
                  {showApiKey['main'] ? 'sk_live_luminar_a1b2c3d4e5f6' : '••••••••••••••••'}
                </code>
                <button
                  onClick={() => setShowApiKey(prev => ({ ...prev, main: !prev.main }))}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showApiKey['main'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText('sk_live_luminar_a1b2c3d4e5f6')}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { method: 'GET', endpoint: '/api/v1/risks', description: 'List all risks' },
                { method: 'POST', endpoint: '/api/v1/risks', description: 'Create a new risk' },
                { method: 'GET', endpoint: '/api/v1/analytics', description: 'Get analytics data' },
              ].map((api, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      api.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {api.method}
                    </span>
                    <code className="text-sm font-mono text-slate-600 dark:text-slate-300">{api.endpoint}</code>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{api.description}</p>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="flex items-center gap-2 text-sm text-lumina-600 hover:text-lumina-700"
            >
              View full API documentation
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Add Connection Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {selectedTemplate ? `Configure ${selectedTemplate.name}` : 'Add New Connection'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedTemplate(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {!selectedTemplate ? (
                  <div className="space-y-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'risk_data', label: 'Risk Data' },
                        { id: 'financial', label: 'Financial' },
                        { id: 'security', label: 'Security' },
                        { id: 'compliance', label: 'Compliance' },
                        { id: 'custom', label: 'Custom' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setFilterCategory(cat.id)}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            filterCategory === cat.id
                              ? 'bg-lumina-100 dark:bg-lumina-900/30 text-lumina-700 dark:text-lumina-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className="flex items-start gap-3 p-4 text-left bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-lumina-400 hover:bg-lumina-50 dark:hover:bg-lumina-900/20 transition-all"
                        >
                          <span className="text-2xl">{template.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-slate-900 dark:text-white">{template.name}</h4>
                              {template.popular && (
                                <span className="px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{template.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Back to templates
                    </button>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <span className="text-3xl">{selectedTemplate.icon}</span>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">{selectedTemplate.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{selectedTemplate.provider}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Connection Name
                        </label>
                        <input
                          type="text"
                          value={newConnection.name}
                          onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                          placeholder={`My ${selectedTemplate.name} Connection`}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Endpoint URL
                        </label>
                        <input
                          type="url"
                          value={newConnection.endpoint}
                          onChange={(e) => setNewConnection(prev => ({ ...prev, endpoint: e.target.value }))}
                          placeholder="https://api.example.com/v1"
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Authentication Type
                        </label>
                        <select
                          value={newConnection.authType}
                          onChange={(e) => setNewConnection(prev => ({ ...prev, authType: e.target.value as APIConnection['authType'] }))}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                        >
                          <option value="api_key">API Key</option>
                          <option value="oauth">OAuth 2.0</option>
                          <option value="basic">Basic Auth</option>
                          <option value="none">No Auth</option>
                        </select>
                      </div>

                      {newConnection.authType === 'api_key' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            API Key
                          </label>
                          <input
                            type="password"
                            value={newConnection.apiKey}
                            onChange={(e) => setNewConnection(prev => ({ ...prev, apiKey: e.target.value }))}
                            placeholder="Enter your API key"
                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                          />
                        </div>
                      )}

                      {newConnection.authType === 'basic' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Username
                            </label>
                            <input
                              type="text"
                              value={newConnection.username}
                              onChange={(e) => setNewConnection(prev => ({ ...prev, username: e.target.value }))}
                              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Password
                            </label>
                            <input
                              type="password"
                              value={newConnection.password}
                              onChange={(e) => setNewConnection(prev => ({ ...prev, password: e.target.value }))}
                              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedTemplate && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddConnection}
                    disabled={!newConnection.name || !newConnection.endpoint}
                    className="flex-1 px-4 py-2 bg-lumina-600 text-white rounded-lg hover:bg-lumina-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Connection
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Config Modal */}
        {showConfigModal && selectedConnection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfigModal(false)} />
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Connection Settings
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Connection Name
                  </label>
                  <input
                    type="text"
                    value={selectedConnection.name}
                    onChange={(e) => setSelectedConnection(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={selectedConnection.endpoint}
                    onChange={(e) => setSelectedConnection(prev => prev ? { ...prev, endpoint: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sync Interval (minutes)
                  </label>
                  <select
                    value={selectedConnection.syncInterval || 15}
                    onChange={(e) => setSelectedConnection(prev => prev ? { ...prev, syncInterval: Number(e.target.value) } : null)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                  >
                    <option value={5}>Every 5 minutes</option>
                    <option value={15}>Every 15 minutes</option>
                    <option value={30}>Every 30 minutes</option>
                    <option value={60}>Every hour</option>
                    <option value={360}>Every 6 hours</option>
                    <option value={1440}>Daily</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setConnections(prev => prev.map(c => c.id === selectedConnection.id ? selectedConnection : c));
                      setShowConfigModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-lumina-600 text-white rounded-lg hover:bg-lumina-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'red' | 'purple';
}) {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
