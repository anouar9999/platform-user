const ScannableTitle = ({ primaryText, secondaryText, className = "" }) => {
  return (
    <div className="relative inline-block">
      <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight font-zentry special-font ${className}`}>
        {primaryText && (
          <>
            <span className="relative inline-block text-white">
              {primaryText}
            </span>
            <br />
          </>
        )}
        
        {/* Secondary text with special effects */}
        <span className="relative inline-block group mt-1 sm:mt-0">
          {/* Glowing background */}
          <span className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-400/20 to-orange-500/20 blur-xl sm:blur-2xl animate-pulse"></span>
          
          {/* Main text with gradient */}
          <span className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            {secondaryText}
          </span>
          
          {/* Scanline effect overlay */}
          <span className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)] pointer-events-none"></span>
          
          {/* Animated scan beam */}
          <span className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent h-full w-full opacity-0 animate-scan pointer-events-none"></span>
          
          {/* Glitch lines - hidden on mobile for performance */}
          <span className="hidden sm:block absolute left-0 top-1/4 w-full h-px bg-orange-500/50 animate-glitch-1"></span>
          <span className="hidden sm:block absolute left-0 top-2/4 w-full h-px bg-orange-400/50 animate-glitch-2"></span>
          <span className="hidden sm:block absolute left-0 top-3/4 w-full h-px bg-orange-500/50 animate-glitch-3"></span>
          
          {/* Corner brackets - scaled for mobile */}
          <span className="absolute -left-1 sm:-left-2 -top-0.5 sm:-top-1 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-orange-500 opacity-70"></span>
          <span className="absolute -right-1 sm:-right-2 -top-0.5 sm:-top-1 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-orange-500 opacity-70"></span>
          <span className="absolute -left-1 sm:-left-2 -bottom-0.5 sm:-bottom-1 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-orange-500 opacity-70"></span>
          <span className="absolute -right-1 sm:-right-2 -bottom-0.5 sm:-bottom-1 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-orange-500 opacity-70"></span>
          
          {/* Digital noise effect */}
          <span className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></span>
        </span>
      </h1>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        
        @keyframes scan {
          0% { top: -100%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        @keyframes glitch-1 {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          25% { transform: translateX(-5px); opacity: 0.8; }
          50% { transform: translateX(5px); opacity: 0.3; }
          75% { transform: translateX(-3px); opacity: 0.6; }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translateX(0); opacity: 0.3; }
          33% { transform: translateX(4px); opacity: 0.7; }
          66% { transform: translateX(-4px); opacity: 0.4; }
        }
        
        @keyframes glitch-3 {
          0%, 100% { transform: translateX(0); opacity: 0.4; }
          40% { transform: translateX(-6px); opacity: 0.6; }
          80% { transform: translateX(3px); opacity: 0.5; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-scan {
          animation: scan 4s ease-in-out infinite;
        }
        
        .animate-glitch-1 {
          animation: glitch-1 2.5s ease-in-out infinite;
        }
        
        .animate-glitch-2 {
          animation: glitch-2 3s ease-in-out infinite;
        }
        
        .animate-glitch-3 {
          animation: glitch-3 2.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ScannableTitle;