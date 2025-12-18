import { useState } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RiskBadge } from '../components/ui/Badge';
import {
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Settings,
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'overdue' | 'escalation' | 'new_risk' | 'status_change' | 'reminder';
  title: string;
  description: string;
  riskTitle?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
}

const sampleAlerts: Alert[] = [
  {
    id: '1',
    type: 'overdue',
    title: 'Mitigation Action Overdue',
    description: 'The mitigation action for "Cybersecurity Breach" is 2 days overdue.',
    riskTitle: 'Cybersecurity Breach',
    riskLevel: 'critical',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'escalation',
    title: 'Risk Level Escalated',
    description: 'Supply Chain Disruption has been automatically escalated due to increased probability.',
    riskTitle: 'Supply Chain Disruption',
    riskLevel: 'high',
    timestamp: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'new_risk',
    title: 'New Risk Identified',
    description: 'A new technology risk has been added to the register by Mike Johnson.',
    riskTitle: 'API Security Vulnerability',
    riskLevel: 'high',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Review Reminder',
    description: 'Monthly risk review is due in 3 days. 4 risks require assessment update.',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '5',
    type: 'status_change',
    title: 'Risk Status Updated',
    description: 'Currency Exchange Volatility has been marked as "Accepted" by Finance Team.',
    riskTitle: 'Currency Exchange Volatility',
    riskLevel: 'low',
    timestamp: '2 days ago',
    read: true,
  },
];

const alertIcons = {
  overdue: AlertTriangle,
  escalation: AlertTriangle,
  new_risk: Bell,
  status_change: CheckCircle2,
  reminder: Clock,
};

const alertColors = {
  overdue: 'text-red-500 bg-red-50',
  escalation: 'text-amber-500 bg-amber-50',
  new_risk: 'text-blue-500 bg-blue-50',
  status_change: 'text-emerald-500 bg-emerald-50',
  reminder: 'text-lumina-500 bg-lumina-50',
};

export function Alerts() {
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredAlerts = alerts.filter(
    (alert) => filter === 'all' || !alert.read
  );

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <Layout title="Alerts" subtitle="Stay informed about risk changes and deadlines">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
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
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {alerts.filter((a) => a.type === 'overdue').length}
            </p>
            <p className="text-xs text-slate-500">Overdue Actions</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {alerts.filter((a) => a.type === 'escalation').length}
            </p>
            <p className="text-xs text-slate-500">Escalations</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {alerts.filter((a) => a.type === 'new_risk').length}
            </p>
            <p className="text-xs text-slate-500">New Risks</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-lumina-50 text-lumina-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {alerts.filter((a) => a.type === 'reminder').length}
            </p>
            <p className="text-xs text-slate-500">Reminders</p>
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <Card padding="none">
        <div className="divide-y divide-slate-100">
          {filteredAlerts.map((alert) => {
            const Icon = alertIcons[alert.type];
            return (
              <div
                key={alert.id}
                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !alert.read ? 'bg-lumina-50/30' : ''
                }`}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${alertColors[alert.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${!alert.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {alert.title}
                      </h4>
                      {!alert.read && (
                        <span className="w-2 h-2 rounded-full bg-lumina-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{alert.description}</p>
                    {alert.riskTitle && alert.riskLevel && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Related risk:</span>
                        <span className="text-sm font-medium text-slate-700">{alert.riskTitle}</span>
                        <RiskBadge level={alert.riskLevel} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {alert.timestamp}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="py-12 text-center">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500">
              {filter === 'unread' ? 'No unread alerts' : 'No alerts'}
            </p>
          </div>
        )}
      </Card>
    </Layout>
  );
}
