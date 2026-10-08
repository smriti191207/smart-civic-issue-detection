import React from 'react';
import { PredictionItem } from '../types/index.js';

interface ConfidenceMeterProps {
  confidence: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  predictions?: PredictionItem[];
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  showLabel = true,
  size = 'md',
  predictions,
}) => {
  const normalized = Math.min(Math.max(confidence, 0), 100);

  const getColorClass = (val: number) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 70) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  const getTextColorClass = (val: number) => {
    if (val >= 85) return 'text-emerald-700';
    if (val >= 70) return 'text-amber-700';
    return 'text-blue-700';
  };

  const barHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-slate-600">Model Confidence</span>
          <span className={`font-bold font-mono ${getTextColorClass(normalized)}`}>
            {normalized}%
          </span>
        </div>
      )}

      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${barHeights[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColorClass(normalized)}`}
          style={{ width: `${normalized}%` }}
        />
      </div>

      {predictions && predictions.length > 1 && (
        <div className="pt-2 mt-2 border-t border-slate-100 space-y-1.5">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Probability Distribution
          </p>
          {predictions.slice(0, 4).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-slate-600">
              <span className="truncate pr-2">{item.category}</span>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-slate-400 h-full rounded-full"
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>
                <span className="font-mono text-slate-700 w-8 text-right font-medium">
                  {item.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
