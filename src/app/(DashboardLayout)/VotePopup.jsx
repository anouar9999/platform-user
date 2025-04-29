import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const VotePopup = ({ onClose, question }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Get the appropriate options based on the question
  const getOptions = () => {
    switch (question.id) {
      case 'experience':
        return ['Excellent', 'Good', 'Average', 'Poor'];
      case 'difficulty':
        return ['Too Easy', 'Just Right', 'Challenging', 'Too Difficult'];
      case 'features':
        return ['Matchmaking', 'Rewards System', 'Social Features', 'Game Modes'];
      case 'improvement':
        return ['UI/UX', 'Performance', 'Content', 'Gameplay'];
      case 'recommendation':
        return ['Definitely', 'Probably', 'Not Sure', 'Unlikely'];
      default:
        return ['Yes', 'No', 'Maybe', 'Not Sure'];
    }
  };
  
  // Replace question icon with logo
  const getLogo = () => {
    // You can customize this SVG logo or replace it with an image
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        width="32" 
        height="32" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-purple-500"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    );
  };
  
  // Removed gradient function

  // Get border color based on question type
  const getBorderColor = () => {
    switch (question.id) {
      case 'experience': return 'border-yellow-500/50';
      case 'difficulty': return 'border-blue-500/50';
      case 'features': return 'border-green-500/50';
      case 'improvement': return 'border-red-500/50';
      case 'recommendation': return 'border-pink-500/50';
      default: return 'border-purple-500/50';
    }
  };
  
  // Get button highlight color based on question type
  const getButtonHighlightColor = () => {
    switch (question.id) {
      case 'experience': return 'bg-yellow-600 border-yellow-500 hover:bg-yellow-700';
      case 'difficulty': return 'bg-blue-600 border-blue-500 hover:bg-blue-700';
      case 'features': return 'bg-green-600 border-green-500 hover:bg-green-700';
      case 'improvement': return 'bg-red-600 border-red-500 hover:bg-red-700';
      case 'recommendation': return 'bg-pink-600 border-pink-500 hover:bg-pink-700';
      default: return 'bg-purple-600 border-purple-500 hover:bg-purple-700';
    }
  };
  
  useEffect(() => {
    // Reset animation state when a new question appears
    setIsAnimating(true);
    
    // End animation after 1 second
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [question.id]);
  
  const handleVote = () => {
    // Here you can implement the logic to submit the vote
    console.log('Question:', question.id);
    console.log('Voted:', selectedOption);
    onClose(question.id, selectedOption);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => onClose(null, null)}></div>
      
      {/* Popup Card */}
      <div 
        className={`relative z-10 bg-gray-800 angular-cut p-6 pt-4 w-full max-w-2xl mx-4 shadow-xl shadow-purple-500/30 transform ${isAnimating ? 'scale-105' : 'scale-100'} transition-all duration-500`}
      >
        {/* Removed glowing accent */}
        
        {/* Close Button */}
        <button 
          onClick={() => onClose(null, null)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white bg-gray-800/60 rounded-full p-1 transition-all hover:bg-gray-700/80"
        >
          <X size={20} />
        </button>
        
        {/* Content */}
        <div className="text-center mb-6 relative z-10">
          <div className="flex items-center justify-center mb-2">
           
            <h3 className="text-2xl font-valorant text-white">{question.title}</h3>
          </div>
          <p className="text-gray-300 font-pilot px-4">{question.description}</p>
        </div>
        
        {/* Divider */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-6">
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary"></div>
        </div>
        
        {/* Voting Options */}
        <div className="grid grid-cols-4 gap-3 mb-6 relative z-10">
          {getOptions().map((option) => (
            <button
              key={option}
              className={`py-3 px-4 rounded-md border transition-all font-pilot flex flex-col items-center justify-center h-full ${
                selectedOption === option
                  ? ' bg-primary text-white shadow-lg shadow-purple-700/20'
                  : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700/80'
              }`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
        
        {/* Submit Button */}
        <button
          onClick={handleVote}
          disabled={!selectedOption}
          className={`w-full py-3 rounded-md font-bold font-valorant text-lg transition-all relative z-10 ${
            selectedOption
              ?  ' bg-primary text-white shadow-lg'
              : 'bg-gray-800/70 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedOption ? 'SUBMIT' : 'SELECT AN OPTION'}
        </button>
        
        {/* Footer text */}
        <div className="text-center mt-3 text-xs text-gray-500 font-pilot">
          Your feedback helps us improve your gaming experience
        </div>
      </div>
    </div>
  );
};

export default VotePopup;