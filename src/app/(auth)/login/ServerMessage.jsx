import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const ServerMessage = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500/10 to-green-600/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500/10 to-red-600/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: <XCircle className="w-5 h-5 text-red-400" />,
    },
  };

  const currentStyle = styles[type];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`
            relative
            overflow-hidden
            backdrop-blur-sm
            rounded-xl
            border
            ${currentStyle.bg}
            ${currentStyle.border}
            ${currentStyle.text}
            p-4
            pr-12
            shadow-lg
            flex
            items-center
            gap-3
            w-full
            pointer-events-auto
          `}
        >
          {/* Background pulse effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 ${currentStyle.bg} filter blur-xl`}
          />

          {/* Content */}
          <div className="flex items-center gap-3 relative z-10">
            {currentStyle.icon}
            <span className="text-sm font-medium">{message}</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className={`
              absolute 
              right-4 
              top-1/2 
              -translate-y-1/2
              ${currentStyle.text}
              hover:opacity-70
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-offset-gray-800
              focus:ring-${type === 'success' ? 'green' : 'red'}-500/50
              transition-all
              duration-200
              rounded-full
              p-1
            `}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className={`
              absolute
              bottom-0
              left-0
              h-0.5
              ${type === 'success' ? 'bg-green-400/30' : 'bg-red-400/30'}
            `}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ServerMessage;