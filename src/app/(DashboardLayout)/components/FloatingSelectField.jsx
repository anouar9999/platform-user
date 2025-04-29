import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FloatingSelectField = ({ 
    label, 
    value, 
    onChange, 
    options,
    error,
    name 
  }) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
      <div className="relative mb-8 text-white">
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
              appearance-none
              ${error ? 'border border-red-500' : ''}
            `}
          >
            {options.map(opt => (
              <option 
                key={opt.value || opt} 
                value={opt.value || opt}
                className="bg-dark border-none"
              >
                {opt.label || opt}
              </option>
            ))}
          </select>
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown size={20} className="text-gray-400" />
          </div>
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
  export default FloatingSelectField;