import React from 'react';
import { CivicCategory } from '../types/index.js';
import {
  AlertTriangle,
  Trash2,
  Droplets,
  Lightbulb,
  OctagonAlert,
  Building2,
  Layers,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: CivicCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
}) => {
  const getCategoryDetails = (cat: CivicCategory) => {
    switch (cat) {
      case 'Road Damage / Pothole':
        return {
          icon: AlertTriangle,
          classes: 'bg-amber-50 text-amber-900 border-amber-300',
          accent: 'text-amber-600',
        };
      case 'Garbage / Waste':
        return {
          icon: Trash2,
          classes: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          accent: 'text-emerald-600',
        };
      case 'Drainage / Waterlogging':
        return {
          icon: Droplets,
          classes: 'bg-cyan-50 text-cyan-900 border-cyan-300',
          accent: 'text-cyan-600',
        };
      case 'Streetlight Problem':
        return {
          icon: Lightbulb,
          classes: 'bg-yellow-50 text-yellow-900 border-yellow-300',
          accent: 'text-yellow-600',
        };
      case 'Traffic / Road Sign Issue':
        return {
          icon: OctagonAlert,
          classes: 'bg-purple-50 text-purple-900 border-purple-300',
          accent: 'text-purple-600',
        };
      case 'Public Infrastructure Damage':
        return {
          icon: Building2,
          classes: 'bg-indigo-50 text-indigo-900 border-indigo-300',
          accent: 'text-indigo-600',
        };
      case 'Other Civic Issue':
      default:
        return {
          icon: Layers,
          classes: 'bg-slate-100 text-slate-900 border-slate-300',
          accent: 'text-slate-600',
        };
    }
  };

  const { icon: Icon, classes, accent } = getCategoryDetails(category);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border shadow-2xs whitespace-nowrap ${classes} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={`w-3.5 h-3.5 shrink-0 ${accent}`} />}
      <span>{category}</span>
    </span>
  );
};
