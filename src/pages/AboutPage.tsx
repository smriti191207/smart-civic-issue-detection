import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  Code2,
  CheckCircle2,
  Database,
  ArrowRight,
  Server,
  BookOpen,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import { CIVIC_CATEGORIES } from '../../ml/categories.js';

export const AboutPage: React.FC = () => {
  const objectives = [
    'Automate civic issue classification using computer vision and multimodal reasoning.',
    'Reduce manual classification effort and routing delays in municipal triage centers.',
    'Improve reporting efficiency for citizens by requiring only an image and brief context.',
    'Organize civic complaints into standard categories with SLA and departmental tracking.',
    'Support faster identification of public infrastructure problems before hazards escalate.',
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/classify',
      desc: 'Accepts base64 image and description, executes ML inference, returns predicted category, confidence, and top probabilities.',
    },
    {
      method: 'POST',
      path: '/api/reports',
      desc: 'Creates a validated civic issue report, assigns unique Report ID, initializes status to "Reported", and commits to storage.',
    },
    {
      method: 'GET',
      path: '/api/reports',
      desc: 'Fetches reports with filtering by status, category, date, and text search.',
    },
    {
      method: 'GET',
      path: '/api/reports/:id',
      desc: 'Retrieves complete report details, including verified image URL and full status transition history.',
    },
    {
      method: 'PUT',
      path: '/api/reports/:id/status',
      desc: 'Updates report lifecycle state (Reported → Under Review → Assigned → In Progress → Resolved) and appends audit note.',
    },
    {
      method: 'GET',
      path: '/api/stats',
      desc: 'Provides aggregated statistics, category distributions, and lifecycle counts for the operations dashboard.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-12">
      {/* Title & Description Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>System Documentation & Academic Overview</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Smart Civic Issue Detection
        </h1>

        <p className="text-base sm:text-lg text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-5 rounded-2xl">
          <strong>Smart Civic Issue Detection</strong> is a machine-learning-based system designed to
          identify and classify common civic problems from reported images/data. The system aims to make
          civic issue reporting more efficient by automatically recognizing the type of problem and
          organizing reports for easier management.
        </p>
      </div>

      {/* Project Objectives */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-600" />
          Project Objectives
        </h2>
        <ul className="grid grid-cols-1 gap-3 pt-2">
          {objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Project Architecture */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Project Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Standard layered decoupled design isolating UI presentation, REST API routing, machine learning classifiers, and data persistence.
          </p>
        </div>

        {/* ASCII / Visual Flow Diagram */}
        <div className="bg-slate-900 text-emerald-400 p-6 rounded-2xl font-mono text-xs overflow-x-auto shadow-md space-y-2">
          <p className="text-slate-400 text-[11px] font-sans pb-2 border-b border-slate-800">
            System Dataflow Architecture:
          </p>
          <div className="space-y-1">
            <p className="text-white font-bold">Citizen Web Client (React + TypeScript)</p>
            <p className="text-slate-500">       │ [Upload photo + description]</p>
            <p className="text-emerald-300">       ▼</p>
            <p className="text-white font-bold">Node.js Express REST Backend (/api/*)</p>
            <p className="text-slate-500">       │ [Input validation & MIME checks]</p>
            <p className="text-emerald-300">       ▼</p>
            <p className="text-white font-bold">Classification Service Interface (ICivicClassifier)</p>
            <p className="text-slate-500">       ├─► [Primary]: Gemini 3.8 Flash Multimodal Vision</p>
            <p className="text-slate-500">       └─► [Fallback]: Feature Heuristic Classifier (Demo Mode)</p>
            <p className="text-emerald-300">       ▼</p>
            <p className="text-white font-bold">Prediction Output (Category, Confidence, Probabilities)</p>
            <p className="text-slate-500">       │ [Citizen verification & submission]</p>
            <p className="text-emerald-300">       ▼</p>
            <p className="text-white font-bold">Persistent Storage Layer (ReportStore)</p>
            <p className="text-slate-500">       │ [Status lifecycle & transition audits]</p>
            <p className="text-emerald-300">       ▼</p>
            <p className="text-white font-bold">Municipal Operations Dashboard & Analytics</p>
          </div>
        </div>
      </div>

      {/* ML Model Swappability Guide */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Connecting a Custom Trained ML Model
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The classification module is built with an explicit object-oriented interface (<code>ICivicClassifier</code>) so that developers can plug in custom weights from PyTorch, TensorFlow, TensorFlow.js, or an external microservice without touching UI components.
        </p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
          <p className="text-emerald-800 font-bold font-sans text-xs">
            How to plug in a custom PyTorch / TensorFlow.js model:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
            <li>Create a new file in <code>ml/classifier/customModelClassifier.ts</code>.</li>
            <li>Implement <code>ICivicClassifier</code> with <code>classify(input: ClassificationInput): Promise&lt;ClassificationResult&gt;</code>.</li>
            <li>Preprocess image tensor (e.g. resize to 224x224, normalize RGB values).</li>
            <li>Run forward pass: <code>const logits = await model.predict(tensor);</code></li>
            <li>Apply softmax function to produce probabilities across all 7 categories.</li>
            <li>Export the instance in <code>ml/classifier/index.ts</code>.</li>
          </ol>
        </div>
      </div>

      {/* REST API Reference */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-600" />
          REST API Specifications
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Clean decoupled endpoints adhering to standard HTTP semantics.
        </p>

        <div className="space-y-3 pt-2">
          {apiEndpoints.map((ep, i) => (
            <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    ep.method === 'POST'
                      ? 'bg-blue-100 text-blue-800'
                      : ep.method === 'PUT'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">{ep.path}</span>
              </div>
              <p className="text-xs text-slate-600">{ep.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Transparency & Academic Disclaimer */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-2">
        <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          Scientific Transparency Statement
        </h3>
        <p className="text-xs text-emerald-900 leading-relaxed">
          This system adheres strictly to honest evaluation standards. In production with a Google Gemini API key configured, the system utilizes multimodal neural zero-shot vision. In offline environments without an API key, the system executes an isolated development feature-heuristic classifier with honest probability scaling, without claiming fabricated benchmark accuracies.
        </p>
      </div>
    </div>
  );
};
