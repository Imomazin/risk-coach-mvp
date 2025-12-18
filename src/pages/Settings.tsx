import { useState } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Users,
  Save,
  ChevronRight,
} from 'lucide-react';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Database },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'team', label: 'Team', icon: Users },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Risk Manager',
    timezone: 'UTC-5 (Eastern)',
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    alertsEnabled: true,
    twoFactorEnabled: false,
    theme: 'light',
  });

  return (
    <Layout title="Settings" subtitle="Manage your account and preferences">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card padding="sm">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-lumina-50 text-lumina-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Profile Settings</h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div>
                  <Button variant="secondary" size="sm">Change Photo</Button>
                  <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
                  >
                    <option>UTC-5 (Eastern)</option>
                    <option>UTC-6 (Central)</option>
                    <option>UTC-7 (Mountain)</option>
                    <option>UTC-8 (Pacific)</option>
                    <option>UTC+0 (London)</option>
                    <option>UTC+1 (Paris)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                <Button variant="primary">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive alerts via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lumina-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Push Notifications</p>
                    <p className="text-sm text-slate-500">Browser push notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pushNotifications}
                      onChange={(e) => setFormData({ ...formData, pushNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lumina-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Weekly Digest</p>
                    <p className="text-sm text-slate-500">Summary of weekly risk activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.weeklyDigest}
                      onChange={(e) => setFormData({ ...formData, weeklyDigest: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lumina-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Risk Alerts</p>
                    <p className="text-sm text-slate-500">Immediate alerts for critical risks</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.alertsEnabled}
                      onChange={(e) => setFormData({ ...formData, alertsEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lumina-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                <Button variant="primary">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Add an extra layer of security</p>
                    </div>
                    <Button variant={formData.twoFactorEnabled ? 'secondary' : 'primary'} size="sm">
                      {formData.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Change Password</p>
                      <p className="text-sm text-slate-500">Update your account password</p>
                    </div>
                    <Button variant="secondary" size="sm">Change</Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Active Sessions</p>
                      <p className="text-sm text-slate-500">Manage your active login sessions</p>
                    </div>
                    <Button variant="secondary" size="sm">View</Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900">Delete Account</p>
                      <p className="text-sm text-red-600">Permanently delete your account and data</p>
                    </div>
                    <Button variant="danger" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {(activeSection === 'appearance' || activeSection === 'integrations' || activeSection === 'api' || activeSection === 'team') && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 capitalize">{activeSection} Settings</h2>
              <p className="text-slate-500">This section is coming soon. Stay tuned for updates!</p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
