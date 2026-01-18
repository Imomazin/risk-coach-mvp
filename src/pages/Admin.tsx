import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../contexts/AuthContext';
import {
  Users,
  Shield,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Clock,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface ManagedUser extends User {
  id: string;
  status: 'active' | 'inactive' | 'pending';
  department?: string;
  permissions: string[];
}

// Simulated user database
const initialUsers: ManagedUser[] = [
  {
    id: '1',
    email: 'admin@luminar.ai',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    department: 'Executive',
    provider: 'email',
    permissions: ['all'],
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2025-01-18T09:30:00Z',
  },
  {
    id: '2',
    email: 'sarah.johnson@company.com',
    name: 'Sarah Johnson',
    role: 'user',
    status: 'active',
    department: 'Risk Management',
    provider: 'google',
    permissions: ['view_risks', 'edit_risks', 'view_reports'],
    createdAt: '2024-03-20T14:30:00Z',
    lastLogin: '2025-01-17T16:45:00Z',
  },
  {
    id: '3',
    email: 'michael.chen@company.com',
    name: 'Michael Chen',
    role: 'user',
    status: 'active',
    department: 'Operations',
    provider: 'github',
    permissions: ['view_risks', 'view_reports'],
    createdAt: '2024-05-10T09:15:00Z',
    lastLogin: '2025-01-16T11:20:00Z',
  },
  {
    id: '4',
    email: 'emily.rodriguez@company.com',
    name: 'Emily Rodriguez',
    role: 'viewer',
    status: 'pending',
    department: 'Compliance',
    provider: 'email',
    permissions: ['view_risks'],
    createdAt: '2025-01-10T08:00:00Z',
    lastLogin: undefined,
  },
  {
    id: '5',
    email: 'david.kim@company.com',
    name: 'David Kim',
    role: 'user',
    status: 'inactive',
    department: 'IT Security',
    provider: 'google',
    permissions: ['view_risks', 'edit_risks'],
    createdAt: '2024-02-28T11:45:00Z',
    lastLogin: '2024-12-01T14:30:00Z',
  },
];

const allPermissions = [
  { id: 'view_risks', label: 'View Risks', description: 'Can view risk register' },
  { id: 'edit_risks', label: 'Edit Risks', description: 'Can create and modify risks' },
  { id: 'delete_risks', label: 'Delete Risks', description: 'Can remove risks' },
  { id: 'view_reports', label: 'View Reports', description: 'Can access reports' },
  { id: 'create_reports', label: 'Create Reports', description: 'Can generate reports' },
  { id: 'manage_users', label: 'Manage Users', description: 'Can add/edit users' },
  { id: 'view_analytics', label: 'View Analytics', description: 'Can access analytics' },
  { id: 'api_access', label: 'API Access', description: 'Can use API integrations' },
];

export function Admin() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'viewer',
    department: '',
    permissions: [] as string[],
  });

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Refresh simulation
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Add user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;

    const user: ManagedUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'pending',
      department: newUser.department,
      provider: 'email',
      permissions: newUser.permissions,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, user]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'user', department: '', permissions: [] });
  };

  // Update user
  const handleUpdateUser = () => {
    if (!selectedUser) return;

    setUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setShowDeleteConfirm(null);
  };

  // Toggle user status
  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
      }
      return u;
    }));
  };

  // Approve pending user
  const approveUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'active' };
      }
      return u;
    }));
  };

  if (!isAdmin) {
    return (
      <Layout title="Access Denied">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md">
            You don't have permission to access the admin panel. Please contact your administrator
            if you believe this is an error.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
            Tip: Login with an email containing "admin" to get admin access.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard" subtitle="Manage users, permissions, and system settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage users, permissions, and system settings
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-lumina-600 text-white rounded-xl hover:bg-lumina-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={UserCheck}
            label="Active Users"
            value={stats.active}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Pending Approval"
            value={stats.pending}
            color="yellow"
          />
          <StatCard
            icon={Shield}
            label="Administrators"
            value={stats.admins}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center text-white font-semibold text-sm">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                        {user.provider && user.provider !== 'email' && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {user.provider}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : user.role === 'user'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : user.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'active' ? 'bg-green-500' :
                          user.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {user.department || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === 'pending' && (
                          <button
                            onClick={() => approveUser(user.id)}
                            className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title="Approve user"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.status === 'active'
                              ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                              : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                          }`}
                          title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No users found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)} title="Add New User">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                  placeholder="john@company.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' | 'viewer' }))}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                    placeholder="Engineering"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  {allPermissions.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-slate-800 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.includes(perm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser(prev => ({ ...prev, permissions: [...prev.permissions, perm.id] }));
                          } else {
                            setNewUser(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== perm.id) }));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-lumina-600 focus:ring-lumina-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={!newUser.name || !newUser.email}
                  className="flex-1 px-4 py-2 bg-lumina-600 text-white rounded-lg hover:bg-lumina-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add User
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <Modal onClose={() => { setShowEditModal(false); setSelectedUser(null); }} title="Edit User">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, role: e.target.value as 'admin' | 'user' | 'viewer' } : null)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={selectedUser.department || ''}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, department: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lumina-500/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  {allPermissions.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-slate-800 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUser.permissions.includes(perm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUser(prev => prev ? { ...prev, permissions: [...prev.permissions, perm.id] } : null);
                          } else {
                            setSelectedUser(prev => prev ? { ...prev, permissions: prev.permissions.filter(p => p !== perm.id) } : null);
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-lumina-600 focus:ring-lumina-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                  className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 px-4 py-2 bg-lumina-600 text-white rounded-lg hover:bg-lumina-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <Modal onClose={() => setShowDeleteConfirm(null)} title="Confirm Delete">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </Modal>
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
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
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

// Modal Component
function Modal({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
