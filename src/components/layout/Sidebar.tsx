import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Shield,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings,
  Users,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sparkles,
  LogOut,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number | string;
}

const mainNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'risks', label: 'Risk Register', icon: Shield, path: '/risks', badge: 8 },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, path: '/alerts', badge: 3 },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/analytics' },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
  { id: 'ai-coach', label: 'AI Coach', icon: Sparkles, path: '/ai-coach' },
];

const secondaryNavItems: NavItem[] = [
  { id: 'team', label: 'Team', icon: Users, path: '/team' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, path: '/help' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
        flex flex-col transition-all duration-300 z-50
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <Link to="/">
          <Logo collapsed={collapsed} />
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="mb-2">
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Main Menu
            </span>
          )}
        </div>

        {mainNavItems.map((item) => (
          <NavItemLink
            key={item.id}
            item={item}
            isActive={isActive(item.path)}
            collapsed={collapsed}
          />
        ))}

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Settings
            </span>
          )}
        </div>

        {secondaryNavItems.map((item) => (
          <NavItemLink
            key={item.id}
            item={item}
            isActive={isActive(item.path)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {/* Quick notification bell */}
        <Link
          to="/alerts"
          className={`
            w-full flex items-center gap-3 p-2.5 rounded-xl
            text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <div className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          {!collapsed && (
            <span className="text-sm font-medium">Notifications</span>
          )}
        </Link>

        {/* User profile */}
        <div
          className={`
            flex items-center gap-3 p-2.5 rounded-xl mt-1
            bg-slate-50 dark:bg-slate-800
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center text-white font-semibold text-sm">
            {user ? getInitials(user.name) : 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Risk Manager</p>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 p-2.5 rounded-xl mt-1
            text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && (
            <span className="text-sm font-medium">Sign out</span>
          )}
        </button>
      </div>
    </aside>
  );
}

interface NavItemLinkProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}

function NavItemLink({ item, isActive, collapsed }: NavItemLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200
        ${collapsed ? 'justify-center' : ''}
        ${
          isActive
            ? 'bg-lumina-50 dark:bg-lumina-900/30 text-lumina-700 dark:text-lumina-400 hover:bg-lumina-100 dark:hover:bg-lumina-900/40'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        }
      `}
      title={collapsed ? item.label : undefined}
    >
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${
          isActive ? 'text-lumina-600 dark:text-lumina-400' : ''
        }`}
      />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span
              className={`
                px-2 py-0.5 text-xs font-semibold rounded-full
                ${
                  isActive
                    ? 'bg-lumina-200 dark:bg-lumina-800 text-lumina-700 dark:text-lumina-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }
              `}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}
