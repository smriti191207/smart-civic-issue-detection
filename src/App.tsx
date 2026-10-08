import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { ReportIssuePage } from './pages/ReportIssuePage.js';
import { MyReportsPage } from './pages/MyReportsPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ReportDetailModal } from './components/ReportDetailModal.js';
import { CivicReport, DashboardStats } from './types/index.js';
import { api } from './services/api.js';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);

  // Fetch all reports and dashboard stats from backend REST API
  const refreshData = useCallback(async () => {
    try {
      setError(null);
      const [fetchedReports, fetchedStats] = await Promise.all([
        api.getReports(),
        api.getStats(),
      ]);
      setReports(fetchedReports);
      setStats(fetchedStats);
    } catch (err: any) {
      console.error('Error fetching civic data:', err);
      setError('Unable to synchronize with the municipal database. Retrying...');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handler when a user submits a new report
  const handleReportCreated = (newReport: CivicReport) => {
    setReports((prev) => [newReport, ...prev]);
    // Refresh stats in background
    api.getStats().then(setStats).catch(() => {});
  };

  // Handler when report status is updated in modal
  const handleStatusUpdated = (updated: CivicReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setSelectedReport(updated);
    api.getStats().then(setStats).catch(() => {});
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        reportCount={reports.length}
      />

      {/* Global Sync Error Warning (if any) */}
      {error && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-800 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
          <button
            onClick={refreshData}
            className="underline font-semibold hover:text-amber-950 ml-2 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {isLoading && reports.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-700">
              Initializing Smart Civic Issue Detection Platform...
            </p>
            <p className="text-xs text-slate-500">
              Connecting to ML inference server and grievance records...
            </p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomePage
                onNavigate={setCurrentTab}
                stats={
                  stats
                    ? {
                        totalReports: stats.totalReports,
                        resolvedReports: stats.resolvedReports,
                        pendingReports: stats.pendingReports,
                      }
                    : undefined
                }
              />
            )}

            {currentTab === 'report' && (
              <ReportIssuePage
                onReportCreated={handleReportCreated}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'my-reports' && (
              <MyReportsPage
                reports={reports}
                onSelectReport={setSelectedReport}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardPage
                reports={reports}
                stats={stats}
                onSelectReport={setSelectedReport}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'about' && <AboutPage />}
          </>
        )}
      </main>

      {/* Report Details & Workflow Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={setCurrentTab} />
    </div>
  );
}
