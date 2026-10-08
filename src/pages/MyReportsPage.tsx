import React, { useState } from 'react';
import { CivicReport, CivicStatus } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { CategoryBadge } from '../components/CategoryBadge.js';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ExternalLink,
  PlusCircle,
  FileQuestion,
  ChevronRight,
} from 'lucide-react';

interface MyReportsPageProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
  onNavigate: (tab: string) => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({
  reports,
  onSelectReport,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const statuses: ('All' | CivicStatus)[] = [
    'All',
    'Reported',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved',
  ];

  const filteredReports = reports.filter((r) => {
    const matchesStatus =
      statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Citizen Grievance Docket
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Civic Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track current progress, review classification details, and check field resolution status.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report')}
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by ID, area, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No reports found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm || statusFilter !== 'All'
                ? 'Try adjusting your filters or search terms.'
                : 'No reports have been submitted yet. Report your first civic issue today.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Thumbnail Image Header */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={report.imageUrl}
                    alt={report.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute(
                        'src',
                        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
                      );
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="font-mono text-xs font-bold bg-slate-900/85 text-white px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {report.id}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <StatusBadge status={report.status} size="sm" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <CategoryBadge category={report.category} size="sm" />
                      <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {report.confidence}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium line-clamp-2 mt-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 group-hover:text-emerald-700 transition">
                <span className="font-medium text-[11px]">View full audit timeline</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
