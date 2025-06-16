import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../../components/ui/Logo';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operatorSites, setOperatorSites] = useState<{ site_id: string; site_name: string }[]>([]);
  const { login, sites, requiresSiteSelection } = useAuth();
  const navigate = useNavigate();

  // When email changes, reset selected site and update operatorSites if email matches
  useEffect(() => {
    setSelectedSite('');
    if (email && sites && requiresSiteSelection) {
      setOperatorSites(sites);
    } else {
      setOperatorSites([]);
    }
  }, [email, sites, requiresSiteSelection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    // For operator, site must be selected
    if (requiresSiteSelection && !selectedSite) {
      toast.error('Please select a site');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password, selectedSite);
      // navigation handled inside login function
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo login buttons for convenience
  const loginAsDemo = async (role: 'admin' | 'operator') => {
    setIsSubmitting(true);
    try {
      if (role === 'admin') {
        await login('admin@aquaguard.com', 'admin123');
      } else {
        if (!selectedSite) {
          toast.error('Please select a site first');
          setIsSubmitting(false);
          return;
        }
        await login('operator@aquaguard.com', 'operator123', selectedSite);
      }
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Something went wrong with demo login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side - Login form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-12">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-block">
              <Logo />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-600">
              Monitor and manage your STP plants with real-time data and alerts
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail size={16} className="text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border border-slate-300 py-2 pl-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Show site dropdown only if user is operator and sites are provided */}
                {requiresSiteSelection && operatorSites.length > 0 && (
                  <div>
                    <label htmlFor="site" className="block text-sm font-medium text-slate-700">
                      Select Plant
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Building size={16} className="text-slate-400" />
                      </div>
                      <select
                        id="site"
                        name="site"
                        value={selectedSite}
                        onChange={(e) => setSelectedSite(e.target.value)}
                        className="block w-full rounded-md border border-slate-300 py-2 pl-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="">Select a plant</option>
                        {operatorSites.map((site) => (
                          <option key={site.site_id} value={site.site_id}>
                            {site.site_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock size={16} className="text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border border-slate-300 py-2 pl-10 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex w-full justify-center rounded-md border border-transparent bg-primary-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>

              {/* Demo login buttons */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-slate-50 px-2 text-slate-500">Demo login</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => loginAsDemo('operator')}
                    disabled={isSubmitting}
                    className="flex justify-center rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Login as Operator
                  </button>
                  <button
                    type="button"
                    onClick={() => loginAsDemo('admin')}
                    disabled={isSubmitting}
                    className="flex justify-center rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Login as Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Hero image */}
      <div className="hidden relative w-1/2 lg:block">
        <div className="absolute inset-0 flex h-full items-center justify-center bg-primary-700">
          <div className="max-w-2xl px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Techjar STP Monitoring</h2>
            <p className="text-lg mb-8">
              Revolutionizing sewage treatment plant monitoring with advanced OCR, AI-powered water quality analysis, and real-time alerts.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-1">OCR Technology</h3>
                <p className="text-sm">Extract readings from flowmeters automatically</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-1">AI Analysis</h3>
                <p className="text-sm">Classify water quality with machine learning</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-1">Real-time Alerts</h3>
                <p className="text-sm">Instant notifications for critical issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
