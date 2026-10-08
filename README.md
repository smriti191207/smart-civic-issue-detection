# SMART CIVIC ISSUE DETECTION
**AI-Powered Identification and Reporting of Civic Issues**

---

## 1. Project Overview
**Smart Civic Issue Detection** is a full-stack, machine-learning-based civic issue reporting and computer-vision classification platform. The system empowers citizens to report civic problems (such as road potholes, garbage accumulation, waterlogged drains, and malfunctioning streetlights) simply by uploading an image and providing an optional description. 

Instead of relying on slow, error-prone manual triage by city administrators, the application analyzes visual and linguistic signals, identifies the primary civic problem category with a probability distribution, routes the incident to the appropriate municipal department, and tracks the resolution lifecycle from initial report to verified closure.

---

## 2. Features
- **Multimodal Civic Problem Classification**: Automatically categorizes images into 7 standardized municipal categories with confidence percentage and probability distribution.
- **Computer Vision & Zero-Shot Classification**: Uses Gemini 3.8 Flash Multimodal Vision when configured, with an offline feature-heuristic classifier fallback.
- **Standardized Civic Issue Categories**:
  1. *Road Damage / Pothole* (Roads & Highway Maintenance)
  2. *Garbage / Waste* (Solid Waste Management)
  3. *Drainage / Waterlogging* (Stormwater & Drainage Dept)
  4. *Streetlight Problem* (Municipal Electrical Services)
  5. *Traffic / Road Sign Issue* (Traffic Safety & Signals)
  6. *Public Infrastructure Damage* (Public Works Department)
  7. *Other Civic Issue* (General Civic Administration)
- **Guided Citizen Reporting**: Supports JPG, JPEG, and PNG image uploads up to 10MB, with live previews, GPS geolocation auto-fill, and preset testing scenarios.
- **Transparent Classification & Citizen Verification**: Displays top category predictions, confidence gauge, visual reasoning, and allows the citizen to confirm or override before submission.
- **5-Stage Status Lifecycle Tracking**:
  $$\text{Reported} \longrightarrow \text{Under Review} \longrightarrow \text{Assigned} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved}$$
- **Comprehensive Audit Timeline**: Logs every transition with timestamps, department notes, and officer identification.
- **Operational Municipal Dashboard**:
  - Real-time KPI summary (Total, Pending, Under Review, In Progress, Resolved).
  - Category distribution charts.
  - Lifecycle pipeline status progress.
  - Searchable, filterable complaints table with multi-criteria filtering and CSV export.
- **Scientific Honesty & Modular Architecture**: The ML classification interface is decoupled from the UI, with honest labeling for development modes and clear guidelines for plugging in custom weights.

---

## 3. Technology Stack
- **Frontend**:
  - React 19 + TypeScript
  - Tailwind CSS v4 (Modern responsive utility styling)
  - Lucide React (Civic and operational icons)
  - Vite 8 (Ultra-fast build tooling and HMR)
- **Backend / API**:
  - Node.js + Express 4 + TypeScript
  - RESTful architecture with JSON validation and payload sanitization
  - tsx (TypeScript execution engine)
- **Machine Learning & Vision**:
  - `@google/genai` TypeScript SDK (Gemini 3.8 Flash Vision)
  - Isolated classification service (`ICivicClassifier`)
  - Rule-based feature-heuristic fallback classifier
- **Data Persistence**:
  - In-memory persistent storage layer with realistic pre-seeded municipal incident records, designed for seamless replacement with PostgreSQL / Firebase Firestore.

---

## 4. Project Architecture
The project strictly isolates user interface presentation, server routing, machine learning classifiers, and data storage:

```
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.tsx         # Responsive navigation & branding
│   │   ├── Footer.tsx         # Platform footer & academic notice
│   │   ├── StatusBadge.tsx    # Lifecycle status badges
│   │   ├── CategoryBadge.tsx  # Civic problem category badges
│   │   ├── ConfidenceMeter.tsx# Confidence meter & top predictions
│   │   ├── StatusTimeline.tsx # Visual 5-stage lifecycle audit tracker
│   │   └── ReportDetailModal.tsx # Full complaint details & transition actions
│   ├── pages/                 # Main application views
│   │   ├── HomePage.tsx       # Landing page, workflow, category showcase
│   │   ├── ReportIssuePage.tsx# Reporting form, image upload, ML analysis
│   │   ├── MyReportsPage.tsx  # Citizen grievance tracking list
│   │   ├── DashboardPage.tsx  # Operations dashboard & analytics
│   │   └── AboutPage.tsx      # System objectives & ML integration guide
│   ├── services/
│   │   └── api.ts             # Typed REST API client
│   ├── types/
│   │   └── index.ts           # Central TypeScript definitions
│   ├── App.tsx                # Main application state & routing
│   └── main.tsx               # DOM entrypoint
├── ml/
│   ├── categories.ts          # Category schema, SLAs, and keywords
│   ├── types.ts               # ICivicClassifier and inference contracts
│   └── classifier/
│       ├── index.ts           # Unified classification entrypoint
│       ├── geminiVisionClassifier.ts  # Multimodal neural vision classifier
│       └── heuristicDemoClassifier.ts # Development fallback classifier
├── database/
│   └── reportStore.ts         # Persistent data layer & sample records
├── server.ts                  # Express REST backend + Vite middleware
└── package.json
```

---

## 5. Environment Variables
Create a `.env` file in the project root:

```env
# Port for the Express server (defaults to 3000)
PORT=3000

# Optional: Google Gemini API key for live multimodal vision classification
# If omitted or left as default, the application runs the Development Heuristic Classifier (Demo Mode)
GEMINI_API_KEY="your-gemini-api-key"
```

---

## 6. How to Run the Application

### Installation
```bash
npm install
```

### Development Mode (Full-Stack)
Runs the unified Express backend with Vite middleware on port 3000:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 7. Connecting a Custom Machine Learning Model (PyTorch / TensorFlow / ONNX)
The classification service follows the `ICivicClassifier` contract defined in `ml/types.ts`:

```typescript
export interface ICivicClassifier {
  name: string;
  isDemoModel: boolean;
  classify(input: ClassificationInput): Promise<ClassificationResult>;
}
```

### Steps to plug in a custom trained model:
1. Export your trained model (e.g. PyTorch ResNet-50 / EfficientNet) to ONNX or TensorFlow.js format (`model.json`).
2. Create `ml/classifier/customModelClassifier.ts`:
   ```typescript
   import { ICivicClassifier, ClassificationInput } from '../types.js';
   import { ClassificationResult } from '../../src/types/index.js';

   export class CustomTrainedClassifier implements ICivicClassifier {
     public name = 'Custom Fine-Tuned EfficientNet-B4 (PyTorch/ONNX)';
     public isDemoModel = false;

     async classify(input: ClassificationInput): Promise<ClassificationResult> {
       // 1. Decode base64 image into RGB tensor (224x224x3)
       // 2. Normalize by ImageNet mean and std
       // 3. Execute inference forward pass
       // 4. Calculate Softmax probabilities across the 7 categories
       // 5. Return ClassificationResult
     }
   }
   ```
3. Update `ml/classifier/index.ts` to instantiate and prioritize your custom classifier.
4. **No changes to UI components or API routes are needed!**

---

## 8. REST API Documentation

### `POST /api/classify`
Analyzes an image and optional description.
- **Request Body**:
  ```json
  {
    "image": "data:image/jpeg;base64,...",
    "description": "Deep asphalt pothole near bus stand",
    "location": "Indiranagar 100ft Road"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "category": "Road Damage / Pothole",
      "confidence": 94,
      "predictions": [
        { "category": "Road Damage / Pothole", "confidence": 94 },
        { "category": "Public Infrastructure Damage", "confidence": 4 },
        { "category": "Drainage / Waterlogging", "confidence": 1 },
        { "category": "Other Civic Issue", "confidence": 1 }
      ],
      "reasoning": "Clear asphalt fissure and surface degradation detected on carriageway.",
      "modelEngine": "Google Gemini 3.8 Flash Vision",
      "isDemoModel": false
    }
  }
  ```

### `POST /api/reports`
Submits a new civic complaint.
- **Request Body**:
  ```json
  {
    "imageUrl": "...",
    "category": "Road Damage / Pothole",
    "confidence": 94,
    "description": "Deep hazardous pothole...",
    "location": "MG Road near Metro Station",
    "landmark": "Opposite Gate 3",
    "contactName": "Citizen Name",
    "contactEmail": "citizen@example.com"
  }
  ```
- **Response**: Status 201 with created `CivicReport` object including generated Report ID (e.g. `CIVIC-2026-8491`).

### `GET /api/reports`
Returns all reports with query filters:
- `?status=Under%20Review`
- `?category=Road%20Damage%20/%20Pothole`
- `?search=indiranagar`

### `GET /api/reports/:id`
Returns a single report and its complete `statusHistory` array.

### `PUT /api/reports/:id/status`
Advances the complaint status.
- **Request Body**:
  ```json
  {
    "status": "In Progress",
    "note": "Road repair team deployed on site",
    "updatedBy": "Ward Officer"
  }
  ```

### `GET /api/stats`
Returns aggregated analytics (counts, category breakdowns, status distributions, average confidence).

---

## 9. Sample End-to-End Workflow
1. **Open the Website**: Browse to the Home page and click **"Report an Issue"**.
2. **Upload Photo & Enter Details**: Select a civic issue image (or click one of the quick test presets like "Road Pothole"), describe the problem, and provide the location.
3. **Analyze**: Click **"Analyze Issue"**. The ML system processes the image and returns the predicted category (e.g. *Road Damage / Pothole*), confidence score (e.g. *94%*), and full probability distribution.
4. **Submit**: Click **"Submit Civic Report"**. The system creates a unique tracking ID (e.g. `CIVIC-2026-1029`).
5. **Track in Dashboard**: Navigate to the **Dashboard** or **My Reports** to see the complaint in the registry, inspect its details, and advance its status through the 5-stage lifecycle.

---

## 10. Known Limitations & Future Improvements
- **Offline Classification**: When running without an internet connection or Gemini API key, the system uses rule-based feature heuristics. Connecting local ONNX WebGL models will enable zero-network in-browser inference.
- **Duplicate Detection**: Future releases could incorporate vector embeddings (e.g. via `gemini-embedding-2-preview`) and geospatial clustering to detect duplicate reports filed by multiple citizens for the same pothole.
- **Automated GIS Mapping**: Direct integration with GIS mapping layers (e.g. Google Maps Platform) for polygon geofencing around wards.

---

## 11. Academic Integrity Statement
This project was developed as a clean, modular computer-science reference architecture for automated civic complaint classification. In development/demonstration mode without an API key, the system transparently notes that heuristic feature scoring is active, avoiding fabricated benchmark metrics or misleading accuracy claims.
