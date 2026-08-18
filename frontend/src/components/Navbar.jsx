import React from 'react';
import { Shield, LogOut, User, Menu, X, Landmark } from 'lucide-react';

export default function Navbar({ user, onLogout, setView, activeView }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Branding */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => { setView('home'); setIsOpen(false); }}
        >
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold tracking-wider group-hover:bg-red-700 transition-colors">
            G
          </div>
          <div>
            <div className="font-extrabold tracking-tight text-white flex items-center gap-1.5 text-lg">
              GUARDIAN<span className="text-red-500 font-medium">.AI</span>
            </div>
            <div className="text-[10px] text-zinc-400 tracking-wider uppercase font-semibold">Missing Persons Pipeline</div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setView('home')} 
            className={`text-sm font-medium transition-colors ${activeView === 'home' ? 'text-red-500' : 'text-zinc-300 hover:text-white'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView('scan')} 
            className={`text-sm font-medium transition-colors ${activeView === 'scan' ? 'text-red-500' : 'text-zinc-300 hover:text-white'}`}
          >
            Citizen Scan Portal
          </button>
          {user ? (
            <>
              <button 
                onClick={() => setView('register-person')} 
                className={`text-sm font-medium transition-colors ${activeView === 'register-person' ? 'text-red-500' : 'text-zinc-300 hover:text-white'}`}
              >
                Register Missing Person
              </button>
              <button 
                onClick={() => setView('dashboard')} 
                className={`text-sm font-medium transition-colors ${activeView === 'dashboard' ? 'text-red-500' : 'text-zinc-300 hover:text-white'}`}
              >
                Guardian Console
              </button>
            </>
          ) : (
            <button 
              onClick={() => setView('auth')} 
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Guardian Login
            </button>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-zinc-400 font-mono">SECURE PIPELINE ACTIVE</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
                <User size={16} className="text-red-500" />
                <span className="text-sm font-medium text-white">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setView('auth')}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 rounded transition-all focus:outline-none"
            >
              Access Console
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-zinc-400 font-mono">ACTIVE</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-400 hover:text-white focus:outline-none p-1"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-zinc-800 flex flex-col gap-3">
          <button 
            onClick={() => { setView('home'); setIsOpen(false); }}
            className={`text-left px-3 py-2 rounded text-sm font-medium ${activeView === 'home' ? 'bg-red-500/10 text-red-500' : 'text-zinc-300 hover:bg-zinc-900'}`}
          >
            Home
          </button>
          <button 
            onClick={() => { setView('scan'); setIsOpen(false); }}
            className={`text-left px-3 py-2 rounded text-sm font-medium ${activeView === 'scan' ? 'bg-red-500/10 text-red-500' : 'text-zinc-300 hover:bg-zinc-900'}`}
          >
            Citizen Scan Portal
          </button>
          {user ? (
            <>
              <button 
                onClick={() => { setView('register-person'); setIsOpen(false); }}
                className={`text-left px-3 py-2 rounded text-sm font-medium ${activeView === 'register-person' ? 'bg-red-500/10 text-red-500' : 'text-zinc-300 hover:bg-zinc-900'}`}
              >
                Register Missing Person
              </button>
              <button 
                onClick={() => { setView('dashboard'); setIsOpen(false); }}
                className={`text-left px-3 py-2 rounded text-sm font-medium ${activeView === 'dashboard' ? 'bg-red-500/10 text-red-500' : 'text-zinc-300 hover:bg-zinc-900'}`}
              >
                Guardian Console
              </button>
              <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-red-500" />
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                </div>
                <button
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => { setView('auth'); setIsOpen(false); }}
              className="text-center mt-2 w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 rounded transition-all"
            >
              Access Console
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
