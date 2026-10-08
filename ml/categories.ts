import { CivicCategory } from '../src/types/index.js';

export interface CategoryMetadata {
  id: string;
  name: CivicCategory;
  shortLabel: string;
  description: string;
  keywords: string[];
  department: string;
  slaHours: number;
  color: {
    bg: string;
    text: string;
    border: string;
    accent: string;
  };
}

export const CIVIC_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'road_damage',
    name: 'Road Damage / Pothole',
    shortLabel: 'Road Damage',
    description: 'Potholes, asphalt cracks, uneven road surfaces, loose gravel, or cave-ins.',
    keywords: ['pothole', 'road', 'asphalt', 'crack', 'tar', 'tarmac', 'crater', 'street', 'pavement', 'rut', 'bump'],
    department: 'Roads & Highway Maintenance',
    slaHours: 48,
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      accent: '#f59e0b',
    },
  },
  {
    id: 'garbage_waste',
    name: 'Garbage / Waste',
    shortLabel: 'Garbage / Waste',
    description: 'Overflowing dumpsters, illegal trash dumping, discarded litter, or hazardous waste.',
    keywords: ['garbage', 'trash', 'waste', 'dump', 'bin', 'dumpster', 'rubbish', 'litter', 'debris', 'plastic', 'refuse'],
    department: 'Solid Waste Management',
    slaHours: 24,
    color: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      accent: '#10b981',
    },
  },
  {
    id: 'drainage_waterlogging',
    name: 'Drainage / Waterlogging',
    shortLabel: 'Drainage / Water',
    description: 'Clogged storm drains, flooded roadways, stagnant rainwater, or sewage overflow.',
    keywords: ['drain', 'drainage', 'water', 'flood', 'waterlogging', 'puddle', 'sewage', 'clogged', 'gutter', 'pipe', 'overflow'],
    department: 'Stormwater & Drainage Dept',
    slaHours: 36,
    color: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-200',
      accent: '#06b6d4',
    },
  },
  {
    id: 'streetlight_problem',
    name: 'Streetlight Problem',
    shortLabel: 'Streetlight',
    description: 'Broken lamp posts, non-functional bulbs, exposed wiring, or dark intersections.',
    keywords: ['streetlight', 'light', 'lamp', 'pole', 'dark', 'bulb', 'lighting', 'wire', 'illumination', 'fixture'],
    department: 'Municipal Electrical Services',
    slaHours: 24,
    color: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      accent: '#eab308',
    },
  },
  {
    id: 'traffic_road_sign',
    name: 'Traffic / Road Sign Issue',
    shortLabel: 'Traffic Signs',
    description: 'Damaged or missing stop signs, malfunctioning traffic signals, obscured road markings.',
    keywords: ['traffic', 'sign', 'signal', 'stop sign', 'traffic light', 'zebra crossing', 'marking', 'board', 'indicator'],
    department: 'Traffic Safety & Signals',
    slaHours: 24,
    color: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      accent: '#a855f7',
    },
  },
  {
    id: 'public_infrastructure',
    name: 'Public Infrastructure Damage',
    shortLabel: 'Public Infra',
    description: 'Broken park benches, damaged pedestrian railings, collapsed boundary walls, cracked footpaths.',
    keywords: ['bench', 'railing', 'footpath', 'sidewalk', 'curb', 'wall', 'bus stop', 'park', 'barrier', 'bridge', 'pavement'],
    department: 'Public Works Department (PWD)',
    slaHours: 72,
    color: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      accent: '#6366f1',
    },
  },
  {
    id: 'other_civic_issue',
    name: 'Other Civic Issue',
    shortLabel: 'Other Issue',
    description: 'Stray animal issues, noise nuisances, encroached walkways, or unclassified public concerns.',
    keywords: ['other', 'animal', 'noise', 'encroachment', 'tree', 'hazard', 'fallen branch', 'odor'],
    department: 'General Civic Administration',
    slaHours: 48,
    color: {
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-200',
      accent: '#64748b',
    },
  },
];

export const CATEGORY_NAMES: CivicCategory[] = CIVIC_CATEGORIES.map((c) => c.name);
