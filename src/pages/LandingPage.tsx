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
  Users,
  Lock,
  Play,
  CheckCircle2,
  Target,
  Layers,
  Sun,
  Moon,
  Circle,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Risk Register',
    description: 'Comprehensive tracking of all identified risks with probability and impact scoring.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Heat maps, trend charts, and dashboards that make risk data actionable.',
  },
  {
    icon: Sparkles,
    title: 'AI Risk Coach',
    description: 'Intelligent recommendations and insights powered by advanced AI.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Real-time notifications for risk escalations, deadlines, and status changes.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Assign risk owners, track mitigation progress, and collaborate seamlessly.',
  },
  {
    icon: Lock,
    title: 'Compliance Ready',
    description: 'Built-in templates for regulatory compliance and audit trails.',
  },
];

const stats = [
  { value: '10,000+', label: 'Risks Managed' },
  { value: '500+', label: 'Companies Trust Us' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '40%', label: 'Risk Reduction' },
];

const frameworks = [
  { name: 'Monte Carlo', icon: BarChart3, description: 'Probabilistic simulation' },
  { name: 'Bow-Tie Analysis', icon: Layers, description: 'Cause-effect mapping' },
  { name: 'FMEA', icon: Target, description: 'Failure mode analysis' },
  { name: 'Risk Matrix', icon: Shield, description: '5x5 assessment grid' },
];

const testimonials = [
  {
    quote: "Lumina R transformed how we manage operational risks. The AI coach alone saved us countless hours.",
    author: 'Sarah Chen',
    role: 'Chief Risk Officer',
    company: 'TechCorp Inc.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    quote: "Finally, a risk management platform that's actually intuitive. Our team adopted it within days.",
    author: 'Michael Roberts',
    role: 'Operations Director',
    company: 'Global Manufacturing Co.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
  {
    quote: "The visual heat maps and analytics give our board exactly the insights they need.",
    author: 'Emily Watson',
    role: 'CEO',
    company: 'StartupVentures',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
];

const integrations = [
  'ServiceNow', 'SAP GRC', 'Splunk', 'Microsoft 365', 'Jira', 'Power BI'
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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Logo />

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`text-sm font-medium ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                Features
              </a>
              <a href="#frameworks" className={`text-sm font-medium ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                Frameworks
              </a>
              <a href="#testimonials" className={`text-sm font-medium ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                Testimonials
              </a>
              <a href="#integrations" className={`text-sm font-medium ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                Integrations
              </a>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className={`p-2 rounded-xl transition-colors ${
                    isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> :
                   resolvedTheme === 'black' ? <Circle className="w-5 h-5 fill-current" /> :
                   <Sun className="w-5 h-5" />}
                </button>

                {showThemeMenu && (
                  <>
                    <div className="fixed inset-0" onClick={() => setShowThemeMenu(false)} />
                    <div className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl border overflow-hidden ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      {[
                        { id: 'light', label: 'Light', icon: Sun },
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'black', label: 'Black', icon: Circle },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => { setTheme(option.id as 'light' | 'dark' | 'black'); setShowThemeMenu(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                              theme === option.id
                                ? 'bg-lumina-500/10 text-lumina-500'
                                : isDark
                                  ? 'text-slate-300 hover:bg-slate-800'
                                  : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${option.id === 'black' ? 'fill-current' : ''}`} />
                            {option.label}
                            {theme === option.id && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <Link to="/login" className="hidden sm:block">
                <Button variant={isDark ? 'ghost' : 'ghost'} size="md">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="md">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              {/* Mobile menu button */}
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
          <div className={`md:hidden border-t ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="px-4 py-4 space-y-2">
              {['Features', 'Frameworks', 'Testimonials', 'Integrations'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`block py-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link to="/login" className="block py-2 text-sm font-medium text-lumina-500">
                Log in
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-lumina-500/20' : 'bg-lumina-500/10'}`} />
          <div className={`absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-violet-500/20' : 'bg-violet-500/10'}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl ${isDark ? 'bg-lumina-600/5' : 'bg-lumina-600/5'}`} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${
                isDark ? 'bg-lumina-500/10 border border-lumina-500/20' : 'bg-lumina-50 border border-lumina-200'
              }`}>
                <Sparkles className="w-4 h-4 text-lumina-500" />
                <span className={`text-sm font-medium ${isDark ? 'text-lumina-400' : 'text-lumina-700'}`}>
                  AI-Powered Risk Intelligence
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                Master Your Risks with{' '}
                <span className="bg-gradient-to-r from-lumina-500 to-violet-500 bg-clip-text text-transparent">
                  Intelligent Insights
                </span>
              </h1>

              {/* Subheadline */}
              <p className={`text-lg lg:text-xl mb-8 max-w-xl mx-auto lg:mx-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Lumina R helps organizations identify, assess, and mitigate risks with AI-powered
                recommendations and real-time monitoring.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link to="/signup">
                  <Button variant="primary" size="lg" className="px-8 py-4 text-base">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="lg"
                  className={`px-8 py-4 text-base ${isDark ? 'border-slate-700 hover:bg-slate-800' : ''}`}
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-center lg:justify-start gap-8">
                {stats.slice(0, 3).map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-2xl font-bold text-lumina-500">{stat.value}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative">
              <div className={`absolute inset-0 rounded-3xl blur-2xl ${isDark ? 'bg-lumina-500/20' : 'bg-lumina-500/10'}`} />
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'shadow-lumina-500/10' : 'shadow-lumina-500/20'}`}>
                <div className={`${isDark ? 'bg-slate-900' : 'bg-slate-100'} p-1`}>
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className={`px-4 py-1 rounded-lg text-xs ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400'}`}>
                        app.lumina-r.io/dashboard
                      </div>
                    </div>
                  </div>
                  {/* Dashboard mockup */}
                  <div className={`${isDark ? 'bg-slate-950' : 'bg-white'} aspect-[4/3] p-6`}>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {['Total Risks', 'Critical', 'KRIs Active', 'Mitigated'].map((label, i) => (
                        <div key={label} className={`p-4 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
                          <p className={`text-2xl font-bold ${i === 1 ? 'text-red-500' : i === 3 ? 'text-emerald-500' : isDark ? 'text-white' : 'text-slate-900'}`}>
                            {[42, 8, 24, 28][i]}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className={`h-32 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-slate-50'} flex items-center justify-center`}>
                      <div className="grid grid-cols-5 gap-2">
                        {[...Array(25)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded ${
                              i < 5 ? 'bg-red-500/80' :
                              i < 10 ? 'bg-amber-500/80' :
                              i < 15 ? 'bg-yellow-500/80' :
                              'bg-emerald-500/80'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frameworks Section */}
      <section id="frameworks" className={`py-24 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Professional Risk Frameworks
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Industry-standard methodologies built-in and ready to use
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {frameworks.map((framework) => {
              const Icon = framework.icon;
              return (
                <div
                  key={framework.name}
                  className={`p-6 rounded-2xl border transition-all hover:scale-105 cursor-pointer group ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-lumina-500/50'
                      : 'bg-white border-slate-200 hover:border-lumina-300 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isDark ? 'bg-lumina-500/10' : 'bg-lumina-50'
                  } group-hover:bg-lumina-500 transition-colors`}>
                    <Icon className={`w-6 h-6 text-lumina-500 group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className="font-semibold mb-1">{framework.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {framework.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Everything you need to manage risk
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Powerful features designed for modern risk management teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`p-6 rounded-2xl border transition-all hover:border-lumina-300 group ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-800 hover:shadow-lg hover:shadow-lumina-500/5'
                      : 'bg-white border-slate-200 hover:shadow-lg hover:shadow-lumina-500/10'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    isDark ? 'bg-lumina-500/10 group-hover:bg-lumina-500/20' : 'bg-lumina-50 group-hover:bg-lumina-100'
                  }`}>
                    <Icon className="w-6 h-6 text-lumina-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-24 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Loved by risk professionals
            </h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              See what our customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Seamless Integrations
          </h2>
          <p className={`text-lg mb-12 max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Connect with your existing tools and platforms
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {integrations.map((name) => (
              <div
                key={name}
                className={`px-6 py-4 rounded-xl border ${
                  isDark
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-lumina-600 to-violet-600 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Ready to take control of your risks?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join hundreds of companies using Lumina R to build resilient organizations.
                Start your 14-day free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-lumina-700 hover:bg-lumina-50 border-0"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-white/10 border-white/20"
                  >
                    Sign In
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t px-4 sm:px-6 lg:px-8 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo />
              <span className={`${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                Part of the Lumina Product Family
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className={`text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Privacy</a>
              <a href="#" className={`text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Terms</a>
              <a href="#" className={`text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Contact</a>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              © 2025 Lumina R. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
