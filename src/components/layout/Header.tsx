import { useState } from 'react';
import { Search, Plus, Bell, ChevronDown, Sun, Moon, Circle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const themeOptions = [
    { id: 'black', label: 'Black', icon: Circle, description: 'True black OLED' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Dark slate theme' },
    { id: 'light', label: 'Light', icon: Sun, description: 'Light mode' },
  ] as const;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
      {/* Left - Title */}
      <div>
        <h1 className="font-display font-semibold text-xl text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search risks, reports, or ask AI coach..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800
                     text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-lumina-500/20 focus:border-lumina-500
                     focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="relative flex items-center gap-2 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Change theme"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="w-5 h-5" />
            ) : resolvedTheme === 'black' ? (
              <Circle className="w-5 h-5 fill-current" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            <ChevronDown className="w-3 h-3" />
          </button>

          {showThemeMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Theme</p>
                </div>
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => { setTheme(option.id as 'light' | 'dark' | 'black'); setShowThemeMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? 'bg-lumina-50 dark:bg-lumina-500/10 text-lumina-600 dark:text-lumina-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${option.id === 'black' ? 'fill-current' : ''}`} />
                      <div className="flex-1 text-left">
                        <span className="font-medium">{option.label}</span>
                        <p className={`text-xs ${isActive ? 'text-lumina-500 dark:text-lumina-400' : 'text-slate-400 dark:text-slate-500'}`}>
                          {option.description}
                        </p>
                      </div>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-lumina-500" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Add New Risk */}
        <Button variant="primary" size="md">
          <Plus className="w-4 h-4" />
          New Risk
        </Button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-medium text-slate-900 dark:text-white">{user?.name || 'User'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/team"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Team Management
                  </Link>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
