export interface TransactionData {
  v10: string;
  v12: string;
  v14: string;
  v17: string;
  amount: string;
}

export interface PredictionResult {
  prediction: 'Fraudulent' | 'Not Fraudulent';
  confidence: number;
  reasoning: string;
}

export interface CombinedPredictionResult {
  simulatedModel: PredictionResult;
  aiAssistant: PredictionResult;
}

export enum PredictionStatus {
  Idle,
  Loading,
  Success,
  Error
}