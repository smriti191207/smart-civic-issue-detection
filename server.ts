import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { classifyCivicIssue, getActiveClassifierInfo } from './ml/classifier/index.js';
import { reportStore } from './database/reportStore.js';
import { CIVIC_CATEGORIES, CATEGORY_NAMES } from './ml/categories.js';
import { CivicCategory, CivicStatus } from './src/types/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parsing with generous limits for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logging
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

/**
 * GET /api/ml-info
 * Returns the currently active classification engine and its readiness status.
 */
app.get('/api/ml-info', (req: Request, res: Response) => {
  const info = getActiveClassifierInfo();
  res.json({
    success: true,
    data: info,
    supportedCategories: CATEGORY_NAMES,
  });
});

/**
 * GET /api/categories
 * Returns metadata for all supported civic issue categories.
 */
app.get('/api/categories', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: CIVIC_CATEGORIES,
  });
});

/**
 * POST /api/classify
 * Analyzes uploaded image and description using the ML classification service.
 */
app.post('/api/classify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image, description, location } = req.body;

    if (!image || typeof image !== 'string') {
      res.status(400).json({
        success: false,
        error: 'No image selected. Please provide a valid JPG, JPEG, or PNG image.',
      });
      return;
    }

    // Basic format and size validation
    const isDataUrl = image.startsWith('data:image/');
    const isHttpUrl = image.startsWith('http://') || image.startsWith('https://');

    if (!isDataUrl && !isHttpUrl && image.length < 50) {
      res.status(400).json({
        success: false,
        error: 'Unsupported file format. Please upload a JPG or PNG image.',
      });
      return;
    }

    // Check size heuristic (base64 string length roughly 1.37x file bytes)
    if (image.length > 25 * 1024 * 1024) {
      res.status(400).json({
        success: false,
        error: 'Image is too large. Please upload an image smaller than 10MB.',
      });
      return;
    }

    const result = await classifyCivicIssue(image, description, location);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[API /api/classify Error]', error);
    res.status(500).json({
      success: false,
      error: 'Unable to analyze the image. Please try again or check the format.',
    });
  }
});

/**
 * GET /api/reports
 * Retrieves civic reports with optional filtering by status, category, and search query.
 */
app.get('/api/reports', (req: Request, res: Response) => {
  try {
    const { status, category, search } = req.query;
    const reports = reportStore.getAll({
      status: status ? String(status) : undefined,
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined,
    });

    res.json({
      success: true,
      data: reports,
      count: reports.length,
    });
  } catch (error) {
    console.error('[API /api/reports Error]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve reports.',
    });
  }
});

/**
 * GET /api/reports/:id
 * Retrieves details of a specific civic report.
 */
app.get('/api/reports/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = reportStore.getById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        error: 'Report could not be found.',
      });
      return;
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('[API /api/reports/:id Error]', error);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch report details.',
    });
  }
});

/**
 * POST /api/reports
 * Submits a new civic issue report.
 */
app.post('/api/reports', (req: Request, res: Response) => {
  try {
    const {
      imageUrl,
      category,
      confidence,
      predictions,
      description,
      location,
      landmark,
      contactName,
      contactEmail,
    } = req.body;

    if (!imageUrl) {
      res.status(400).json({
        success: false,
        error: 'Image is required to submit a civic report.',
      });
      return;
    }

    if (!category || !CATEGORY_NAMES.includes(category as CivicCategory)) {
      res.status(400).json({
        success: false,
        error: 'Invalid or missing issue category.',
      });
      return;
    }

    if (!location || !location.trim()) {
      res.status(400).json({
        success: false,
        error: 'Location information is required.',
      });
      return;
    }

    if (!description || !description.trim()) {
      res.status(400).json({
        success: false,
        error: 'Please provide a brief description of the civic problem.',
      });
      return;
    }

    const createdReport = reportStore.create({
      imageUrl,
      category: category as CivicCategory,
      confidence: typeof confidence === 'number' ? confidence : 85,
      predictions: Array.isArray(predictions) ? predictions : [],
      description: description.trim(),
      location: location.trim(),
      landmark: landmark ? landmark.trim() : undefined,
      contactName: contactName ? contactName.trim() : undefined,
      contactEmail: contactEmail ? contactEmail.trim() : undefined,
    });

    res.status(201).json({
      success: true,
      data: createdReport,
      message: 'Civic issue report registered successfully.',
    });
  } catch (error) {
    console.error('[API /api/reports POST Error]', error);
    res.status(500).json({
      success: false,
      error: 'Unable to submit report. Please try again.',
    });
  }
});

/**
 * PUT /api/reports/:id/status
 * Updates the resolution lifecycle status of an existing report.
 */
app.put('/api/reports/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note, updatedBy } = req.body;

    const validStatuses: CivicStatus[] = ['Reported', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
    if (!status || !validStatuses.includes(status as CivicStatus)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const updated = reportStore.updateStatus(id, status as CivicStatus, note, updatedBy);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Report could not be found.',
      });
      return;
    }

    res.json({
      success: true,
      data: updated,
      message: `Report status updated to ${status}.`,
    });
  } catch (error) {
    console.error('[API /api/reports/:id/status Error]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update report status.',
    });
  }
});

/**
 * GET /api/stats
 * Provides aggregated analytics and KPIs for the city dashboard.
 */
app.get('/api/stats', (req: Request, res: Response) => {
  try {
    const stats = reportStore.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('[API /api/stats Error]', error);
    res.status(500).json({
      success: false,
      error: 'Unable to load dashboard statistics.',
    });
  }
});

// ----------------------------------------------------
// FRONTEND INTEGRATION (Vite in Dev / Static in Prod)
// ----------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware mounted in development mode');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Server] Serving production static assets from:', distPath);
  }

  // Generic 404 handler for unmatched API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'API endpoint not found.',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`SMART CIVIC ISSUE DETECTION SERVER READY`);
    console.log(`Listening on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });
}

startServer().catch((err) => {
  console.error('[Server startup error]', err);
  process.exit(1);
});
