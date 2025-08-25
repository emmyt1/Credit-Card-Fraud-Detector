
import React from 'react';
import Header from './components/Header';
import FraudDetector from './components/FraudDetector';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FraudDetector />
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; 2024 Credit Card Fraud Detection Systems. All rights reserved.</p>
        <p>This is a demo application. Do not use for real financial decisions.</p>
      </footer>
    </div>
  );
};

export default App;
