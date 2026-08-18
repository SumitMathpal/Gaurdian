import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Auth from './components/Auth';
import RegisterPerson from './components/RegisterPerson';
import Scanner from './components/Scanner';
import Dashboard from './components/Dashboard';
import { Shield, Eye, Database, HelpCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('guardian_token') || '');
  const [view, setView] = useState('home'); // home, scan, auth, register-person, dashboard
  const [authChecking, setAuthChecking] = useState(false);

  // Authenticate user on mount if token exists OR if passed in query params
  useEffect(() => {
    const fetchUserData = async (tokenToUse) => {
      setAuthChecking(true);
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${tokenToUse}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setToken(tokenToUse);
          localStorage.setItem('guardian_token', tokenToUse);
          localStorage.setItem('guardian_user', JSON.stringify(userData));
          setView('dashboard');
        } else {
          // Token expired or invalid
          handleLogout();
        }
      } catch (err) {
        console.error('Error authenticating with token', err);
      } finally {
        setAuthChecking(false);
      }
    };

    // Check query parameters for redirected OAuth tokens
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('access_token');

    if (tokenParam) {
      // Clean query parameters from browser URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserData(tokenParam);
    } else {
      const storedToken = localStorage.getItem('guardian_token');
      if (storedToken) {
        fetchUserData(storedToken);
      }
    }
  }, []);

  const handleLoginSuccess = (newToken, userData) => {
    localStorage.setItem('guardian_token', newToken);
    localStorage.setItem('guardian_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('guardian_token');
    localStorage.removeItem('guardian_user');
    setToken('');
    setUser(null);
    setView('home');
  };

  // Safe router wrapper
  const renderView = () => {
    if (authChecking) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-t-red-600 border-zinc-800 rounded-full animate-spin"></div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-500 mt-4">Verifying Biometric Access Token...</span>
        </div>
      );
    }

    switch (view) {
      case 'scan':
        return <Scanner />;
      case 'auth':
        return <Auth onLoginSuccess={handleLoginSuccess} setView={setView} />;
      case 'register-person':
        return user ? (
          <RegisterPerson token={token} setView={setView} user={user} />
        ) : (
          <Auth onLoginSuccess={handleLoginSuccess} setView={setView} />
        );
      case 'dashboard':
        return user ? (
          <Dashboard user={user} token={token} setView={setView} />
        ) : (
          <Auth onLoginSuccess={handleLoginSuccess} setView={setView} />
        );
      case 'home':
      default:
        return <Hero setView={setView} user={user} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b]">
      {/* Top Warning Ribbon */}
      <div className="bg-red-950/60 border-b border-red-900/60 px-4 py-2 text-center">
        <p className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#ef4444] uppercase flex items-center justify-center gap-1.5 leading-none">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
          GUARDIAN EMERGENCY DEPLOYMENT UNIT • MUNICIPAL COOPERATIVE SUITE v1.02
        </p>
      </div>

      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        setView={setView} 
        activeView={view} 
      />

      <main className="flex-grow p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {renderView()}
      </main>

      {/* Corporate Technical Footer */}
      <footer className="bg-black border-t border-zinc-900 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                G
              </div>
              <span className="font-extrabold tracking-tight text-white font-sans">
                GUARDIAN<span className="text-red-505 font-medium">.AI</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              An artificial-intelligence driven indexing system utilizing facial landmark alignment and hyper-dimensional vector databases to map and query records of missing citizens.
            </p>
            <div className="text-[10px] text-zinc-650 font-mono">
              © {new Date().getFullYear()} Guardian AI Systems. All rights secured.
            </div>
          </div>

          {/* Quick Jumps */}
          <div>
            <h4 className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-400 mb-4">operational menu</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setView('home')} className="text-zinc-500 hover:text-white transition-colors focus:outline-none">
                  Overview Landing
                </button>
              </li>
              <li>
                <button onClick={() => setView('scan')} className="text-zinc-500 hover:text-white transition-colors focus:outline-none">
                  Biometric Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setView(user ? 'register-person' : 'auth')} className="text-zinc-500 hover:text-white transition-colors focus:outline-none">
                  Registry Lodging
                </button>
              </li>
              <li>
                <button onClick={() => setView(user ? 'dashboard' : 'auth')} className="text-zinc-500 hover:text-white transition-colors focus:outline-none">
                  Guardian Console
                </button>
              </li>
            </ul>
          </div>

          {/* System status details */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-400">Security Telemetry</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Vector Engine:</span>
                <span className="text-mono text-[10px] text-emerald-500 font-bold bg-emerald-950/20 px-1.5 py-0.5 border border-emerald-900/40 rounded">QDRANT MATCHING OK</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Node Sync:</span>
                <span className="text-mono text-[10px] text-emerald-500 font-bold bg-emerald-950/20 px-1.5 py-0.5 border border-emerald-900/40 rounded">SECURED HTTPS</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Enforcement:</span>
                <span className="text-mono text-[10px] text-[#ef4444] font-bold bg-red-955/20 px-1.5 py-0.5 border border-red-900/35 rounded">RESTRICTED USE ONLY</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
