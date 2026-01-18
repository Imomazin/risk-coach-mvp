import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { useTheme } from '../contexts/ThemeContext';
import {
  Shield,
  Sparkles,
  ArrowRight,
  BarChart3,
  Bell,
  Sun,
  Moon,
  Circle,
  CheckCircle2,
  Target,
  Layers,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Risk Intelligence',
    description: 'AI-powered risk identification and assessment',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Interactive dashboards and heat maps',
  },
  {
    icon: Sparkles,
    title: 'AI Advisor',
    description: 'Intelligent recommendations and insights',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Real-time risk notifications',
  },
];

const frameworks = [
  { name: 'Monte Carlo', icon: BarChart3 },
  { name: 'Bow-Tie', icon: Layers },
  { name: 'FMEA', icon: Target },
  { name: 'Risk Matrix', icon: Shield },
];

export function LandingPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'black';
  const isBlack = resolvedTheme === 'black';

  return (
    <div className={`min-h-screen ${isBlack ? 'bg-black text-white' : isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Navigation - Minimal */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? isBlack
            ? 'bg-black/95 backdrop-blur-xl border-b border-white/5'
            : isDark
              ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800'
              : 'bg-white/95 backdrop-blur-xl border-b border-slate-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Logo />

            {/* Desktop Nav - Minimal */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`text-sm ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
                Features
              </a>
              <a href="#frameworks" className={`text-sm ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
                Frameworks
              </a>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className={`p-2.5 rounded-full transition-all ${
                    isDark
                      ? 'text-white/60 hover:text-white hover:bg-white/10'
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {resolvedTheme === 'black' ? <Circle className="w-5 h-5 fill-current" /> :
                   resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> :
                   <Sun className="w-5 h-5" />}
                </button>

                {showThemeMenu && (
                  <>
                    <div className="fixed inset-0" onClick={() => setShowThemeMenu(false)} />
                    <div className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-2xl border overflow-hidden ${
                      isBlack ? 'bg-zinc-900 border-white/10' : isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                      {[
                        { id: 'black', label: 'Black', icon: Circle, desc: 'OLED Black' },
                        { id: 'dark', label: 'Dark', icon: Moon, desc: 'Dark Slate' },
                        { id: 'light', label: 'Light', icon: Sun, desc: 'Light Mode' },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => { setTheme(option.id as 'light' | 'dark' | 'black'); setShowThemeMenu(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                              theme === option.id
                                ? 'bg-lumina-500/20 text-lumina-400'
                                : isDark
                                  ? 'text-white/80 hover:bg-white/5'
                                  : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${option.id === 'black' ? 'fill-current' : ''}`} />
                            <div className="flex-1 text-left">
                              <p className="font-medium">{option.label}</p>
                              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{option.desc}</p>
                            </div>
                            {theme === option.id && <CheckCircle2 className="w-4 h-4 text-lumina-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className={isDark ? 'text-white/70 hover:text-white' : ''}>
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>

              {/* Mobile menu */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${isBlack ? 'bg-black border-white/5' : isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="px-6 py-4 space-y-3">
              <a href="#features" className={`block text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`} onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#frameworks" className={`block text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`} onClick={() => setMobileMenuOpen(false)}>
                Frameworks
              </a>
              <Link to="/login" className="block text-sm text-lumina-500" onClick={() => setMobileMenuOpen(false)}>
                Sign in
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero - Minimal & Elegant */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] ${
            isBlack ? 'bg-lumina-600/10' : isDark ? 'bg-lumina-500/15' : 'bg-lumina-500/20'
          }`} />
          <div className={`absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] ${
            isBlack ? 'bg-violet-600/10' : isDark ? 'bg-violet-500/15' : 'bg-violet-500/15'
          }`} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Small badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${
            isBlack ? 'bg-white/5 border border-white/10' : isDark ? 'bg-lumina-500/10 border border-lumina-500/20' : 'bg-lumina-50 border border-lumina-200'
          }`}>
            <Sparkles className="w-4 h-4 text-lumina-500" />
            <span className={`text-sm font-medium ${isDark ? 'text-lumina-400' : 'text-lumina-700'}`}>
              AI-Powered Risk Intelligence
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6">
            Risk Management
            <br />
            <span className="bg-gradient-to-r from-lumina-400 via-lumina-500 to-violet-500 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          {/* Subheadline */}
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${
            isBlack ? 'text-white/50' : isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Lumina R helps organizations identify, assess, and mitigate risks
            with intelligent AI insights and real-time monitoring.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/signup">
              <Button variant="primary" size="lg" className="px-8 min-w-[200px]">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="secondary"
                size="lg"
                className={`px-8 min-w-[200px] ${
                  isBlack ? 'border-white/10 hover:bg-white/5' : isDark ? 'border-slate-700 hover:bg-slate-800' : ''
                }`}
              >
                Sign In
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className={`flex items-center justify-center gap-8 text-sm ${
            isBlack ? 'text-white/30' : isDark ? 'text-slate-600' : 'text-slate-400'
          }`}>
            <span>500+ Companies</span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>10K+ Risks Managed</span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>98% Satisfaction</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${
            isBlack ? 'border-white/20' : isDark ? 'border-slate-700' : 'border-slate-300'
          }`}>
            <div className={`w-1.5 h-2.5 rounded-full animate-bounce ${
              isBlack ? 'bg-white/40' : isDark ? 'bg-slate-500' : 'bg-slate-400'
            }`} />
          </div>
        </div>
      </section>

      {/* Features - Clean Grid */}
      <section id="features" className={`py-32 px-6 ${
        isBlack ? 'bg-zinc-950' : isDark ? 'bg-slate-900/50' : 'bg-slate-50'
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Powerful Features
            </h2>
            <p className={`text-lg ${isBlack ? 'text-white/50' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Everything you need to manage risk effectively
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`p-8 rounded-2xl border transition-all hover:scale-[1.02] ${
                    isBlack
                      ? 'bg-zinc-900 border-white/5 hover:border-white/10'
                      : isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isBlack ? 'bg-lumina-500/10' : isDark ? 'bg-lumina-500/10' : 'bg-lumina-50'
                  }`}>
                    <Icon className="w-6 h-6 text-lumina-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className={isBlack ? 'text-white/50' : isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Frameworks - Horizontal */}
      <section id="frameworks" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Professional Frameworks
            </h2>
            <p className={`text-lg ${isBlack ? 'text-white/50' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Industry-standard methodologies built-in
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {frameworks.map((framework) => {
              const Icon = framework.icon;
              return (
                <div
                  key={framework.name}
                  className={`flex items-center gap-3 px-6 py-4 rounded-full border transition-all hover:scale-105 ${
                    isBlack
                      ? 'bg-zinc-900 border-white/5 hover:border-lumina-500/30'
                      : isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-lumina-500/50'
                        : 'bg-white border-slate-200 hover:border-lumina-300 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5 text-lumina-500" />
                  <span className="font-medium">{framework.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - Simple */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`p-12 sm:p-16 rounded-3xl ${
            isBlack
              ? 'bg-gradient-to-br from-lumina-600/20 to-violet-600/20 border border-white/5'
              : 'bg-gradient-to-br from-lumina-600 to-violet-600'
          }`}>
            <h2 className={`text-3xl sm:text-4xl font-display font-bold mb-4 ${isBlack ? '' : 'text-white'}`}>
              Ready to get started?
            </h2>
            <p className={`text-lg mb-8 ${isBlack ? 'text-white/60' : 'text-white/80'}`}>
              Start your 14-day free trial. No credit card required.
            </p>
            <Link to="/signup">
              <Button
                variant={isBlack ? 'primary' : 'secondary'}
                size="lg"
                className={isBlack ? '' : 'bg-white text-lumina-700 hover:bg-lumina-50 border-0'}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className={`py-8 px-6 border-t ${
        isBlack ? 'border-white/5' : isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className={`text-sm ${isBlack ? 'text-white/30' : isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Part of the Lumina Family
            </span>
          </div>
          <p className={`text-sm ${isBlack ? 'text-white/30' : isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            © 2025 Lumina R
          </p>
        </div>
      </footer>
    </div>
  );
}
