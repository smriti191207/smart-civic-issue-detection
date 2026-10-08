import { CivicCategory, ClassificationResult } from '../src/types/index.js';

export interface ClassificationInput {
  image: string; // Base64 data URL or raw base64 string
  description?: string;
  location?: string;
}

export interface ICivicClassifier {
  name: string;
  isDemoModel: boolean;
  classify(input: ClassificationInput): Promise<ClassificationResult>;
}
