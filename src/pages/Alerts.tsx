import { useState, useMemo } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRiskIntelligence } from '../stores/RiskIntelligenceStore';
import {
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Settings,
  Activity,
  Target,
  TrendingUp,
  Shield,
  Sparkles,
  Info,
  AlertCircle,
} from 'lucide-react';

// Sample alerts for fallback when no data is loaded
const sampleAlerts = [
  {
    id: '1',
    type: 'overdue' as const,
    title: 'Mitigation Action Overdue',
    description: 'The mitigation action for "Cybersecurity Breach" is 2 days overdue.',
    riskTitle: 'Cybersecurity Breach',
    timestamp: '2 hours ago',
    read: false,
    severity: 'critical' as const,
    context: {
      dataPoints: ['Action was due Dec 15', 'Owner: Mike Johnson'],
      implication: 'Unmitigated exposure may lead to increased loss potential.',
    },
  },
  {
    id: '2',
    type: 'escalation' as const,
    title: 'Risk Level Escalated',
    description: 'Supply Chain Disruption has been automatically escalated due to increased probability.',
    riskTitle: 'Supply Chain Disruption',
    timestamp: '5 hours ago',
    read: false,
    severity: 'warning' as const,
    context: {
      dataPoints: ['Probability increased from 3 to 4', 'Two new supplier issues identified'],
      implication: 'Risk now exceeds high-risk threshold and requires management review.',
    },
  },
  {
    id: '3',
    type: 'new_risk' as const,
    title: 'New Risk Identified',
    description: 'A new technology risk has been added to the register by Mike Johnson.',
    riskTitle: 'API Security Vulnerability',
    timestamp: '1 day ago',
    read: false,
    severity: 'info' as const,
    context: {
      dataPoints: ['Initial rating: High', 'Category: Technology'],
      implication: 'New risk requires assessment and control mapping.',
    },
  },
  {
    id: '4',
    type: 'reminder' as const,
    title: 'Review Reminder',
    description: 'Monthly risk review is due in 3 days. 4 risks require assessment update.',
    timestamp: '1 day ago',
    read: true,
    severity: 'info' as const,
    context: {
      dataPoints: ['4 risks pending review', 'Last review: Nov 15'],
      implication: 'Timely reviews ensure risk data remains accurate.',
    },
  },
  {
    id: '5',
    type: 'status_change' as const,
    title: 'Risk Status Updated',
    description: 'Currency Exchange Volatility has been marked as "Accepted" by Finance Team.',
    riskTitle: 'Currency Exchange Volatility',
    timestamp: '2 days ago',
    read: true,
    severity: 'info' as const,
    context: {
      dataPoints: ['Status: Accepted', 'Approved by: CFO'],
      implication: 'Risk is acknowledged and accepted within appetite.',
    },
  },
];

type AlertType = 'overdue' | 'escalation' | 'new_risk' | 'status_change' | 'reminder' | 'breach' | 'concentration' | 'appetite' | 'trend';

const alertIcons: Record<AlertType, React.ComponentType<{ className?: string }>> = {
  overdue: AlertTriangle,
  escalation: AlertTriangle,
  new_risk: Bell,
  status_change: CheckCircle2,
  reminder: Clock,
  breach: Activity,
  concentration: Target,
  appetite: Shield,
  trend: TrendingUp,
};

const alertColors: Record<AlertType, string> = {
  overdue: 'text-risk-500 bg-risk-50 dark:bg-risk-900/30',
  escalation: 'text-risk-500 bg-risk-50 dark:bg-risk-900/30',
  new_risk: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
  status_change: 'text-olive-500 bg-olive-50 dark:bg-olive-900/30',
  reminder: 'text-slate-500 bg-slate-50 dark:bg-slate-800',
  breach: 'text-risk-600 bg-risk-50 dark:bg-risk-900/40',
  concentration: 'text-risk-500 bg-risk-50 dark:bg-risk-900/30',
  appetite: 'text-risk-600 bg-risk-50 dark:bg-risk-900/40',
  trend: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
};

export function Alerts() {
  const { intelligence, isLoaded, acknowledgeAlert, getUnacknowledgedAlerts } = useRiskIntelligence();

  // Combine live alerts from store with sample alerts
  const allAlerts = useMemo(() => {
    if (!isLoaded || !intelligence) {
      return sampleAlerts;
    }

    // Convert store alerts to display format
    const storeAlerts = intelligence.alerts.map((alert) => ({
      id: alert.id,
      type: alert.type as AlertType,
      title: alert.title,
      description: alert.description,
      timestamp: alert.timestamp.toLocaleString(),
      read: alert.acknowledged,
      severity: alert.severity,
      context: alert.context,
      riskIds: alert.context.riskIds,
    }));

    // Add sample alerts if we have few store alerts
    if (storeAlerts.length < 3) {
      return [...storeAlerts, ...sampleAlerts.slice(0, 3)];
    }

    return storeAlerts;
  }, [intelligence, isLoaded]);

  const [localReadState, setLocalReadState] = useState<Record<string, boolean>>({});
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const alerts = allAlerts.filter((a) => !dismissedAlerts.has(a.id));

  const filteredAlerts = alerts.filter((alert) => {
    const isRead = localReadState[alert.id] ?? alert.read;
    if (filter === 'unread') return !isRead;
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  const unreadCount = alerts.filter((a) => !(localReadState[a.id] ?? a.read)).length;

  const markAsRead = (id: string) => {
    setLocalReadState((prev) => ({ ...prev, [id]: true }));
    // Also acknowledge in the store if it's a store alert
    if (isLoaded) {
      acknowledgeAlert(id);
    }
  };

  const markAllAsRead = () => {
    const newState: Record<string, boolean> = {};
    alerts.forEach((a) => {
      newState[a.id] = true;
      if (isLoaded) {
        acknowledgeAlert(a.id);
      }
    });
    setLocalReadState((prev) => ({ ...prev, ...newState }));
  };

  const dismissAlert = (id: string) => {
    setDismissedAlerts((prev) => new Set([...prev, id]));
  };

  // Calculate alert stats
  const alertStats = useMemo(() => {
    const critical = alerts.filter((a) => a.severity === 'critical').length;
    const escalations = alerts.filter((a) => a.type === 'escalation').length;
    const breaches = alerts.filter((a) => a.type === 'breach').length;
    const concentrations = alerts.filter((a) => a.type === 'concentration').length;
    const appetiteAlerts = alerts.filter((a) => a.type === 'appetite').length;

    return {
      critical,
      escalations: escalations,
      breaches: breaches + appetiteAlerts,
      warnings: concentrations + alerts.filter((a) => a.severity === 'warning').length,
    };
  }, [alerts]);

  return (
    <Layout title="Alerts" subtitle="Intelligent alerts from your risk intelligence system">
      {/* Live Data Banner - Operations room style */}
      {isLoaded && intelligence && (
        <div className="mb-6 p-4 rounded-lg bg-slate-900 border border-slate-800 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-risk-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-risk-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white tracking-tight">Live Alerts Active</h3>
              <p className="text-sm text-slate-400">
                {getUnacknowledgedAlerts().length} unacknowledged alerts from uploaded data
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="status-dot status-dot--critical animate-pulse" />
              <span className="text-xs text-risk-400 font-medium uppercase tracking-wider">Monitoring</span>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'critical'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Critical ({alertStats.critical})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCircle2 className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
          <Button variant="secondary" size="sm">
            <Settings className="w-4 h-4" />
            Alert Settings
          </Button>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {alertStats.critical}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Critical Alerts</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {alertStats.escalations}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Escalations</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {alertStats.breaches}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Breaches/Appetite</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {alertStats.warnings}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Warnings</p>
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <Card padding="none">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filteredAlerts.map((alert) => {
            const Icon = alertIcons[alert.type] || AlertCircle;
            const isRead = localReadState[alert.id] ?? alert.read;

            return (
              <div
                key={alert.id}
                className={`relative p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                  !isRead ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''
                } ${
                  alert.severity === 'critical' ? 'border-l-4 border-l-risk-500 bg-risk-50/20 dark:bg-risk-950/20' :
                  alert.severity === 'warning' ? 'border-l-4 border-l-amber-500 bg-amber-50/10 dark:bg-amber-950/10' : ''
                }`}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${alertColors[alert.type] || alertColors.reminder}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className={`font-medium ${!isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {alert.title}
                      </h4>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-risk-500 animate-pulse" style={{ boxShadow: '0 0 6px rgba(220, 38, 38, 0.6)' }} />
                      )}
                      {alert.severity === 'critical' && (
                        <span className="risk-badge risk-badge--critical">
                          Critical
                        </span>
                      )}
                      {alert.severity === 'warning' && (
                        <span className="px-2 py-0.5 text-xs rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-semibold">
                          Warning
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{alert.description}</p>

                    {/* Context Information - The intelligent part */}
                    {alert.context && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        {alert.context.dataPoints && alert.context.dataPoints.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">DATA POINTS</p>
                            <div className="flex flex-wrap gap-2">
                              {alert.context.dataPoints.map((point, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                  {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {alert.context.implication && (
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                              <span className="font-medium">If ignored:</span> {alert.context.implication}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {'riskTitle' in alert && alert.riskTitle && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Related risk:</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{alert.riskTitle as string}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {alert.timestamp}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="py-12 text-center">
            <Bell className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              {filter === 'unread' ? 'No unread alerts' : filter === 'critical' ? 'No critical alerts' : 'No alerts'}
            </p>
            {!isLoaded && (
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                Upload risk data in the Data Analysis section to generate intelligent alerts
              </p>
            )}
          </div>
        )}
      </Card>
    </Layout>
  );
}
