import React, { useState } from 'react';
import { ShieldAlert, Key, User, Mail, Phone, ArrowLeft, Loader2 } from 'lucide-react';

export default function Auth({ onLoginSuccess, setView }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password, 
          phone: formData.phone 
        };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred. Please try again.');
      }

      if (isLogin) {
        onLoginSuccess(data.access_token, data.user);
        setView('dashboard');
      } else {
        setMessage('Registration successful! You can now log in.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', phone: '' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded p-8 relative">
        {/* Accent Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 justify-center mb-4 text-red-500 bg-red-950/20 px-3 py-1 border border-red-900/40 rounded-full">
            <ShieldAlert size={14} />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">GUARDIAN CONSOLE SECURITY</span>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
            {isLogin ? 'Guardian Authentication' : 'Create Guardian Profile'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            {isLogin ? 'Provide credentials to access restricted database functions' : 'Register a new profile to manage missing reports'}
          </p>
        </div>

        {/* Errors/Messages */}
        {error && (
          <div className="mb-6 p-3 bg-red-950/20 border border-red-900/60 text-red-400 text-xs rounded font-medium">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 text-xs rounded font-medium">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-650 transition-colors"
                />
                <User size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="guardian@secured.org"
                className="w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-650 transition-colors"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">Contact Phone</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  className="w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-650 transition-colors"
                />
                <Phone size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">Secure Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-650 transition-colors"
              />
              <Key size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider text-xs rounded transition-all flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin text-black" />
            ) : isLogin ? (
              'Verify & Access'
            ) : (
              'Create Profile'
            )}
          </button>
        </form>

        {isLogin && (
          <div className="mt-4 space-y-4">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-900"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono text-zinc-550 uppercase tracking-widest">or integrate via</span>
              <div className="flex-grow border-t border-zinc-900"></div>
            </div>

            <button
              onClick={() => {
                window.location.href = 'http://localhost:8000/auth/google/login';
              }}
              type="button"
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 focus:outline-none"
            >
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {/* Toggle */}
        <div className="mt-8 text-center border-t border-zinc-900 pt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
            }}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {isLogin 
              ? 'New to pipeline? Create a profile here' 
              : 'Already have a profile? Access console'}
          </button>
        </div>
      </div>

      <button
        onClick={() => setView('home')}
        className="mt-6 flex items-center justify-center gap-1.5 mx-auto text-xs text-zinc-500 hover:text-zinc-350 transition-colors"
      >
        <ArrowLeft size={14} /> Back to homepage
      </button>
    </div>
  );
}
