import React from 'react';
import { CivicStatus, StatusHistoryItem } from '../types/index.js';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: CivicStatus;
  history?: StatusHistoryItem[];
}

const ORDERED_STEPS: CivicStatus[] = [
  'Reported',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  history = [],
}) => {
  const currentIndex = ORDERED_STEPS.indexOf(currentStatus);

  const getStepHistory = (step: CivicStatus) => {
    return [...history].reverse().find((h) => h.status === step);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Connecting horizontal line */}
        <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIndex) / (ORDERED_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps container */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {ORDERED_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;
            const stepEntry = getStepHistory(step);

            return (
              <div
                key={step}
                className="flex sm:flex-col items-start sm:items-center text-left sm:text-center group"
              >
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-white border-emerald-600 text-emerald-700 shadow-md ring-4 ring-emerald-100'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                  ) : (
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="ml-3 sm:ml-0 sm:mt-2.5">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-emerald-900 font-extrabold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </p>

                  {stepEntry && (
                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      {formatDate(stepEntry.timestamp)}
                    </p>
                  )}

                  {stepEntry?.note && (
                    <p className="text-[11px] text-slate-600 mt-1 italic hidden sm:block max-w-[130px] line-clamp-2">
                      "{stepEntry.note}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Activity Log */}
      {history.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
            Audit & Transition Log
          </h4>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex items-start justify-between text-xs bg-slate-50 p-2.5 rounded-md border border-slate-100"
              >
                <div>
                  <span className="font-semibold text-slate-800">{h.status}</span>
                  {h.note && <span className="text-slate-600 ml-1.5">— {h.note}</span>}
                  {h.updatedBy && (
                    <span className="text-[11px] text-slate-400 ml-1.5">by {h.updatedBy}</span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                  {formatDate(h.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
