import React from 'react';
import { CivicStatus } from '../types/index.js';
import {
  FileText,
  Search,
  UserCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface StatusBadgeProps {
  status: CivicStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const getStatusConfig = (st: CivicStatus) => {
    switch (st) {
      case 'Reported':
        return {
          icon: FileText,
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-400',
        };
      case 'Under Review':
        return {
          icon: Search,
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'Assigned':
        return {
          icon: UserCheck,
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-300',
          dot: 'bg-indigo-500',
        };
      case 'In Progress':
        return {
          icon: Clock,
          bg: 'bg-blue-50 text-blue-900 border-blue-300',
          dot: 'bg-blue-600 animate-ping',
        };
      case 'Resolved':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
        };
      default:
        return {
          icon: FileText,
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs whitespace-nowrap ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{status}</span>
    </span>
  );
};
