import React, { useState } from 'react';

const FloatingLabelTextArea = ({ 
  label, 
  value, 
  onChange,
  name,
  error,
  placeholder,
  onBlur,
  rows 
}) => {
  const [isFocused, setIsFocused] = useState(true);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className="relative  text-white">
      <div className="relative">
        <textarea
          name={name}
          value={value || ''}
          placeholder={placeholder || `Enter your ${label}`}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
          className={`
            w-full 
            bg-dark
            text-white 
            angular-cut 
            text-sm 
            text-[10pt] 
            px-6 
            py-3 
            focus:outline-none 
            focus:ring-2 
            focus:ring-black/20 
            peer
            resize-none
            ${error ? 'border border-red-500' : ''}
          `}
        />
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
         -translate-y-9 top-5 left-4 text-xs rounded-md bg-dark px-2
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
export default FloatingLabelTextArea;