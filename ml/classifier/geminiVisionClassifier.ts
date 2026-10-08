import { GoogleGenAI } from '@google/genai';
import { ICivicClassifier, ClassificationInput } from '../types.js';
import { CivicCategory, ClassificationResult, PredictionItem } from '../../src/types/index.js';
import { CIVIC_CATEGORIES, CATEGORY_NAMES } from '../categories.js';

export class GeminiVisionClassifier implements ICivicClassifier {
  public name = 'Google Gemini 3.8 Flash Vision (Multimodal Neural Classifier)';
  public isDemoModel = false;
  private client: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        this.client = new GoogleGenAI();
      } catch (err) {
        console.warn('[GeminiVisionClassifier] Failed to initialize GoogleGenAI client:', err);
      }
    }
  }

  public isAvailable(): boolean {
    const apiKey = process.env.GEMINI_API_KEY;
    return Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');
  }

  async classify(input: ClassificationInput): Promise<ClassificationResult> {
    if (!this.client) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        this.client = new GoogleGenAI();
      } else {
        throw new Error('GEMINI_API_KEY is not configured for GeminiVisionClassifier.');
      }
    }

    // Extract mime type and base64 data
    let mimeType = 'image/jpeg';
    let base64Data = input.image;

    const dataUrlMatch = input.image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1];
      base64Data = dataUrlMatch[2];
    } else if (input.image.startsWith('data:')) {
      const parts = input.image.split(',');
      base64Data = parts[1] || parts[0];
    }

    const categoriesListStr = CIVIC_CATEGORIES.map((c) => `- "${c.name}": ${c.description}`).join('\n');

    const promptText = `
You are a computer vision civic infrastructure classification engine for a smart city municipal reporting system.
Analyze this civic issue photo and the user's description (if provided).

Allowed Categories (choose strictly from this list):
${categoriesListStr}

User provided description: "${input.description || 'None provided'}"

Tasks:
1. Examine visual elements (road surface, debris, water, lights, signs, municipal assets).
2. Assign the primary predicted category from the allowed list.
3. Determine a realistic confidence percentage (integer between 50 and 99) for the primary category based on visual clarity.
4. Provide confidence scores for all 7 categories such that the primary category has the highest score and the remaining categories sum reasonably (all 7 categories must be present).
5. Give a concise 1-2 sentence visual reasoning explaining what visual cues led to this classification.

Respond ONLY with valid JSON in this exact structure without markdown backticks:
{
  "category": "Road Damage / Pothole",
  "confidence": 92,
  "reasoning": "Clear depression and asphalt fracture visible on the paved carriageway posing vehicular hazard.",
  "predictions": [
    { "category": "Road Damage / Pothole", "confidence": 92 },
    { "category": "Public Infrastructure Damage", "confidence": 4 },
    { "category": "Drainage / Waterlogging", "confidence": 2 },
    { "category": "Garbage / Waste", "confidence": 1 },
    { "category": "Traffic / Road Sign Issue", "confidence": 1 },
    { "category": "Streetlight Problem", "confidence": 0 },
    { "category": "Other Civic Issue", "confidence": 0 }
  ]
}
`;

    const response = await this.client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType.includes('png') ? 'image/png' : 'image/jpeg',
                data: base64Data,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    let parsed: any;
    try {
      // Clean possible markdown code fences if any
      const cleaned = responseText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('[GeminiVisionClassifier] JSON parse error:', e, 'Raw output:', responseText);
      throw new Error('Failed to parse Gemini vision classification response.');
    }

    // Validate category
    let predictedCategory: CivicCategory = 'Other Civic Issue';
    if (CATEGORY_NAMES.includes(parsed.category)) {
      predictedCategory = parsed.category;
    } else {
      const match = CATEGORY_NAMES.find(c => c.toLowerCase().includes((parsed.category || '').toLowerCase()));
      if (match) predictedCategory = match;
    }

    const confidence = typeof parsed.confidence === 'number' ? Math.min(Math.max(parsed.confidence, 40), 99) : 88;

    // Ensure all 7 categories exist in predictions
    const predictionsMap = new Map<string, number>();
    if (Array.isArray(parsed.predictions)) {
      parsed.predictions.forEach((p: any) => {
        if (p && p.category && typeof p.confidence === 'number') {
          predictionsMap.set(p.category, Math.round(p.confidence));
        }
      });
    }

    predictionsMap.set(predictedCategory, confidence);

    let remainingTotal = 100 - confidence;
    const missingCategories = CATEGORY_NAMES.filter(c => c !== predictedCategory);
    let currentSum = 0;
    missingCategories.forEach(c => {
      const val = predictionsMap.get(c) || 0;
      currentSum += val;
    });

    const predictions: PredictionItem[] = [
      { category: predictedCategory, confidence },
    ];

    missingCategories.forEach((c) => {
      const raw = predictionsMap.get(c) || 0;
      const normalized = currentSum > 0 ? Math.round((raw / currentSum) * remainingTotal) : Math.floor(remainingTotal / missingCategories.length);
      predictions.push({
        category: c,
        confidence: Math.max(0, normalized),
      });
    });

    // Sort descending
    predictions.sort((a, b) => b.confidence - a.confidence);

    return {
      category: predictedCategory,
      confidence,
      predictions,
      reasoning: parsed.reasoning || `Detected visual features characteristic of ${predictedCategory}.`,
      modelEngine: this.name,
      isDemoModel: false,
      analyzedAt: new Date().toISOString(),
    };
  }
}
