import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  Loader2,
  CheckCircle,
  TrendingUp,
  Lock,
} from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithGitHub } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo, accept any email/password
      if (email && password) {
        // Check if admin login
        const isAdmin = email.toLowerCase().includes('admin');
        login({
          email,
          name: email.split('@')[0],
          role: isAdmin ? 'admin' : 'user',
          provider: 'email',
        });
        navigate('/');
      } else {
        setError('Please enter your email and password');
      }
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch {
      setError('Google login failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setError('');
    setIsGitHubLoading(true);
    try {
      await loginWithGitHub();
      navigate('/');
    } catch {
      setError('GitHub login failed. Please try again.');
    } finally {
      setIsGitHubLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

        <div className="max-w-md w-full mx-auto relative z-10">
          {/* Logo */}
          <Link to="/landing" className="inline-block mb-10 group">
            <Logo />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Access your risk intelligence dashboard and continue protecting what matters most.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-500 text-xs">!</span>
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900
                         placeholder-slate-400 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-risk-500/20 focus:border-risk-500
                         hover:border-slate-300 hover:shadow-md
                         transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-risk-600 hover:text-risk-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900
                           placeholder-slate-400 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-risk-500/20 focus:border-risk-500
                           hover:border-slate-300 hover:shadow-md
                           transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600
                           p-1 rounded-lg hover:bg-slate-100 transition-all duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-risk-600 focus:ring-risk-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
                Keep me signed in for 30 days
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-risk-500/20 hover:shadow-xl hover:shadow-risk-500/30
                       hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              isLoading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-slate-50 text-sm text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isGitHubLoading || isLoading}
              className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl
                       border border-slate-200 bg-white shadow-sm
                       hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5
                       active:translate-y-0 transition-all duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span className="text-sm font-semibold text-slate-700">
                {isGoogleLoading ? 'Connecting...' : 'Google'}
              </span>
            </button>
            <button
              onClick={handleGitHubLogin}
              disabled={isGoogleLoading || isGitHubLoading || isLoading}
              className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl
                       border border-slate-200 bg-white shadow-sm
                       hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5
                       active:translate-y-0 transition-all duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isGitHubLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span className="text-sm font-semibold text-slate-700">
                {isGitHubLoading ? 'Connecting...' : 'GitHub'}
              </span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-10 text-center text-sm text-slate-500">
            New to Lumina R?{' '}
            <Link to="/signup" className="font-semibold text-risk-600 hover:text-risk-700 transition-colors">
              Start your free trial
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-risk-600 via-risk-700 to-risk-900 p-12 items-center justify-center relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-risk-500/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-risk-800/40 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative z-10 max-w-lg text-center text-white">
          {/* Icon with glassmorphism */}
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20
                        flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-black/20">
            <Shield className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-5 tracking-tight">
            Intelligent Risk Management
          </h2>
          <p className="text-lg text-risk-100/90 mb-10 leading-relaxed">
            Join over 500 enterprises using Lumina R to identify, assess, and mitigate
            business risks with AI-powered intelligence.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-col gap-4 mb-10">
            {[
              { icon: CheckCircle, text: 'SOC 2 Type II Certified' },
              { icon: TrendingUp, text: 'Real-time risk monitoring' },
              { icon: Lock, text: 'Enterprise-grade security' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3 text-risk-100/80">
                <item.icon className="w-5 h-5 text-risk-300" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Powered by badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-4 h-4 text-risk-300" />
            <span className="text-sm font-medium text-risk-100">Powered by Lumina Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
