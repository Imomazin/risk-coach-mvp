import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, BarChart3, Bell, Brain, Menu, X, Sparkles, CheckCircle, Lock } from 'lucide-react';

export function CoverPage() {
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-risk-500 to-risk-700 flex items-center justify-center shadow-lg shadow-risk-500/25 group-hover:shadow-risk-500/40 transition-all duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">Lumina R</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Risk Intelligence</span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-risk-500 hover:after:w-full after:transition-all">
                Features
              </a>
              <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-risk-500 hover:after:w-full after:transition-all">
                Pricing
              </a>
              <a href="#docs" className="text-sm text-white/60 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-risk-500 hover:after:w-full after:transition-all">
                Docs
              </a>
              <Link
                to="/login"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm px-5 py-2.5 rounded-xl bg-gradient-to-r from-risk-600 to-risk-700 hover:from-risk-500 hover:to-risk-600 transition-all duration-300 font-semibold shadow-lg shadow-risk-500/20 hover:shadow-risk-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-white/5 mt-4">
              <div className="flex flex-col gap-3">
                <a href="#features" className="text-sm text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all">Features</a>
                <a href="#pricing" className="text-sm text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all">Pricing</a>
                <a href="#docs" className="text-sm text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all">Docs</a>
                <Link to="/login" className="text-sm text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all">Sign In</Link>
                <Link to="/signup" className="text-sm px-4 py-3 rounded-xl bg-gradient-to-r from-risk-600 to-risk-700 text-center font-semibold mt-2 shadow-lg shadow-risk-500/20">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative pt-20">
        {/* Enhanced Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-risk-500/50 to-transparent" />

          {/* Ambient glow - enhanced */}
          <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] -translate-y-1/2 rounded-full blur-[180px] bg-risk-900/50" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] bg-risk-950/70" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] bg-risk-800/20" />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              {/* Badge - enhanced */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-risk-500/10 border border-risk-500/20 mb-8 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-risk-500"></span>
                </span>
                <span className="text-xs font-semibold tracking-wide text-risk-400 uppercase">
                  Enterprise Risk Intelligence
                </span>
              </div>

              {/* Headline - enhanced typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.75rem] font-display font-bold leading-[1.08] tracking-tight mb-7">
                <span className="text-white">Manage risks</span>
                <br />
                <span className="text-white">with </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-risk-400 via-risk-500 to-risk-600 animate-gradient">
                  intelligence
                </span>
              </h1>

              {/* Subtitle - enhanced */}
              <p className="text-base lg:text-lg text-white/60 max-w-lg mb-10 leading-relaxed">
                The enterprise-grade risk intelligence platform trusted by modern organizations.
                Discover insights, identify threats, assess impact, and build lasting resilience.
              </p>

              {/* Email Form - enhanced with micro-interactions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 px-5 py-4 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder:text-white/30
                           focus:outline-none focus:border-risk-500/50 focus:ring-2 focus:ring-risk-500/20 focus:bg-white/[0.08]
                           hover:border-white/20 hover:bg-white/[0.08]
                           transition-all duration-300 backdrop-blur-sm"
                />
                <Link to="/signup" className="w-full sm:w-auto">
                  <button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="w-full px-7 py-4 bg-white text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-2.5
                             hover:bg-white/95 hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5
                             active:translate-y-0 transition-all duration-300 group shadow-xl shadow-white/10"
                  >
                    Get Started
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </button>
                </Link>
              </div>

              {/* Sub-text - enhanced */}
              <p className="text-sm text-white/40 mb-12 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-risk-500/60" />
                Free to start. No credit card required.
              </p>

              {/* Trust indicators - enhanced with glassmorphism */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                {[
                  { icon: Shield, text: 'SOC 2 Compliant' },
                  { icon: BarChart3, text: 'Real-time Analytics' },
                  { icon: Bell, text: 'Smart Alerts' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
                    <item.icon className="w-4 h-4 text-risk-500" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - 3D Cube Visual - enhanced */}
            <div className="relative flex items-center justify-center">
              {/* The 3D Cube */}
              <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px]">
                {/* Enhanced cube glow effect */}
                <div className="absolute inset-0 rounded-3xl blur-[100px] bg-risk-700/40 animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-10 rounded-full blur-[60px] bg-risk-600/20 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

                {/* CSS 3D Cube with animation */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1200px' }}>
                  <div
                    className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 animate-spin"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'rotateX(-15deg) rotateY(-25deg)',
                      animationDuration: '25s',
                      animationTimingFunction: 'linear',
                    }}
                  >
                    {/* Front face - enhanced */}
                    <div
                      className="absolute inset-0 border border-risk-600/60 bg-gradient-to-br from-risk-800/95 via-risk-700/80 to-risk-900/95 backdrop-blur-md rounded-sm"
                      style={{
                        transform: 'translateZ(80px)',
                        boxShadow: 'inset 0 0 80px rgba(185, 28, 28, 0.25), 0 0 30px rgba(185, 28, 28, 0.1)',
                      }}
                    />
                    {/* Back face */}
                    <div
                      className="absolute inset-0 border border-risk-900/40 bg-risk-950/95 rounded-sm"
                      style={{ transform: 'translateZ(-80px)' }}
                    />
                    {/* Right face - enhanced */}
                    <div
                      className="absolute inset-0 border border-risk-700/50 bg-gradient-to-l from-risk-700/60 to-risk-950/85 rounded-sm"
                      style={{
                        transform: 'rotateY(90deg) translateZ(80px)',
                        boxShadow: 'inset 0 0 50px rgba(185, 28, 28, 0.2)',
                      }}
                    />
                    {/* Left face */}
                    <div
                      className="absolute inset-0 border border-risk-900/40 bg-risk-950/85 rounded-sm"
                      style={{ transform: 'rotateY(-90deg) translateZ(80px)' }}
                    />
                    {/* Top face - enhanced */}
                    <div
                      className="absolute inset-0 border border-risk-600/70 bg-gradient-to-b from-risk-600/35 via-risk-700/45 to-risk-800/55 rounded-sm"
                      style={{
                        transform: 'rotateX(90deg) translateZ(80px)',
                        boxShadow: 'inset 0 0 100px rgba(220, 38, 38, 0.25)',
                      }}
                    />
                    {/* Bottom face */}
                    <div
                      className="absolute inset-0 border border-risk-900/40 bg-risk-950/95 rounded-sm"
                      style={{ transform: 'rotateX(-90deg) translateZ(80px)' }}
                    />
                  </div>
                </div>

                {/* Floating icons around cube - enhanced with glassmorphism */}
                <div className="absolute top-2 right-2 p-3.5 rounded-2xl bg-white/[0.08] border border-white/10 backdrop-blur-md animate-bounce shadow-xl shadow-black/20" style={{ animationDuration: '3s' }}>
                  <Brain className="w-5 h-5 text-risk-400" />
                </div>
                <div className="absolute bottom-10 left-2 p-3.5 rounded-2xl bg-white/[0.08] border border-white/10 backdrop-blur-md animate-bounce shadow-xl shadow-black/20" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                  <BarChart3 className="w-5 h-5 text-risk-400" />
                </div>
                <div className="absolute top-1/2 -right-2 p-3.5 rounded-2xl bg-white/[0.08] border border-white/10 backdrop-blur-md animate-bounce shadow-xl shadow-black/20" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <Shield className="w-5 h-5 text-risk-400" />
                </div>
                <div className="absolute bottom-2 right-1/4 p-3 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md animate-bounce shadow-lg shadow-black/20" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
                  <Lock className="w-4 h-4 text-risk-500/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - enhanced */}
      <section id="features" className="py-28 px-6 lg:px-8 border-t border-white/5 relative">
        {/* Background subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-risk-950/20 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-risk-500/10 border border-risk-500/20 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-risk-500" />
              <span className="text-xs font-semibold tracking-wide text-risk-400 uppercase">Powerful Features</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-5 tracking-tight">
              Everything you need for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-risk-400 to-risk-600">risk management</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
              Comprehensive tools to identify, assess, and mitigate risks across your entire organization.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Risk Register', desc: 'Centralized tracking with complete audit trails and compliance mapping' },
              { icon: BarChart3, title: 'Analytics', desc: 'Real-time dashboards with predictive insights and trend analysis' },
              { icon: Bell, title: 'Smart Alerts', desc: 'Intelligent notifications with customizable escalation workflows' },
              { icon: Brain, title: 'AI Advisor', desc: 'AI-powered recommendations and automated risk assessments' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-white/[0.02] border border-white/5
                         hover:border-risk-500/30 hover:bg-white/[0.05] hover:-translate-y-1
                         transition-all duration-300 group cursor-pointer backdrop-blur-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-risk-500/20 to-risk-600/10 border border-risk-500/20
                              flex items-center justify-center mb-5
                              group-hover:from-risk-500/30 group-hover:to-risk-600/20 group-hover:border-risk-500/40
                              group-hover:shadow-lg group-hover:shadow-risk-500/10
                              transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-risk-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2.5 group-hover:text-risk-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/50 transition-colors duration-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section - NEW */}
      <section className="py-20 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-2">Trusted by industry leaders</p>
              <p className="text-white/60">Over 500 enterprises rely on Lumina R for risk intelligence</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/20">
              {['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA'].map((cert, i) => (
                <div key={i} className="px-5 py-2.5 rounded-lg border border-white/10 text-sm font-semibold hover:border-white/20 hover:text-white/30 transition-all duration-300">
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - enhanced */}
      <footer className="py-10 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-risk-500 to-risk-700 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Lumina R</span>
            <span className="text-white/30 text-sm">• Part of the Lumina Family</span>
          </div>
          <p className="text-sm text-white/30">© 2025 Lumina R. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
