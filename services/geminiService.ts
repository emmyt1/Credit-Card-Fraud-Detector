import { GoogleGenAI, Type } from "@google/genai";
import { TransactionData, PredictionResult, CombinedPredictionResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    prediction: {
      type: Type.STRING,
      description: "The classification of the transaction, either 'Fraudulent' or 'Not Fraudulent'."
    },
    confidence: {
      type: Type.NUMBER,
      description: "A confidence score between 0.0 and 1.0."
    },
    reasoning: {
      type: Type.STRING,
      description: "A brief explanation for the prediction."
    },
  },
  required: ['prediction', 'confidence', 'reasoning'],
};

const getPrediction = async (data: TransactionData, systemInstruction: string): Promise<PredictionResult> => {
  const prompt = `
      Analyze the following transaction data:
      - V10: ${data.v10}
      - V12: ${data.v12}
      - V14: ${data.v14}
      - V17: ${data.v17}
      - Amount: ${data.amount}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result.prediction && typeof result.confidence === 'number' && result.reasoning) {
       return result as PredictionResult;
    } else {
       throw new Error("Invalid JSON structure received from API.");
    }
};


const simulatedXGBoostInstruction = `
You are an AI assistant simulating a highly accurate XGBoost model trained for credit card fraud detection.
Your purpose is to classify transactions based on a set of anonymized features.

BACKGROUND:
The model was trained on a dataset with a severe class imbalance, where only 0.17% of transactions were fraudulent.
The features (V1, V2, etc.) are the result of a PCA transformation on the original transaction data and are all numerical.
The model was optimized to have high sensitivity (recall) for the fraudulent class, meaning it's crucial to identify fraud even if it leads to some false positives.
The most important features for prediction have been identified as V10, V12, V14, and V17. Strongly negative values in these features are highly indicative of fraud.

TASK:
Given the following transaction data, classify it as 'Fraudulent' or 'Not Fraudulent'.
Provide your analysis in the specified JSON format.
- 'prediction': Your classification.
- 'confidence': A score from 0.0 to 1.0 indicating your certainty. A fraudulent transaction should have high confidence.
- 'reasoning': A brief, non-technical explanation for your decision, referencing the feature values provided.
`;

const aiAssistantInstruction = `
You are a helpful AI Financial Assistant. Your task is to analyze a credit card transaction for potential signs of fraud.
Provide your analysis in a specified JSON format.

Consider the provided anonymized features (V10, V12, etc.) and the transaction amount.
While you don't know what the features represent, look for anomalous or extreme values that might suggest unusual activity.

Provide a clear 'Fraudulent' or 'Not Fraudulent' prediction, a confidence score, and a concise, easy-to-understand reasoning for your assessment.
`;

export const analyzeTransaction = async (data: TransactionData): Promise<CombinedPredictionResult> => {
  try {
    const [simulatedModel, aiAssistant] = await Promise.all([
      getPrediction(data, simulatedXGBoostInstruction),
      getPrediction(data, aiAssistantInstruction)
    ]);

    return { simulatedModel, aiAssistant };

  } catch (error) {
    console.error("Error analyzing transaction:", error);
    throw new Error("Failed to get a valid prediction from the AI models.");
  }
};