export type CivicCategory =
  | 'Road Damage / Pothole'
  | 'Garbage / Waste'
  | 'Drainage / Waterlogging'
  | 'Streetlight Problem'
  | 'Traffic / Road Sign Issue'
  | 'Public Infrastructure Damage'
  | 'Other Civic Issue';

export type CivicStatus =
  | 'Reported'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved';

export interface PredictionItem {
  category: CivicCategory;
  confidence: number; // 0 to 100 percentage
}

export interface ClassificationResult {
  category: CivicCategory;
  confidence: number; // 0 to 100 percentage
  predictions: PredictionItem[];
  reasoning?: string;
  modelEngine: string;
  isDemoModel: boolean;
  analyzedAt: string;
}

export interface StatusHistoryItem {
  status: CivicStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface CivicReport {
  id: string;
  imageUrl: string;
  category: CivicCategory;
  confidence: number;
  predictions?: PredictionItem[];
  description: string;
  location: string;
  landmark?: string;
  contactName?: string;
  contactEmail?: string;
  status: CivicStatus;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
  isSample?: boolean;
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  underReviewReports: number;
  inProgressReports: number;
  resolvedReports: number;
  averageConfidence: number;
  categoryBreakdown: { category: CivicCategory; count: number; percentage: number }[];
  statusBreakdown: { status: CivicStatus; count: number; percentage: number }[];
  recentActivity: CivicReport[];
}
