import React from 'react';

const Loader = ({ message = "Loading guest mode...", username }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-secondary/95 to-secondary overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated geometric shapes */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-secondary/80 z-0"></div>
        
        {/* Animated particles/dots - EXPANDED */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/50 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-3/4 left-2/3 w-2 h-2 bg-primary/50 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 left-3/4 w-2 h-2 bg-primary/50 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-primary/50 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}></div>
        
        {/* Additional dots */}
        <div className="absolute top-1/6 left-1/2 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" style={{ animationDuration: '4.2s', animationDelay: '0.3s' }}></div>
        <div className="absolute top-2/5 left-1/6 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" style={{ animationDuration: '3.8s', animationDelay: '0.7s' }}></div>
        <div className="absolute top-3/5 left-3/5 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" style={{ animationDuration: '3.2s', animationDelay: '1.2s' }}></div>
        <div className="absolute top-4/5 left-2/5 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" style={{ animationDuration: '4.5s', animationDelay: '0.9s' }}></div>
        
        {/* Smaller dots */}
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '0.2s' }}></div>
        <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '4.7s', animationDelay: '1.3s' }}></div>
        <div className="absolute top-1/5 left-4/5 w-1 h-1 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '5.2s', animationDelay: '0.6s' }}></div>
        <div className="absolute top-4/5 left-1/5 w-1 h-1 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '4.8s', animationDelay: '1.7s' }}></div>
        <div className="absolute top-2/5 left-3/5 w-1 h-1 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '5.5s', animationDelay: '0.4s' }}></div>
        
        {/* Animated lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </div>
      
      {/* Logo */}
      <div className="absolute top-8 right-8 z-10">
        <img 
          src="https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg" 
          alt="MGE Logo" 
          className="w-40 h-auto drop-shadow-lg" 
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Avatar with animated loading ring */}
        <div className="relative w-28 h-28 mb-8">
          {/* Inner avatar */}
          <div className="absolute inset-0 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center border border-gray-700/50">
            <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          </div>
          
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/60 animate-spin"></div>
          
          {/* Secondary spinning ring */}
          <div className="absolute inset-2 rounded-full border-4 border-r-white/20 border-l-white/20 border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Welcome text with improved typography */}
        <div className="text-center mb-6">
          <h2 className="text-5xl md:text-6xl font-ea-football text-white mb-2 drop-shadow-lg">
            Welcome, <span className="text-primary">{username || 'Player'}</span>!
          </h2>
          <div className="h-1 w-24 bg-primary/50 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-300 text-lg font-pilot tracking-wide">{message}</p>
        </div>
        
        {/* Loading progress bar */}
        <div className="w-64 h-2 bg-gray-800/50 rounded-full overflow-hidden mt-6 backdrop-blur-sm">
          <div className="h-full bg-primary rounded-full animate-loadingBar"></div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-80 h-80 opacity-40 transform translate-x-1/4 translate-y-1/4">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ff3d08" d="M47.1,-62.9C61.7,-53.2,74.5,-39.7,79.1,-23.9C83.7,-8.1,80,-0.9,74.9,8.5C69.7,17.9,63.1,27.3,55.3,37.4C47.5,47.5,38.5,58.4,26.7,64.1C14.9,69.8,0.4,70.4,-12.2,66.9C-24.9,63.4,-35.8,55.9,-45.9,46.8C-56,37.7,-65.4,27,-68.8,14.5C-72.2,2,-69.6,-12.3,-63.5,-25.1C-57.4,-37.9,-47.8,-49.1,-36.4,-59.9C-25,-70.7,-12.5,-81,1.7,-83.2C15.9,-85.4,32.5,-72.6,47.1,-62.9Z" transform="translate(200 200)" />
        </svg>
      </div>
      
      {/* Add this to your global CSS or tailwind.config.js */}
      <style jsx>{`
        @keyframes loadingBar {
          0% { width: 0; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-loadingBar {
          animation: loadingBar 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;