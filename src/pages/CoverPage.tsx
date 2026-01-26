import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, BarChart3, Bell, Brain, Menu, X } from 'lucide-react';

export function CoverPage() {
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-risk-500 to-risk-700 flex items-center justify-center shadow-lg shadow-risk-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">Lumina R</span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Risk Intelligence</span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-sm text-white/60 hover:text-white transition-colors">
                Docs
              </a>
              <Link
                to="/login"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm px-4 py-2 rounded-lg bg-risk-600 hover:bg-risk-500 transition-all font-medium"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-white/60 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-white/5 mt-4">
              <div className="flex flex-col gap-3">
                <a href="#features" className="text-sm text-white/60 hover:text-white py-2">Features</a>
                <a href="#pricing" className="text-sm text-white/60 hover:text-white py-2">Pricing</a>
                <a href="#docs" className="text-sm text-white/60 hover:text-white py-2">Docs</a>
                <Link to="/login" className="text-sm text-white/60 hover:text-white py-2">Sign In</Link>
                <Link to="/signup" className="text-sm px-4 py-2 rounded-lg bg-risk-600 text-center font-medium mt-2">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative pt-20">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-risk-500/50 to-transparent" />

          {/* Ambient glow */}
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] -translate-y-1/2 rounded-full blur-[150px] bg-risk-900/40" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] bg-risk-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-risk-500/10 border border-risk-500/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-risk-500 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-risk-400 uppercase">
                  Enterprise Risk Intelligence
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-display font-bold leading-[1.1] tracking-tight mb-6">
                <span className="text-white">Manage risks</span>
                <br />
                <span className="text-white">with </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-risk-400 to-risk-600">intelligence</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base lg:text-lg text-white/50 max-w-md mb-8 leading-relaxed">
                The enterprise risk intelligence platform for modern organizations.
                Discover insights, identify threats, assess impact,
                and deliver resilience.
              </p>

              {/* Email Form */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-risk-500/50 focus:ring-2 focus:ring-risk-500/20 transition-all"
                />
                <Link to="/signup" className="w-full sm:w-auto">
                  <button className="w-full px-6 py-3.5 bg-white text-black font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-white/90 transition-all group shadow-lg shadow-white/10">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </div>

              {/* Sub-text */}
              <p className="text-sm text-white/30 mb-10">
                Free to start. No credit card required.
              </p>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-risk-500" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-risk-500" />
                  <span>Real-time Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-risk-500" />
                  <span>Smart Alerts</span>
                </div>
              </div>
            </div>

            {/* Right - 3D Cube Visual */}
            <div className="relative flex items-center justify-center">
              {/* The 3D Cube */}
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px]">
                {/* Cube glow effect */}
                <div className="absolute inset-0 rounded-3xl blur-[80px] bg-risk-800/30 animate-pulse" style={{ animationDuration: '4s' }} />

                {/* CSS 3D Cube with animation */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
                  <div
                    className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 animate-spin"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'rotateX(-15deg) rotateY(-25deg)',
                      animationDuration: '20s',
                      animationTimingFunction: 'linear',
                    }}
                  >
                    {/* Front face */}
                    <div
                      className="absolute inset-0 border border-risk-700/50 bg-gradient-to-br from-risk-900/90 via-risk-800/70 to-risk-950/90 backdrop-blur-sm"
                      style={{
                        transform: 'translateZ(80px) sm:translateZ(96px) lg:translateZ(128px)',
                        boxShadow: 'inset 0 0 60px rgba(185, 28, 28, 0.2)',
                      }}
                    />
                    {/* Back face */}
                    <div
                      className="absolute inset-0 border border-risk-900/30 bg-risk-950/90"
                      style={{ transform: 'translateZ(-80px) sm:translateZ(-96px) lg:translateZ(-128px)' }}
                    />
                    {/* Right face */}
                    <div
                      className="absolute inset-0 border border-risk-800/40 bg-gradient-to-l from-risk-800/50 to-risk-950/80"
                      style={{
                        transform: 'rotateY(90deg) translateZ(80px) sm:translateZ(96px) lg:translateZ(128px)',
                        boxShadow: 'inset 0 0 40px rgba(185, 28, 28, 0.15)',
                      }}
                    />
                    {/* Left face */}
                    <div
                      className="absolute inset-0 border border-risk-900/30 bg-risk-950/80"
                      style={{ transform: 'rotateY(-90deg) translateZ(80px) sm:translateZ(96px) lg:translateZ(128px)' }}
                    />
                    {/* Top face */}
                    <div
                      className="absolute inset-0 border border-risk-700/60 bg-gradient-to-b from-risk-700/30 via-risk-800/40 to-risk-900/50"
                      style={{
                        transform: 'rotateX(90deg) translateZ(80px) sm:translateZ(96px) lg:translateZ(128px)',
                        boxShadow: 'inset 0 0 80px rgba(220, 38, 38, 0.2)',
                      }}
                    />
                    {/* Bottom face */}
                    <div
                      className="absolute inset-0 border border-risk-900/30 bg-risk-950/90"
                      style={{ transform: 'rotateX(-90deg) translateZ(80px) sm:translateZ(96px) lg:translateZ(128px)' }}
                    />
                  </div>
                </div>

                {/* Floating icons around cube */}
                <div className="absolute top-4 right-4 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm animate-bounce" style={{ animationDuration: '3s' }}>
                  <Brain className="w-5 h-5 text-risk-400" />
                </div>
                <div className="absolute bottom-8 left-4 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                  <BarChart3 className="w-5 h-5 text-risk-400" />
                </div>
                <div className="absolute top-1/2 right-0 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <Shield className="w-5 h-5 text-risk-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Everything you need for <span className="text-risk-500">risk management</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Powerful features to identify, assess, and mitigate risks across your organization.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Risk Register', desc: 'Centralized risk tracking and management' },
              { icon: BarChart3, title: 'Analytics', desc: 'Real-time dashboards and insights' },
              { icon: Bell, title: 'Smart Alerts', desc: 'Automated notifications and escalations' },
              { icon: Brain, title: 'AI Advisor', desc: 'Intelligent recommendations and analysis' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-risk-500/30 hover:bg-white/[0.04] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-risk-500/10 flex items-center justify-center mb-4 group-hover:bg-risk-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-risk-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-risk-500" />
            <span className="font-semibold">Lumina R</span>
            <span className="text-white/30 text-sm">• Part of the Lumina Family</span>
          </div>
          <p className="text-sm text-white/30">© 2025 Lumina R. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
