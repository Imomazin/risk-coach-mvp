import { useState } from 'react';
import { Layout } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Search,
  Mail,
  Shield,
  Edit2,
  Trash2,
  UserPlus,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending';
  risksOwned: number;
  lastActive: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    status: 'active',
    risksOwned: 5,
    lastActive: 'Now',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'manager',
    status: 'active',
    risksOwned: 8,
    lastActive: '2 hours ago',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'analyst',
    status: 'active',
    risksOwned: 12,
    lastActive: '1 day ago',
  },
  {
    id: '4',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    role: 'analyst',
    status: 'active',
    risksOwned: 6,
    lastActive: '3 hours ago',
  },
  {
    id: '5',
    name: 'Alex Martinez',
    email: 'alex.martinez@company.com',
    role: 'viewer',
    status: 'pending',
    risksOwned: 0,
    lastActive: 'Pending invite',
  },
];

const roleColors = {
  admin: 'bg-lumina-50 text-lumina-700 border-lumina-200',
  manager: 'bg-blue-50 text-blue-700 border-blue-200',
  analyst: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  viewer: 'bg-slate-100 text-slate-700 border-slate-200',
};

const roleLabels = {
  admin: 'Admin',
  manager: 'Manager',
  analyst: 'Analyst',
  viewer: 'Viewer',
};

export function Team() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Team" subtitle="Manage team members and permissions">
      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
                     text-sm text-slate-900 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
          />
        </div>

        <Button variant="primary" onClick={() => setShowInvite(true)}>
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm" className="flex items-center gap-3">
          <div className="text-3xl font-bold text-slate-900">{teamMembers.length}</div>
          <div className="text-sm text-slate-500">Total Members</div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="text-3xl font-bold text-emerald-600">
            {teamMembers.filter((m) => m.status === 'active').length}
          </div>
          <div className="text-sm text-slate-500">Active</div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="text-3xl font-bold text-amber-600">
            {teamMembers.filter((m) => m.status === 'pending').length}
          </div>
          <div className="text-sm text-slate-500">Pending</div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="text-3xl font-bold text-lumina-600">
            {teamMembers.filter((m) => m.role === 'admin').length}
          </div>
          <div className="text-sm text-slate-500">Admins</div>
        </Card>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-slate-900">
              Invite Team Member
            </h3>
            <button
              onClick={() => setShowInvite(false)}
              className="text-slate-400 hover:text-slate-600 text-xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="colleague@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                         focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                               focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500">
                <option value="viewer">Viewer</option>
                <option value="analyst">Analyst</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setShowInvite(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              <Mail className="w-4 h-4" />
              Send Invite
            </Button>
          </div>
        </Card>
      )}

      {/* Team Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Risks Owned
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center text-white font-semibold">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${roleColors[member.role]}`}>
                      {member.role === 'admin' && <Shield className="w-3 h-3" />}
                      {roleLabels[member.role]}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-medium text-slate-900">{member.risksOwned}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {member.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-slate-500">{member.lastActive}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}
