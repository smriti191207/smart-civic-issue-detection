import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Loader2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  User,
  Mail,
  ShieldCheck,
  Navigation,
  FileCheck2,
} from 'lucide-react';
import { api, ApiError } from '../services/api.js';
import {
  CivicCategory,
  ClassificationResult,
  CivicReport,
} from '../types/index.js';
import { CATEGORY_NAMES, CIVIC_CATEGORIES } from '../../ml/categories.js';
import { CategoryBadge } from '../components/CategoryBadge.js';
import { ConfidenceMeter } from '../components/ConfidenceMeter.js';
import { StatusBadge } from '../components/StatusBadge.js';

interface ReportIssuePageProps {
  onReportCreated: (newReport: CivicReport) => void;
  onNavigate: (tab: string) => void;
}

// Sample preset civic test images for quick testing
const TEST_PRESETS = [
  {
    label: 'Road Pothole',
    category: 'Road Damage / Pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80',
    desc: 'Deep asphalt pothole on main road creating hazard for two-wheelers and buses.',
    location: '4th Cross, 100 Feet Road, Indiranagar',
    landmark: 'Near Indiranagar Club',
  },
  {
    label: 'Garbage Dump',
    category: 'Garbage / Waste',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=700&q=80',
    desc: 'Overflowing community trash bin. Garbage strewn onto walking pavement.',
    location: '8th Main Market Road, Ward 7',
    landmark: 'Behind Community Health Clinic',
  },
  {
    label: 'Drainage Flood',
    category: 'Drainage / Waterlogging',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80',
    desc: 'Stormwater drain inlet choked with plastic debris resulting in street waterlogging.',
    location: 'Lake View Road, Sector 4',
    landmark: 'Near Gate 2 Park',
  },
  {
    label: 'Broken Streetlight',
    category: 'Streetlight Problem',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=700&q=80',
    desc: 'Dark junction streetlight lamp pole unlit for three nights in a row.',
    location: 'Railway Colony Approach Road',
    landmark: 'Pole SL-402',
  },
];

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  onReportCreated,
  onNavigate,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // ML Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ClassificationResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CivicCategory | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<CivicReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Upload Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, JPEG, PNG
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Unsupported file format. Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    // Validate size: 10MB limit
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('Image is too large. Maximum supported file size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      // Reset prior analysis when new image is uploaded
      setAnalysisResult(null);
      setSelectedCategory(null);
    };
    reader.onerror = () => {
      setErrorMessage('Unable to read selected image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  // Load preset sample for quick demonstration
  const handleLoadPreset = (preset: (typeof TEST_PRESETS)[0]) => {
    setImagePreview(preset.url);
    setDescription(preset.desc);
    setLocation(preset.location);
    setLandmark(preset.landmark);
    setAnalysisResult(null);
    setSelectedCategory(null);
    setErrorMessage(null);
  };

  // Use Geolocation API
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        setLocation(`Civic Zone (${lat}° N, ${lng}° E)`);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation warning:', err.message);
        setLocation('Ward 12, Municipal Central Sector');
      },
      { timeout: 8000 }
    );
  };

  // Run ML Classification
  const handleAnalyzeIssue = async () => {
    setErrorMessage(null);

    if (!imagePreview) {
      setErrorMessage('No image selected. Please upload a civic issue image.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please enter an issue description to assist classification.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await api.classifyImage(imagePreview, description, location);
      setAnalysisResult(result);
      setSelectedCategory(result.category);
    } catch (err: any) {
      console.error('Classification error:', err);
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : 'Unable to analyze the image. Please try again or check the format.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Final Report to Backend
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!imagePreview) {
      setErrorMessage('No image selected. Image is required to submit a report.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Issue description cannot be empty.');
      return;
    }

    if (!location.trim()) {
      setErrorMessage('Location is required to dispatch municipal teams.');
      return;
    }

    const categoryToSubmit = selectedCategory || analysisResult?.category;
    if (!categoryToSubmit) {
      setErrorMessage('Please run "Analyze Issue" first or select an issue category.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.createReport({
        imageUrl: imagePreview,
        category: categoryToSubmit,
        confidence: analysisResult?.confidence || 85,
        predictions: analysisResult?.predictions || [],
        description: description.trim(),
        location: location.trim(),
        landmark: landmark.trim() || undefined,
        contactName: contactName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
      });

      setSubmittedReport(created);
      onReportCreated(created);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Unable to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setImagePreview(null);
    setDescription('');
    setLocation('');
    setLandmark('');
    setContactName('');
    setContactEmail('');
    setAnalysisResult(null);
    setSelectedCategory(null);
    setSubmittedReport(null);
    setErrorMessage(null);
  };

  // SUCCESS STATE: Report Filed
  if (submittedReport) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 sm:p-8 text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto text-white mb-2">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Civic Issue Detected & Registered
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto">
              Your report has been logged into the municipal database and routed for review.
            </p>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Complaint Tracking ID
                </span>
                <p className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                  {submittedReport.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={submittedReport.status} size="lg" />
              </div>
            </div>

            {/* Image + Meta Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 flex items-center justify-center">
                <img
                  src={submittedReport.imageUrl}
                  alt={submittedReport.category}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                    Predicted Civic Issue
                  </span>
                  <CategoryBadge category={submittedReport.category} size="lg" />
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <ConfidenceMeter
                    confidence={submittedReport.confidence}
                    predictions={submittedReport.predictions}
                  />
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <p>
                    <strong className="text-slate-800">Location:</strong> {submittedReport.location}
                  </p>
                  {submittedReport.landmark && (
                    <p>
                      <strong className="text-slate-800">Landmark:</strong> {submittedReport.landmark}
                    </p>
                  )}
                  <p>
                    <strong className="text-slate-800">Date/Time:</strong>{' '}
                    {new Date(submittedReport.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Citizen Description
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {submittedReport.description}
              </p>
            </div>

            {/* Next Steps Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleResetForm}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Report Another Issue
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('my-reports')}
                  className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg transition cursor-pointer"
                >
                  View in My Reports
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Go to Operations Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      {/* Title Header */}
      <div>
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Citizen Reporting Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Report a Civic Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Upload an image of the civic issue and enter a description. Our machine-learning model
          will analyze the visual evidence and classify the incident.
        </p>
      </div>

      {/* Preset Fast-Test Bar */}
      <div className="bg-slate-100/80 rounded-2xl p-3.5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Quick Demo Test Scenarios:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {TEST_PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleLoadPreset(p)}
              className="text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-2.5 py-1 rounded-lg transition shadow-2xs hover:border-emerald-500 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 shadow-2xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmitReport} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Image Upload & Preview */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Upload Civic Issue Image <span className="text-rose-500">*</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[260px] ${
                imagePreview
                  ? 'border-emerald-400 bg-slate-900/5'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />

              {imagePreview ? (
                <div className="relative w-full h-56 rounded-xl overflow-hidden group">
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                    Click to change image
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Click to upload image or drag & drop
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      JPG, JPEG, or PNG (Max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {imagePreview && (
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Image loaded and ready for machine learning inspection.
              </p>
            )}
          </div>

          {/* Right Column: Description & Location */}
          <div className="space-y-4">
            {/* Description Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                2. Issue Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem, severity, and any immediate hazards (e.g., deep pothole causing traffic jam, trash bin overflowing onto footpath)..."
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              <span className="text-[11px] text-slate-500">
                Linguistic and visual features will be evaluated simultaneously.
              </span>
            </div>

            {/* Location Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Location <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{isLocating ? 'Detecting GPS...' : 'Use Current GPS'}</span>
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street name, crossroad, area, or ward number"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Landmark Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Nearby Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Opposite hospital, Metro pillar #, park entrance"
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Optional Contact Section */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Citizen Name (Optional)
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Ramesh K."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Email / Mobile for Updates (Optional)
            </label>
            <input
              type="text"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="e.g. citizen@example.com"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Step 4: ML Analysis Action */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" />
                Machine Learning Classification
              </h3>
              <p className="text-xs text-slate-500">
                Preprocesses image data and evaluates civic problem features.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAnalyzeIssue}
              disabled={isAnalyzing || !imagePreview}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing civic issue...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Issue</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis In-Progress State */}
          {isAnalyzing && (
            <div className="p-6 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <div>
                <p className="text-sm font-bold text-emerald-950">
                  Analyzing civic issue...
                </p>
                <p className="text-xs text-emerald-700">
                  Extracting visual features and calculating category probabilities...
                </p>
              </div>
            </div>
          )}

          {/* Analysis Results Display */}
          {analysisResult && !isAnalyzing && (
            <div className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Predicted Civic Issue Category
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <CategoryBadge category={analysisResult.category} size="lg" />
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Prediction Confidence
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-600">
                    {analysisResult.confidence}%
                  </span>
                </div>
              </div>

              {/* Confidence Meter with Top Predictions */}
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <ConfidenceMeter
                  confidence={analysisResult.confidence}
                  predictions={analysisResult.predictions}
                />
              </div>

              {/* Model Reasoning */}
              {analysisResult.reasoning && (
                <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700">
                  <span className="font-semibold text-slate-800">Visual Reasoning: </span>
                  {analysisResult.reasoning}
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Engine: {analysisResult.modelEngine} {analysisResult.isDemoModel ? '(Demo Mode)' : ''}
                  </span>
                </div>
              )}

              {/* Category Override Option (citizen validation) */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Confirm or Adjust Category if needed:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_NAMES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        (selectedCategory || analysisResult.category) === cat
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Final Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetForm}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2.5 px-3 transition cursor-pointer"
          >
            Clear Form
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !imagePreview || !description.trim() || !location.trim()}
            className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-40 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Complaint...</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-4 h-4" />
                <span>Submit Civic Report</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
