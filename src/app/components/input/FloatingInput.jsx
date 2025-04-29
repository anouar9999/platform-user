import React, { useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';

const FloatingLabelInput = ({ 
  label, 
  type = 'text', 
  icon: Icon, 
  value, 
  onChange,
  name,
  error,
  placeholder,
  onBlur,
  classNames
}) => {
  const [isFocused, setIsFocused] = useState(true);
  const [showPassword, setShowPassword] = useState(true);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="relative  text-white">
      <div className="relative">
        <input
          name={name}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value || ''}
          placeholder={placeholder || `Enter your ${label}`}
          onChange={onChange}
          onFocus={handleFocus}   
          className={`
            ${classNames}
            w-full 
            bg-dark
            angular-cut
            text-white 
            
            text-sm 
            text-[10pt] 
            px-6 
            py-3 
            focus:outline-none 
            focus:ring-2 
            focus:ring-black/20 
            peer
            ${error ? 'border border-red-500' : ''}
            pr-12
          `}
        />
        
        {/* Right Icon */}
        {type === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        ) : Icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
      </div>

      <label
        className={`
          absolute 
          transition-all 
          text-[12pt] 
          font-custom 
          leading-tight 
          tracking-widest 
          duration-200 
          pointer-events-none 
          ${error ? 'text-red-400' : 'text-gray-400'}
          ${(isFocused || value) 
            ? '-translate-y-9 top-5 left-4 text-xs rounded-md bg-dark px-2' 
            : 'text-base left-6 top-1/2 -translate-y-1/2'
          }
        `}
      >
        {label}
      </label>

      {error && (
        <span className="text-red-400 text-xs mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
};

export default FloatingLabelInput;