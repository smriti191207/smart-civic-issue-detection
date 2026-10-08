import { CivicReport, CivicStatus, CivicCategory, DashboardStats } from '../src/types/index.js';
import { CATEGORY_NAMES } from '../ml/categories.js';

// Pre-seeded high quality sample reports representing real municipal scenarios
const INITIAL_SAMPLE_REPORTS: CivicReport[] = [
  {
    id: 'CIVIC-2026-1029',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    category: 'Road Damage / Pothole',
    confidence: 94,
    predictions: [
      { category: 'Road Damage / Pothole', confidence: 94 },
      { category: 'Public Infrastructure Damage', confidence: 4 },
      { category: 'Drainage / Waterlogging', confidence: 1 },
      { category: 'Other Civic Issue', confidence: 1 },
    ],
    description: 'Deep hazardous pothole on right lane near bus stop, causing sudden swerving and rim damage.',
    location: '4th Cross, 100 Feet Road, Indiranagar',
    landmark: 'Opposite Metro Station Pillar #142',
    contactName: 'Aarav Mehta',
    contactEmail: 'aarav.m@example.com',
    status: 'In Progress',
    createdAt: '2026-10-06T09:15:00.000Z',
    updatedAt: '2026-10-07T14:30:00.000Z',
    isSample: true,
    statusHistory: [
      { status: 'Reported', timestamp: '2026-10-06T09:15:00.000Z', note: 'Report submitted via citizen portal', updatedBy: 'Citizen' },
      { status: 'Under Review', timestamp: '2026-10-06T11:40:00.000Z', note: 'Verified by Ward 11 Inspector', updatedBy: 'Insp. R. Sharma' },
      { status: 'Assigned', timestamp: '2026-10-06T16:20:00.000Z', note: 'Dispatched to Asphalt Repair Unit Team B', updatedBy: 'Chief Engineer' },
      { status: 'In Progress', timestamp: '2026-10-07T14:30:00.000Z', note: 'Bitumen resurfacing crew on site with hot mix', updatedBy: 'Field Supervisor' },
    ],
  },
  {
    id: 'CIVIC-2026-1035',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
    category: 'Garbage / Waste',
    confidence: 91,
    predictions: [
      { category: 'Garbage / Waste', confidence: 91 },
      { category: 'Other Civic Issue', confidence: 5 },
      { category: 'Public Infrastructure Damage', confidence: 4 },
    ],
    description: 'Dumpster overflowed 3 days ago. Trash bags piled up on footpath attracting strays and foul odor.',
    location: 'Corner of 8th Main & Market Road, Ward 7',
    landmark: 'Behind Community Health Clinic',
    contactName: 'Priya Sundaram',
    contactEmail: 'priya.s@example.com',
    status: 'Assigned',
    createdAt: '2026-10-06T15:20:00.000Z',
    updatedAt: '2026-10-07T08:00:00.000Z',
    isSample: true,
    statusHistory: [
      { status: 'Reported', timestamp: '2026-10-06T15:20:00.000Z', note: 'Report filed with photo evidence', updatedBy: 'Citizen' },
      { status: 'Under Review', timestamp: '2026-10-06T18:05:00.000Z', note: 'Categorized under Solid Waste Urgent Clearance', updatedBy: 'Civic Helpdesk' },
      { status: 'Assigned', timestamp: '2026-10-07T08:00:00.000Z', note: 'Sanitation Truck #4 scheduled for mid-day pickup', updatedBy: 'Sanitation Officer' },
    ],
  },
  {
    id: 'CIVIC-2026-1042',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    category: 'Drainage / Waterlogging',
    confidence: 89,
    predictions: [
      { category: 'Drainage / Waterlogging', confidence: 89 },
      { category: 'Road Damage / Pothole', confidence: 7 },
      { category: 'Garbage / Waste', confidence: 4 },
    ],
    description: 'Stormwater grate blocked by silt and dry leaves. Severe waterlogging submerging half the lane after mild rain.',
    location: 'Lake View Road, Sector 4',
    landmark: 'Near Childrens Park Gate',
    contactName: 'Vikram Patel',
    contactEmail: 'vikram.p@example.com',
    status: 'Under Review',
    createdAt: '2026-10-07T07:45:00.000Z',
    updatedAt: '2026-10-07T09:10:00.000Z',
    isSample: true,
    statusHistory: [
      { status: 'Reported', timestamp: '2026-10-07T07:45:00.000Z', note: 'Report submitted via mobile web', updatedBy: 'Citizen' },
      { status: 'Under Review', timestamp: '2026-10-07T09:10:00.000Z', note: 'Assessment queue: Stormwater Drainage division', updatedBy: 'Control Room' },
    ],
  },
  {
    id: 'CIVIC-2026-1018',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    category: 'Streetlight Problem',
    confidence: 96,
    predictions: [
      { category: 'Streetlight Problem', confidence: 96 },
      { category: 'Public Infrastructure Damage', confidence: 3 },
      { category: 'Other Civic Issue', confidence: 1 },
    ],
    description: 'Three consecutive streetlights malfunctioning. Stretch is pitch black creating serious pedestrian safety risk.',
    location: 'Railway Colony Approach Road',
    landmark: 'Pole Numbers SL-402, SL-403, SL-404',
    contactName: 'Sunita Das',
    status: 'Resolved',
    createdAt: '2026-10-05T19:30:00.000Z',
    updatedAt: '2026-10-06T17:15:00.000Z',
    isSample: true,
    statusHistory: [
      { status: 'Reported', timestamp: '2026-10-05T19:30:00.000Z', note: 'Reported with exact pole coordinates', updatedBy: 'Citizen' },
      { status: 'Under Review', timestamp: '2026-10-05T20:10:00.000Z', note: 'Dispatched to electrical night crew', updatedBy: 'Night Dispatcher' },
      { status: 'Assigned', timestamp: '2026-10-06T08:30:00.000Z', note: 'Lineman assigned for transformer & LED fixture check', updatedBy: 'Electrical Eng.' },
      { status: 'In Progress', timestamp: '2026-10-06T14:00:00.000Z', note: 'Replaced faulty circuit breaker and LED drivers', updatedBy: 'Lineman K. Mohan' },
      { status: 'Resolved', timestamp: '2026-10-06T17:15:00.000Z', note: 'Tested and verified functional illumination', updatedBy: 'Ward Supervisor' },
    ],
  },
  {
    id: 'CIVIC-2026-1051',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    category: 'Traffic / Road Sign Issue',
    confidence: 88,
    predictions: [
      { category: 'Traffic / Road Sign Issue', confidence: 88 },
      { category: 'Public Infrastructure Damage', confidence: 8 },
      { category: 'Road Damage / Pothole', confidence: 4 },
    ],
    description: 'Stop sign knocked askew and twisted following a collision, confusing motorists at blind intersection.',
    location: 'Crossway Junction of 12th Avenue & Park Road',
    landmark: 'Next to Central Post Office',
    status: 'Reported',
    createdAt: '2026-10-07T18:20:00.000Z',
    updatedAt: '2026-10-07T18:20:00.000Z',
    isSample: true,
    statusHistory: [
      { status: 'Reported', timestamp: '2026-10-07T18:20:00.000Z', note: 'Report registered in system', updatedBy: 'Citizen' },
    ],
  },
  {
    id: 'CIVIC-2026-1011',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    category: 'Public Infrastructure Damage',
    confidence: 85,
    predictions: [
      { category: 'Public Infrastructure Damage', confidence: 85 },
      { category: 'Road Damage / Pothole', confidence: 9 },
      { category: 'Other Civic Issue', confidence: 6 },
    ],
    description: 'Steel pedestrian safety railing bent outwards near school crossing, sharp metal edge exposed.',
    location: 'MG Road Footpath',
    landmark: 'Adjacent to St. Marks Public School',
    status: 'Resolved',
    createdAt: '2026-10-04T11:00:00.000Z',
    updatedAt: '2026-10-05T16:45:00.000Z',
    isSample: true,
    statusHistory: [
      { status: 'Reported', timestamp: '2026-10-04T11:00:00.000Z', note: 'Safety concern logged', updatedBy: 'Citizen' },
      { status: 'Under Review', timestamp: '2026-10-04T13:20:00.000Z', note: 'Prioritized due to proximity to school', updatedBy: 'Safety Officer' },
      { status: 'Assigned', timestamp: '2026-10-04T15:00:00.000Z', note: 'Assigned to PWD Fabrication Division', updatedBy: 'PWD Desk' },
      { status: 'In Progress', timestamp: '2026-10-05T09:30:00.000Z', note: 'Welding team repairing guard rail', updatedBy: 'Field Tech' },
      { status: 'Resolved', timestamp: '2026-10-05T16:45:00.000Z', note: 'New reinforced section installed and painted', updatedBy: 'PWD Inspector' },
    ],
  },
];

class ReportStore {
  private reports: CivicReport[] = [];

  constructor() {
    this.reports = [...INITIAL_SAMPLE_REPORTS];
  }

  public getAll(filters?: { status?: string; category?: string; search?: string }): CivicReport[] {
    let result = [...this.reports];

    if (filters?.status && filters.status !== 'All') {
      result = result.filter((r) => r.status.toLowerCase() === filters.status!.toLowerCase());
    }

    if (filters?.category && filters.category !== 'All') {
      result = result.filter((r) => r.category === filters.category);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.landmark && r.landmark.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getById(id: string): CivicReport | null {
    return this.reports.find((r) => r.id.toLowerCase() === id.toLowerCase()) || null;
  }

  public create(data: {
    imageUrl: string;
    category: CivicCategory;
    confidence: number;
    predictions?: any[];
    description: string;
    location: string;
    landmark?: string;
    contactName?: string;
    contactEmail?: string;
  }): CivicReport {
    const timestamp = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `CIVIC-2026-${randomSuffix}`;

    const newReport: CivicReport = {
      id,
      imageUrl: data.imageUrl,
      category: data.category,
      confidence: data.confidence,
      predictions: data.predictions || [],
      description: data.description,
      location: data.location,
      landmark: data.landmark || '',
      contactName: data.contactName || '',
      contactEmail: data.contactEmail || '',
      status: 'Reported',
      createdAt: timestamp,
      updatedAt: timestamp,
      isSample: false,
      statusHistory: [
        {
          status: 'Reported',
          timestamp,
          note: 'Civic complaint registered and classified.',
          updatedBy: data.contactName ? `${data.contactName} (Citizen)` : 'Citizen Portal',
        },
      ],
    };

    this.reports.unshift(newReport);
    return newReport;
  }

  public updateStatus(
    id: string,
    newStatus: CivicStatus,
    note?: string,
    updatedBy?: string
  ): CivicReport | null {
    const report = this.getById(id);
    if (!report) return null;

    const timestamp = new Date().toISOString();
    report.status = newStatus;
    report.updatedAt = timestamp;
    report.statusHistory.push({
      status: newStatus,
      timestamp,
      note: note || `Status progressed to ${newStatus}`,
      updatedBy: updatedBy || 'Municipal Official',
    });

    return report;
  }

  public getStats(): DashboardStats {
    const totalReports = this.reports.length;
    const pendingReports = this.reports.filter((r) => r.status === 'Reported').length;
    const underReviewReports = this.reports.filter((r) => r.status === 'Under Review').length;
    const inProgressReports = this.reports.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length;
    const resolvedReports = this.reports.filter((r) => r.status === 'Resolved').length;

    const totalConf = this.reports.reduce((acc, r) => acc + (r.confidence || 0), 0);
    const averageConfidence = totalReports > 0 ? Math.round(totalConf / totalReports) : 0;

    const categoryBreakdown = CATEGORY_NAMES.map((cat) => {
      const count = this.reports.filter((r) => r.category === cat).length;
      return {
        category: cat,
        count,
        percentage: totalReports > 0 ? Math.round((count / totalReports) * 100) : 0,
      };
    }).sort((a, b) => b.count - a.count);

    const statuses: CivicStatus[] = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
    const statusBreakdown = statuses.map((st) => {
      const count = this.reports.filter((r) => r.status === st).length;
      return {
        status: st,
        count,
        percentage: totalReports > 0 ? Math.round((count / totalReports) * 100) : 0,
      };
    });

    return {
      totalReports,
      pendingReports,
      underReviewReports,
      inProgressReports,
      resolvedReports,
      averageConfidence,
      categoryBreakdown,
      statusBreakdown,
      recentActivity: this.reports.slice(0, 5),
    };
  }
}

export const reportStore = new ReportStore();
