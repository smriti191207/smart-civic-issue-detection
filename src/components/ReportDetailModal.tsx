import React, { useState } from 'react';
import { CivicReport, CivicStatus } from '../types/index.js';
import { StatusBadge } from './StatusBadge.js';
import { CategoryBadge } from './CategoryBadge.js';
import { ConfidenceMeter } from './ConfidenceMeter.js';
import { StatusTimeline } from './StatusTimeline.js';
import {
  X,
  MapPin,
  Calendar,
  User,
  Mail,
  Shield,
  ArrowRight,
  CheckCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.js';

interface ReportDetailModalProps {
  report: CivicReport | null;
  onClose: () => void;
  onStatusUpdated?: (updatedReport: CivicReport) => void;
}

const NEXT_STATUS_MAP: Record<CivicStatus, CivicStatus | null> = {
  Reported: 'Under Review',
  'Under Review': 'Assigned',
  Assigned: 'In Progress',
  'In Progress': 'Resolved',
  Resolved: null,
};

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onStatusUpdated,
}) => {
  if (!report) return null;

  const [currentReport, setCurrentReport] = useState<CivicReport>(report);
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState('');
  const [officerName, setOfficerName] = useState('Ward Officer / Maintenance Desk');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const nextStatus = NEXT_STATUS_MAP[currentReport.status];

  const handleCopyId = () => {
    navigator.clipboard?.writeText(currentReport.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdvanceStatus = async (targetStatus: CivicStatus) => {
    setIsUpdating(true);
    setErrorMsg('');
    try {
      const updated = await api.updateReportStatus(
        currentReport.id,
        targetStatus,
        note || `Status progressed to ${targetStatus}`,
        officerName
      );
      setCurrentReport(updated);
      setNote('');
      if (onStatusUpdated) onStatusUpdated(updated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {currentReport.id}
                </h3>
                <button
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-slate-700 transition p-1 rounded"
                  title="Copy Report ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copied && (
                  <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    Copied!
                  </span>
                )}
                {currentReport.isSample && (
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                    Demo Data
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Civic Complaint File • Municipal Smart Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={currentReport.status} size="md" />
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          {/* Top Grid: Image + Primary Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group aspect-4/3 flex items-center justify-center">
              <img
                src={currentReport.imageUrl}
                alt={currentReport.category}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback placeholder if external image fails
                  (e.target as HTMLElement).setAttribute(
                    'src',
                    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
                  );
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-xs p-2 rounded-lg flex items-center justify-between">
                <span>Verified Visual Evidence</span>
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                  {currentReport.confidence}% Match
                </span>
              </div>
            </div>

            {/* Classification & Location Details */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Classified Issue Category
                </span>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <CategoryBadge category={currentReport.category} size="lg" />
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mb-4">
                  <ConfidenceMeter
                    confidence={currentReport.confidence}
                    predictions={currentReport.predictions}
                  />
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Location:</span>{' '}
                    {currentReport.location}
                    {currentReport.landmark && (
                      <span className="text-slate-500 block text-[11px]">
                        Landmark: {currentReport.landmark}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Filed On:</span>{' '}
                    {new Date(currentReport.createdAt).toLocaleString()}
                  </div>
                </div>

                {currentReport.contactName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">Reporter:</span>{' '}
                      {currentReport.contactName}{' '}
                      {currentReport.contactEmail && `(${currentReport.contactEmail})`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Citizen Description & Incident Report
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {currentReport.description}
            </p>
          </div>

          {/* Status Timeline Workflow */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Lifecycle Progress Tracker
            </h4>
            <StatusTimeline
              currentStatus={currentReport.status}
              history={currentReport.statusHistory}
            />
          </div>

          {/* Municipal Action Section: Progress status */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Municipal Dispatch & Workflow Transition
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Officers can progress this civic complaint to the next resolution phase.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Transition Note / Action Log
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sanitation truck dispatched, Work order #491 created"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {nextStatus ? (
                <button
                  onClick={() => handleAdvanceStatus(nextStatus)}
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs disabled:opacity-50 shrink-0"
                >
                  {isUpdating ? (
                    'Updating...'
                  ) : (
                    <>
                      Advance to <strong>{nextStatus}</strong>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg font-semibold shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Resolved & Archived
                </div>
              )}
            </div>

            {/* Quick jump to any status */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-500">Jump directly to:</span>
              {(['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved'] as CivicStatus[])
                .filter((st) => st !== currentReport.status)
                .map((st) => (
                  <button
                    key={st}
                    onClick={() => handleAdvanceStatus(st)}
                    disabled={isUpdating}
                    className="text-[11px] px-2.5 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium transition disabled:opacity-50"
                  >
                    {st}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Smart Municipal Grievance Tracking • AI Assisted
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
