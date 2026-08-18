import React from 'react';
import { Camera, FileText, ArrowRight, ShieldAlert, Cpu, HeartHandshake } from 'lucide-react';

export default function Hero({ setView, user }) {
  return (
    <div className="relative overflow-hidden bg-black py-16 sm:py-24 border-b border-zinc-900">
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-red-500"></div>
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-red-500"></div>
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-red-500"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-red-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-red-950/40 border border-red-900/60 mb-6 animate-pulse">
            <ShieldAlert size={14} className="text-red-500" />
            <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
              COMMUNITY SCANNING PIPELINE INTERFACE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase">
            REUNITING FAMILIES WITH <span className="text-red-600 block sm:inline">AI PRECISION</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            Guardian AI provides real-time vector embedding verification to scan and identify missing persons. Scan captured faces instantly or register a missing report with absolute confidentiality.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={() => setView('scan')}
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold tracking-wider uppercase text-xs rounded transition-all flex items-center justify-center gap-2 border border-red-500 focus:outline-none"
            >
              <Camera size={16} />
              Open Citizen Scanner
            </button>
            <button 
              onClick={() => setView(user ? 'register-person' : 'auth')}
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold tracking-wider uppercase text-xs rounded transition-all flex items-center justify-center gap-2 focus:outline-none"
            >
              <FileText size={16} />
              {user ? 'Register Missing Report' : 'Sign In as Guardian'}
            </button>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-6">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded relative group hover:border-red-900/50 transition-all">
            <div className="w-10 h-10 rounded bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-500 mb-4 font-bold">
              <Cpu size={20} />
            </div>
            <h3 className="text-white text-base font-bold uppercase mb-2">Vector Matching Model</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Leverages high-dimensional face embeddings computed on the fly, stored securely in a dedicated Qdrant vector index database.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded relative group hover:border-red-900/50 transition-all">
            <div className="w-10 h-10 rounded bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-500 mb-4 font-bold">
              <Camera size={20} />
            </div>
            <h3 className="text-white text-base font-bold uppercase mb-2">Citizen-Facing Scan</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enables regular citizens or government agencies to run matching query scans on any desktop or mobile device.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded relative group hover:border-red-900/50 transition-all">
            <div className="w-10 h-10 rounded bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-500 mb-4 font-bold">
              <HeartHandshake size={20} />
            </div>
            <h3 className="text-white text-base font-bold uppercase mb-2">Secure Connection</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Directly and securely routes matched data points to parent or guardian records, protecting identities and private fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
