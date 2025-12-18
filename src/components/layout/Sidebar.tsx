import { useState } from 'react';
import { Logo } from '../ui/Logo';
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
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  active?: boolean;
}

const mainNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { id: 'risks', label: 'Risk Register', icon: Shield, badge: 12 },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: 3 },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'ai-coach', label: 'AI Coach', icon: Sparkles },
];

const secondaryNavItems: NavItem[] = [
  { id: 'team', label: 'Team', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-200
        flex flex-col transition-all duration-300 z-50
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <Logo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
            <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Main Menu
            </span>
          )}
        </div>

        {mainNavItems.map((item) => (
          <NavItemButton
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            collapsed={collapsed}
            onClick={() => setActiveItem(item.id)}
          />
        ))}

        <div className="pt-4 mt-4 border-t border-slate-100">
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Settings
            </span>
          )}
        </div>

        {secondaryNavItems.map((item) => (
          <NavItemButton
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            collapsed={collapsed}
            onClick={() => setActiveItem(item.id)}
          />
        ))}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-slate-100">
        {/* Quick notification bell */}
        <button
          className={`
            w-full flex items-center gap-3 p-2.5 rounded-xl
            text-slate-600 hover:bg-slate-50 transition-all duration-200
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
        </button>

        {/* User profile */}
        <div
          className={`
            flex items-center gap-3 p-2.5 rounded-xl mt-1
            bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                John Doe
              </p>
              <p className="text-xs text-slate-500 truncate">Risk Manager</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavItemButton({
  item,
  isActive,
  collapsed,
  onClick,
}: NavItemButtonProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200
        ${collapsed ? 'justify-center' : ''}
        ${
          isActive
            ? 'bg-lumina-50 text-lumina-700 hover:bg-lumina-100'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
      title={collapsed ? item.label : undefined}
    >
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${
          isActive ? 'text-lumina-600' : ''
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
                    ? 'bg-lumina-200 text-lumina-700'
                    : 'bg-slate-200 text-slate-600'
                }
              `}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}
