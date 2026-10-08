import { ICivicClassifier, ClassificationInput } from '../types.js';
import { ClassificationResult } from '../../src/types/index.js';
import { GeminiVisionClassifier } from './geminiVisionClassifier.js';
import { HeuristicDemoClassifier } from './heuristicDemoClassifier.js';

const geminiClassifier = new GeminiVisionClassifier();
const demoClassifier = new HeuristicDemoClassifier();

/**
 * Main ML Classification Service Interface
 *
 * Requirements satisfied:
 * - Isolated from UI
 * - Returns { category, confidence, predictions }
 * - Does not falsely claim demo model is trained
 * - Replaceable with TensorFlow / PyTorch / ONNX / Custom API
 */
export async function classifyCivicIssue(
  image: string,
  description?: string,
  location?: string
): Promise<ClassificationResult> {
  const input: ClassificationInput = { image, description, location };

  // Attempt Gemini Vision multimodal classification if configured
  if (geminiClassifier.isAvailable()) {
    try {
      console.log('[ML Service] Attempting classification via Google Gemini 3.8 Flash Vision...');
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini Vision API timeout after 7.5s')), 7500)
      );
      const result = await Promise.race([geminiClassifier.classify(input), timeoutPromise]);
      console.log('[ML Service] Gemini Vision classified as:', result.category, `(${result.confidence}%)`);
      return result;
    } catch (err: any) {
      console.warn('[ML Service] Gemini Vision API failed or timed out, falling back to Demo Classifier:', err?.message || err);
    }
  }

  // Fallback to Development Demo Classifier
  console.log('[ML Service] Running Development Heuristic Demo Classifier...');
  return await demoClassifier.classify(input);
}

export function getActiveClassifierInfo(): {
  name: string;
  isDemoModel: boolean;
  engine: string;
  description: string;
} {
  if (geminiClassifier.isAvailable()) {
    return {
      name: geminiClassifier.name,
      isDemoModel: false,
      engine: 'Gemini 3.8 Flash Multimodal Neural Vision',
      description: 'Zero-shot deep computer vision model analyzing image features and textual context.',
    };
  }

  return {
    name: demoClassifier.name,
    isDemoModel: true,
    engine: 'Development Feature Classifier (Demo Fallback)',
    description: 'Rule-based feature extraction & linguistic scoring for development without API keys.',
  };
}
