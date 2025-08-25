import React from 'react';
import { PredictionResult } from '../types';

interface ResultCardProps {
  title: string;
  result: PredictionResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, result }) => {
  const isFraudulent = result.prediction === 'Fraudulent';
  const bgColor = isFraudulent ? 'bg-red-50' : 'bg-green-50';
  const borderColor = isFraudulent ? 'border-red-200' : 'border-green-200';
  const textColor = isFraudulent ? 'text-red-900' : 'text-green-900';
  const confidenceColor = isFraudulent ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800';
  const confidenceWidth = `${Math.round(result.confidence * 100)}%`;

  return (
    <div className={`p-5 rounded-lg border ${bgColor} ${borderColor} ${textColor} transition-all duration-300`}>
      <h4 className="font-bold text-lg text-gray-700 mb-2">{title}</h4>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold">{result.prediction}</h3>
          <p className="mt-2 text-base opacity-90">{result.reasoning}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${confidenceColor}`}>
          {`Confidence: ${(result.confidence * 100).toFixed(1)}%`}
        </span>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className={`${isFraudulent ? 'bg-red-600' : 'bg-green-600'} h-2.5 rounded-full`} style={{ width: confidenceWidth }}></div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
