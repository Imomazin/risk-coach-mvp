import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CoverPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-risk-500 to-risk-700 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-tight">Lumina R</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#tools" className="text-sm text-white/60 hover:text-white transition-colors">
                Tools
              </a>
              <a href="#docs" className="text-sm text-white/60 hover:text-white transition-colors">
                Docs
              </a>
              <Link
                to="/dashboard"
                className="text-sm px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-risk-500/50 to-transparent" />

          {/* Ambient glow */}
          <div className="absolute top-1/2 right-1/4 w-[800px] h-[800px] -translate-y-1/2 rounded-full blur-[200px] bg-risk-900/30" />
        </div>

        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="relative z-10 pt-20 lg:pt-0">
              {/* Badge */}
              <div className="inline-block mb-8">
                <span className="text-xs font-semibold tracking-[0.2em] text-risk-400 uppercase">
                  Risk Intelligence Platform
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-display font-bold leading-[1.1] tracking-tight mb-6">
                <span className="text-white">Manage risks</span>
                <br />
                <span className="text-white">with</span>{' '}
                <span className="text-risk-500">intelligence</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-white/50 max-w-md mb-10 leading-relaxed">
                The enterprise risk intelligence platform for modern organizations.
                Discover insights, identify threats, assess impact,
                decide with confidence, and deliver resilience.
              </p>

              {/* Email Form */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-risk-500/50 focus:ring-1 focus:ring-risk-500/20 transition-all"
                />
                <Link to="/signup">
                  <button className="w-full sm:w-auto px-6 py-3.5 bg-white text-black font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-white/90 transition-all group">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </div>

              {/* Sub-text */}
              <p className="text-sm text-white/30">
                Free to start. No credit card required.
              </p>
            </div>

            {/* Right - 3D Cube Visual */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* The 3D Cube */}
              <div className="relative w-[400px] h-[400px]">
                {/* Cube glow effect */}
                <div className="absolute inset-0 rounded-3xl blur-[60px] bg-risk-900/40" />

                {/* CSS 3D Cube */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
                  <div
                    className="relative w-64 h-64"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'rotateX(-15deg) rotateY(-25deg)',
                    }}
                  >
                    {/* Front face */}
                    <div
                      className="absolute inset-0 border border-risk-800/50 bg-gradient-to-br from-risk-950 via-risk-900/80 to-risk-950"
                      style={{
                        transform: 'translateZ(128px)',
                        boxShadow: 'inset 0 0 60px rgba(127, 29, 29, 0.3)',
                      }}
                    />
                    {/* Back face */}
                    <div
                      className="absolute inset-0 border border-risk-900/30 bg-risk-950"
                      style={{ transform: 'translateZ(-128px)' }}
                    />
                    {/* Right face */}
                    <div
                      className="absolute inset-0 border border-risk-800/40 bg-gradient-to-l from-risk-900/60 to-risk-950"
                      style={{
                        transform: 'rotateY(90deg) translateZ(128px)',
                        boxShadow: 'inset 0 0 40px rgba(127, 29, 29, 0.2)',
                      }}
                    />
                    {/* Left face */}
                    <div
                      className="absolute inset-0 border border-risk-900/30 bg-risk-950"
                      style={{ transform: 'rotateY(-90deg) translateZ(128px)' }}
                    />
                    {/* Top face */}
                    <div
                      className="absolute inset-0 border border-risk-800/60 bg-gradient-to-b from-risk-800/40 via-risk-900/50 to-risk-950"
                      style={{
                        transform: 'rotateX(90deg) translateZ(128px)',
                        boxShadow: 'inset 0 0 80px rgba(153, 27, 27, 0.3)',
                      }}
                    />
                    {/* Bottom face */}
                    <div
                      className="absolute inset-0 border border-risk-900/30 bg-risk-950"
                      style={{ transform: 'rotateX(-90deg) translateZ(128px)' }}
                    />
                  </div>
                </div>

                {/* Subtle grid lines on cube */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: '1000px' }}>
                  <div
                    className="relative w-64 h-64 opacity-30"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'rotateX(-15deg) rotateY(-25deg)',
                    }}
                  >
                    {/* Grid on top face */}
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: 'rotateX(90deg) translateZ(129px)',
                        backgroundImage: `
                          linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '32px 32px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
