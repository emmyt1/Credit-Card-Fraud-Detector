import React, { useState, useCallback } from 'react';
import { TransactionData, CombinedPredictionResult, PredictionStatus } from '../types';
import { NON_FRAUD_EXAMPLE, FRAUD_EXAMPLE } from '../constants';
import { analyzeTransaction } from '../services/geminiService';
import Loader from './Loader';
import ResultCard from './ResultCard';

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const initialTransactionData: TransactionData = {
  v10: '',
  v12: '',
  v14: '',
  v17: '',
  amount: '',
};

const FraudDetector: React.FC = () => {
  const [transactionData, setTransactionData] = useState<TransactionData>(initialTransactionData);
  const [status, setStatus] = useState<PredictionStatus>(PredictionStatus.Idle);
  const [result, setResult] = useState<CombinedPredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(PredictionStatus.Loading);
    setResult(null);
    setError(null);

    try {
      const prediction = await analyzeTransaction(transactionData);
      setResult(prediction);
      setStatus(PredictionStatus.Success);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus(PredictionStatus.Error);
    }
  }, [transactionData]);
  
  const handleReset = () => {
    setTransactionData(initialTransactionData);
    setStatus(PredictionStatus.Idle);
    setResult(null);
    setError(null);
  }

  const loadExample = (exampleData: TransactionData) => {
    setTransactionData(exampleData);
    setStatus(PredictionStatus.Idle);
    setResult(null);
    setError(null);
  };

  const renderResult = () => {
    if (status === PredictionStatus.Loading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg h-full">
          <Loader />
          <p className="mt-4 text-lg font-medium text-gray-600 animate-pulse">Analyzing Transaction...</p>
          <p className="text-sm text-gray-500">Running dual analysis...</p>
        </div>
      );
    }
    
    if (status === PredictionStatus.Error && error) {
       return (
         <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
           <h3 className="font-bold text-lg">Analysis Failed</h3>
           <p>{error}</p>
         </div>
       )
    }

    if (status === PredictionStatus.Success && result) {
      return (
        <div className="space-y-6">
          <ResultCard title="Simulated XGBoost Model" result={result.simulatedModel} />
          <ResultCard title="AI Financial Assistant" result={result.aiAssistant} />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg lg:col-span-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Transaction Analysis</h2>
        <p className="text-gray-600 mb-6">Enter transaction details to check for potential fraud.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {(Object.keys(transactionData) as Array<keyof TransactionData>).map((key) => (
               <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize flex items-center">
                  {key}
                  {key !== 'amount' && (
                     <div className="relative group ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-400" />
                        <span className="absolute bottom-full mb-2 w-48 p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            This is an anonymized feature from a PCA transformation. Strongly negative values can indicate fraud.
                        </span>
                     </div>
                  )}
                </label>
                <input
                  type="text"
                  name={key}
                  id={key}
                  value={transactionData[key]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={`Enter value for ${key}`}
                  required
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button
              type="submit"
              disabled={status === PredictionStatus.Loading}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {status === PredictionStatus.Loading ? 'Analyzing...' : 'Check Transaction'}
            </button>
             <button
              type="button"
              onClick={handleReset}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Reset
            </button>
          </div>
        </form>
         <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Or load an example:</p>
          <div className="flex space-x-2">
            <button onClick={() => loadExample(NON_FRAUD_EXAMPLE)} className="text-xs py-1 px-3 bg-green-100 text-green-800 rounded-full hover:bg-green-200">Normal Case</button>
            <button onClick={() => loadExample(FRAUD_EXAMPLE)} className="text-xs py-1 px-3 bg-red-100 text-red-800 rounded-full hover:bg-red-200">Fraudulent Case</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg lg:col-span-3">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dual Analysis Result</h2>
        <div className="min-h-[300px]">
          {status === PredictionStatus.Idle && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">The prediction results from both models will be displayed here.</p>
            </div>
          )}
          {renderResult()}
        </div>
      </div>
    </div>
  );
};

export default FraudDetector;