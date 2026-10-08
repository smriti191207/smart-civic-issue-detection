import React, { useState, useMemo } from 'react';
import {
  CivicReport,
  CivicStatus,
  DashboardStats,
  CivicCategory,
} from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { CategoryBadge } from '../components/CategoryBadge.js';
import {
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Activity,
  Layers,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import { CATEGORY_NAMES, CIVIC_CATEGORIES } from '../../ml/categories.js';

interface DashboardPageProps {
  reports: CivicReport[];
  stats: DashboardStats | null;
  onSelectReport: (report: CivicReport) => void;
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  reports,
  stats,
  onSelectReport,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');

  const now = new Date().getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneWeekMs = 7 * oneDayMs;

  // Filter reports for the table
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Category filter
      if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;

      // Status filter
      if (selectedStatus !== 'All' && r.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;

      // Date filter
      if (dateFilter !== 'all') {
        const reportTime = new Date(r.createdAt).getTime();
        const diff = now - reportTime;
        if (dateFilter === 'today' && diff > oneDayMs) return false;
        if (dateFilter === 'week' && diff > oneWeekMs) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        return (
          r.id.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [reports, selectedCategory, selectedStatus, dateFilter, searchTerm]);

  // Aggregate Category Chart Data
  const categoryCounts = useMemo(() => {
    return CATEGORY_NAMES.map((cat) => {
      const count = reports.filter((r) => r.category === cat).length;
      const percentage = reports.length > 0 ? Math.round((count / reports.length) * 100) : 0;
      return { category: cat, count, percentage };
    }).sort((a, b) => b.count - a.count);
  }, [reports]);

  // Aggregate Status Pipeline Data
  const statusCounts = useMemo(() => {
    const statuses: CivicStatus[] = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
    return statuses.map((st) => {
      const count = reports.filter((r) => r.status === st).length;
      const percentage = reports.length > 0 ? Math.round((count / reports.length) * 100) : 0;
      return { status: st, count, percentage };
    });
  }, [reports]);

  // Total summary counts
  const total = reports.length;
  const pending = reports.filter((r) => r.status === 'Reported').length;
  const underReview = reports.filter((r) => r.status === 'Under Review').length;
  const inProgressOrAssigned = reports.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length;
  const resolved = reports.filter((r) => r.status === 'Resolved').length;

  const exportCSV = () => {
    const headers = ['Report ID', 'Category', 'Location', 'Date', 'Confidence', 'Status', 'Description'];
    const rows = filteredReports.map((r) => [
      r.id,
      `"${r.category}"`,
      `"${r.location}"`,
      new Date(r.createdAt).toISOString(),
      `${r.confidence}%`,
      r.status,
      `"${r.description.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `civic_reports_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Smart City Command Center
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              Sample & Live Data Integrated
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Municipal Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics, automated issue classification metrics, and complaint resolution lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigate('report')}
            className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            + File Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Reports */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Reports</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              {total}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Logged complaints</p>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pending / New</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-800">
              {pending}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Awaiting initial review</p>
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold text-slate-500">Under Review</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700">
              {underReview}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Assessment in progress</p>
          </div>
        </div>

        {/* In Progress / Assigned */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-semibold text-slate-500">In Progress</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black font-mono text-blue-700">
              {inProgressOrAssigned}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Field teams assigned</p>
          </div>
        </div>

        {/* Resolved */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold text-slate-500">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
              {resolved}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Verified closures</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Issues by Category
              </h3>
              <p className="text-xs text-slate-500">
                Automated ML distribution across 7 civic problem classes
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-400">
              {reports.length} sample pts
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryCounts.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate pr-2">
                    {item.category}
                  </span>
                  <span className="font-mono text-slate-600 shrink-0 font-medium">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Pipeline & Confidence Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Issues by Lifecycle Status
                </h3>
                <p className="text-xs text-slate-500">
                  Progression through the 5-stage municipal resolution flow
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3.5">
              {statusCounts.map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.status}</span>
                    <span className="font-mono text-slate-600 font-medium">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-500'
                          : item.status === 'In Progress'
                          ? 'bg-blue-500'
                          : item.status === 'Assigned'
                          ? 'bg-indigo-500'
                          : item.status === 'Under Review'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${Math.max(item.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Accuracy / Confidence Health Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700">Average Classification Confidence</span>
              <span className="font-mono font-bold text-emerald-700">
                {stats?.averageConfidence || 91}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consistently high zero-shot visual discrimination with multi-class probability scoring.
            </p>
          </div>
        </div>
      </div>

      {/* Reports Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Live Civic Reports Registry
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredReports.length} of {reports.length} total recorded reports
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, Area, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="All">All Categories</option>
              {CATEGORY_NAMES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">All Dates</option>
              <option value="today">Past 24 Hours</option>
              <option value="week">Past 7 Days</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Issue Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No matching reports found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => onSelectReport(report)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {report.id}
                      {report.isSample && (
                        <span className="ml-1.5 text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-sans">
                          Demo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={report.category} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-700">
                      {report.location}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-700 whitespace-nowrap">
                      {report.confidence}%
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={report.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectReport(report)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
