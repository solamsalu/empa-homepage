
// components/common/SplashScreen.js
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white text-blue-900">
      <div className="text-center space-y-6 animate-fadeIn">
        
        {/* Logo */}
        <div>
          <img 
            src="/empa_logo.jpg" 
            alt="Portal Logo" 
            className="mx-auto h-24 w-24 drop-shadow-xl animate-pulse"
          />
        </div>

        {/* Portal Title */}
        <h1 className="text-4xl font-extrabold tracking-wide">
          EMPA Portal
        </h1>

        {/* Subtitle describing the whole site */}
        <p className="text-lg text-gray-600">
          News • Conferences • Journal • Olympiad • Resources 
        </p>

        {/* Elegant loader */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="h-3 w-3 bg-blue-900 rounded-full animate-bounce"></div>
          <div className="h-3 w-3 bg-blue-900 rounded-full animate-bounce delay-150"></div>
          <div className="h-3 w-3 bg-blue-900 rounded-full animate-bounce delay-300"></div>
        </div>

        {/* Footer note */}
        <p className="text-sm text-gray-400 mt-6">
          Initializing secure access...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
