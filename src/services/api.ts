import {
  CivicReport,
  CivicStatus,
  ClassificationResult,
  DashboardStats,
} from '../types/index.js';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new ApiError(data.error || `Request failed with status ${res.status}`, res.status);
  }
  return data.data;
}

export const api = {
  async getMLInfo(): Promise<{
    name: string;
    isDemoModel: boolean;
    engine: string;
    description: string;
  }> {
    const res = await fetch(`${API_BASE}/ml-info`);
    return handleResponse(res);
  },

  async classifyImage(
    image: string,
    description?: string,
    location?: string
  ): Promise<ClassificationResult> {
    const res = await fetch(`${API_BASE}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, description, location }),
    });
    return handleResponse<ClassificationResult>(res);
  },

  async getReports(params?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<CivicReport[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);

    const qs = query.toString();
    const url = qs ? `${API_BASE}/reports?${qs}` : `${API_BASE}/reports`;
    const res = await fetch(url);
    return handleResponse<CivicReport[]>(res);
  },

  async getReportById(id: string): Promise<CivicReport> {
    const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`);
    return handleResponse<CivicReport>(res);
  },

  async createReport(report: {
    imageUrl: string;
    category: string;
    confidence: number;
    predictions?: any[];
    description: string;
    location: string;
    landmark?: string;
    contactName?: string;
    contactEmail?: string;
  }): Promise<CivicReport> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    return handleResponse<CivicReport>(res);
  },

  async updateReportStatus(
    id: string,
    status: CivicStatus,
    note?: string,
    updatedBy?: string
  ): Promise<CivicReport> {
    const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, updatedBy }),
    });
    return handleResponse<CivicReport>(res);
  },

  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`);
    return handleResponse<DashboardStats>(res);
  },
};
