import { useState } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';
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
  Sun,
  Moon,
  Monitor,
  Check,
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

const themeOptions = [
  { id: 'light', label: 'Light', icon: Sun, description: 'Light theme for daytime use' },
  { id: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme for reduced eye strain' },
  { id: 'system', label: 'System', icon: Monitor, description: 'Follows your system preference' },
] as const;

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const { theme, setTheme } = useTheme();
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
                        ? 'bg-lumina-50 dark:bg-lumina-900/30 text-lumina-700 dark:text-lumina-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
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
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Profile Settings</h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div>
                  <Button variant="secondary" size="sm">Change Photo</Button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white
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

              <div className="flex justify-end mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Button variant="primary">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lumina-300 dark:peer-focus:ring-lumina-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Browser push notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pushNotifications}
                      onChange={(e) => setFormData({ ...formData, pushNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lumina-300 dark:peer-focus:ring-lumina-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Weekly Digest</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Summary of weekly risk activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.weeklyDigest}
                      onChange={(e) => setFormData({ ...formData, weeklyDigest: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lumina-300 dark:peer-focus:ring-lumina-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Risk Alerts</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Immediate alerts for critical risks</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.alertsEnabled}
                      onChange={(e) => setFormData({ ...formData, alertsEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lumina-300 dark:peer-focus:ring-lumina-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Button variant="primary">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
                    </div>
                    <Button variant={formData.twoFactorEnabled ? 'secondary' : 'primary'} size="sm">
                      {formData.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Change Password</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password</p>
                    </div>
                    <Button variant="secondary" size="sm">Change</Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Active Sessions</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Manage your active login sessions</p>
                    </div>
                    <Button variant="secondary" size="sm">View</Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-400">Delete Account</p>
                      <p className="text-sm text-red-600 dark:text-red-400/80">Permanently delete your account and data</p>
                    </div>
                    <Button variant="danger" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Appearance</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Customize how Lumina R looks on your device
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Theme</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = theme === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-lumina-500 bg-lumina-50 dark:bg-lumina-900/20'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-lumina-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <Icon className={`w-6 h-6 mb-3 ${isSelected ? 'text-lumina-600 dark:text-lumina-400' : 'text-slate-400 dark:text-slate-500'}`} />
                          <p className={`font-medium ${isSelected ? 'text-lumina-700 dark:text-lumina-400' : 'text-slate-900 dark:text-white'}`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Display Density</h3>
                  <div className="flex gap-3">
                    {['Compact', 'Comfortable', 'Spacious'].map((density) => (
                      <button
                        key={density}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          density === 'Comfortable'
                            ? 'bg-lumina-50 dark:bg-lumina-900/30 text-lumina-700 dark:text-lumina-400 border-2 border-lumina-500'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {density}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Accent Color</h3>
                  <div className="flex gap-3">
                    {[
                      { name: 'Violet', color: 'bg-violet-500' },
                      { name: 'Blue', color: 'bg-blue-500' },
                      { name: 'Teal', color: 'bg-teal-500' },
                      { name: 'Emerald', color: 'bg-emerald-500' },
                      { name: 'Rose', color: 'bg-rose-500' },
                    ].map((accent) => (
                      <button
                        key={accent.name}
                        className={`w-10 h-10 rounded-full ${accent.color} transition-transform hover:scale-110 ${
                          accent.name === 'Violet' ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-violet-500' : ''
                        }`}
                        title={accent.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {(activeSection === 'integrations' || activeSection === 'api' || activeSection === 'team') && (
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 capitalize">{activeSection} Settings</h2>
              <p className="text-slate-500 dark:text-slate-400">This section is coming soon. Stay tuned for updates!</p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
