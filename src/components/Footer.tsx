import React from 'react';
import { ShieldCheck, Heart, Terminal, Database, Cpu } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
                C
              </div>
              <span>Smart Civic Issue Detection</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              ML-based civic issue reporting and computer-vision classification platform for automated municipal triage.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              API & Classifier Online
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Platform Modules
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition"
                >
                  Citizen Landing Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-white transition"
                >
                  File Civic Complaint
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-reports')}
                  className="hover:text-white transition"
                >
                  Complaint Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition"
                >
                  Operations Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Academic ML Notice */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Machine Learning Architecture
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Structured with modular classification contracts. Supports Gemini Multimodal Vision, TensorFlow.js, PyTorch, and local feature heuristics without altering frontend contracts.
            </p>
          </div>

          {/* Standards & Transparency */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Scientific Transparency
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Real-time classification confidence with full probability distributions across 7 standardized civic categories. Zero fabricated benchmark metrics.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Smart Civic Issue Detection System. Open Academic Specification.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-slate-400" /> REST API v1.0
            </span>
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400" /> Persistent Storage Layer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
