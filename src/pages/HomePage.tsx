import React from 'react';
import {
  ShieldAlert,
  Camera,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { CIVIC_CATEGORIES } from '../../ml/categories.js';
import { CategoryBadge } from '../components/CategoryBadge.js';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  stats?: {
    totalReports: number;
    resolvedReports: number;
    pendingReports: number;
  };
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, stats }) => {
  const workflowSteps = [
    {
      step: '01',
      title: 'Upload',
      desc: 'Capture or upload photo of road damage, garbage, or civic hazard.',
      icon: Camera,
    },
    {
      step: '02',
      title: 'Analyze',
      desc: 'Input description and location; preprocessing prepares imagery.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Classify',
      desc: 'Machine-learning engine scores visual features and returns probabilities.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'Report',
      desc: 'Review predicted category and confidence before generating a complaint ID.',
      icon: FileCheck2,
    },
    {
      step: '05',
      title: 'Track',
      desc: 'Follow audit timeline from triage to field crew dispatch and resolution.',
      icon: CheckCircle2,
    },
  ];

  const features = [
    {
      icon: Cpu,
      title: 'AI-Based Classification',
      desc: 'Deep multimodal and feature-heuristic classifiers identify problem domains without manual clerk intervention.',
      accent: 'border-emerald-200 bg-emerald-50/50 text-emerald-800',
    },
    {
      icon: Camera,
      title: 'Image-Based Detection',
      desc: 'Computer vision evaluates street potholes, dumping spots, waterlogging, or damaged signage instantly.',
      accent: 'border-blue-200 bg-blue-50/50 text-blue-800',
    },
    {
      icon: Zap,
      title: 'Faster Reporting',
      desc: 'Reduced friction: Citizens report problems in seconds with automatic departmental routing.',
      accent: 'border-amber-200 bg-amber-50/50 text-amber-800',
    },
    {
      icon: TrendingUp,
      title: 'Issue Tracking',
      desc: 'Transparent 5-stage status lifecycle from initial report to verified municipal resolution.',
      accent: 'border-indigo-200 bg-indigo-50/50 text-indigo-800',
    },
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
        {/* Subtle decorative background blur */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-6">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>Smart City Infrastructure Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Smart Civic Issue Detection
          </h1>

          <p className="text-lg sm:text-xl font-medium text-emerald-300 mb-4">
            AI-powered identification and reporting of civic issues
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Report civic problems using images and descriptions. Our machine-learning system
            automatically identifies the issue category and helps organize civic complaints efficiently.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('report')}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 font-semibold text-sm px-5 py-3.5 rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <span>Live Operations Dashboard</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 pt-8 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {stats ? stats.totalReports : '6+'}
              </div>
              <p className="text-xs text-slate-400 font-medium">Logged Civic Reports</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {stats ? stats.resolvedReports : '2'}
              </div>
              <p className="text-xs text-slate-400 font-medium">Verified Resolutions</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                7
              </div>
              <p className="text-xs text-slate-400 font-medium">Automated Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Intelligent Public Grievance Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Engineered to replace slow manual paper routing with instant vision classification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${feat.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Operational Lifecycle
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            5-Step Automated Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            How citizen observations transition into scheduled municipal work orders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 rounded-2xl p-5 border border-slate-200/80 hover:border-emerald-300 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {step.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-normal">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Civic Issue Categories Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Standardized Schema
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Supported Civic Problem Categories
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Our ML model classifies visual reports into these distinct municipal domains with departmental dispatch mapping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CIVIC_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <CategoryBadge category={cat.name} size="sm" />
                <span className="text-[11px] font-mono text-slate-500">
                  SLA: {cat.slaHours}h
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {cat.description}
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Dept:</span>
                <span className="font-medium text-slate-700 truncate">{cat.department}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="rounded-2xl bg-slate-900 text-white p-8 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
          Ready to report a civic issue in your neighborhood?
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
          Take a photo, upload it here, and let the smart classifier route it directly to the responsible municipal department.
        </p>
        <button
          onClick={() => onNavigate('report')}
          className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Start Civic Issue Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
