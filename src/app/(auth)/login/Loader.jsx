import React from 'react';

const Loader = ({ message = "Loading guest mode...", username }) => {
  return (
     <div className="relative flex flex-col p-36 items-start justify-center min-h-screen bg-gradient-to-br from-black to-primary overflow-hidden">
      {/* YouTube Logo in top right */}
      <div className="absolute top-0 right-16">
             <img src="https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg" alt="YouTube Logo" className="w-32 h-32" />
      </div>

      {/* Avatar and Loading Animation */}
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 rounded-full bg-gray-800 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
        </div>
        {/* Spinner animation */}
        <div className="absolute inset-0 border-4 border-t-gray-200 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      
      {/* Welcome text */}
      <h2 className="text-6xl font-ea-football text-white mb-1">Welcome ,{username} !</h2>
      <p className="text-gray-400 text-lg font-black">{message}</p>

      {/* Illustration in bottom right */}
      <div className="absolute bottom-0 right-0 w-72 h-72 opacity-70">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ff3d08" d="M47.1,-62.9C61.7,-53.2,74.5,-39.7,79.1,-23.9C83.7,-8.1,80,-0.9,74.9,8.5C69.7,17.9,63.1,27.3,55.3,37.4C47.5,47.5,38.5,58.4,26.7,64.1C14.9,69.8,0.4,70.4,-12.2,66.9C-24.9,63.4,-35.8,55.9,-45.9,46.8C-56,37.7,-65.4,27,-68.8,14.5C-72.2,2,-69.6,-12.3,-63.5,-25.1C-57.4,-37.9,-47.8,-49.1,-36.4,-59.9C-25,-70.7,-12.5,-81,1.7,-83.2C15.9,-85.4,32.5,-72.6,47.1,-62.9Z" transform="translate(200 200)" />
        </svg>
      </div>
    </div>
  );
};

export default Loader;