import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import {
  Shield,
  Sparkles,
  ArrowRight,
  BarChart3,
  Bell,
  Users,
  Lock,
  Zap,
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

const testimonials = [
  {
    quote: "Lumina R transformed how we manage operational risks. The AI coach alone saved us countless hours.",
    author: 'Sarah Chen',
    role: 'Chief Risk Officer',
    company: 'TechCorp Inc.',
  },
  {
    quote: "Finally, a risk management platform that's actually intuitive. Our team adopted it within days.",
    author: 'Michael Roberts',
    role: 'Operations Director',
    company: 'Global Manufacturing Co.',
  },
  {
    quote: "The visual heat maps and analytics give our board exactly the insights they need.",
    author: 'Emily Watson',
    role: 'CEO',
    company: 'StartupVentures',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Features
              </a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Testimonials
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Pricing
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="md">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="md">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lumina-50 border border-lumina-200 mb-8">
              <Sparkles className="w-4 h-4 text-lumina-600" />
              <span className="text-sm font-medium text-lumina-700">
                AI-Powered Risk Intelligence
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-slate-900 leading-tight mb-6">
              Master Your Risks with{' '}
              <span className="bg-gradient-to-r from-lumina-600 to-lumina-800 bg-clip-text text-transparent">
                Intelligent Insights
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Lumina R helps SMEs identify, assess, and mitigate risks with AI-powered
              recommendations and real-time monitoring. Turn uncertainty into confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/signup">
                <Button variant="primary" size="lg" className="text-base px-8 py-4">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="text-base px-8 py-4">
                <Zap className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <p className="text-sm text-slate-400 mb-4">Trusted by risk professionals worldwide</p>
            <div className="flex items-center justify-center gap-8 opacity-50">
              {['TechCorp', 'GlobalMfg', 'StartupVC', 'FinanceHub', 'RiskPro'].map((company) => (
                <span key={company} className="text-lg font-semibold text-slate-400">
                  {company}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-lumina-500/20 border border-slate-200">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-1">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-lg bg-slate-700 text-xs text-slate-400">
                      app.lumina-r.io/dashboard
                    </div>
                  </div>
                </div>
                {/* Dashboard preview */}
                <div className="bg-slate-50 aspect-video flex items-center justify-center">
                  <div className="text-center p-8">
                    <Shield className="w-16 h-16 text-lumina-500 mx-auto mb-4" />
                    <p className="text-slate-600">Interactive Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-display font-bold text-lumina-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4">
              Everything you need to manage risk
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features designed for modern risk management teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-lumina-300 hover:shadow-lg hover:shadow-lumina-500/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-lumina-50 text-lumina-600 flex items-center justify-center mb-4 group-hover:bg-lumina-100 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4">
              Loved by risk professionals
            </h2>
            <p className="text-lg text-slate-600">
              See what our customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-lumina-600 to-lumina-800 text-white">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Ready to take control of your risks?
            </h2>
            <p className="text-lg text-lumina-100 mb-8 max-w-2xl mx-auto">
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
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-slate-400 ml-4">
                Part of the Lumina Product Family
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900">Privacy</a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900">Terms</a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900">Contact</a>
            </div>
            <p className="text-sm text-slate-400">
              © 2025 Lumina R. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
