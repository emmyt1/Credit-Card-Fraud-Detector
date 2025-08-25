
import React from 'react';

const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.53 14.03a.75.75 0 00-1.06 0l-3-3a.75.75 0 10-1.06 1.06l3.53 3.53a.75.75 0 001.06 0l7.53-7.53a.75.75 0 00-1.06-1.06l-7 7z" clipRule="evenodd" />
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            AI Fraud Detector
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
