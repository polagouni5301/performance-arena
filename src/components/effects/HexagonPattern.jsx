const HexagonPattern = ({ opacity = 0.1, animated = true }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern 
            id="hexPattern" 
            width="56" 
            height="100" 
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.5)"
          >
            <path 
              d="M28 0 L56 14 L56 42 L28 56 L0 42 L0 14 Z" 
              fill="none" 
              stroke={`hsla(280, 100%, 60%, ${opacity})`}
              strokeWidth="0.5"
            />
            <path 
              d="M28 50 L56 64 L56 92 L28 106 L0 92 L0 64 Z" 
              fill="none" 
              stroke={`hsla(195, 100%, 50%, ${opacity * 0.7})`}
              strokeWidth="0.5"
            />
          </pattern>
          
          {animated && (
            <linearGradient id="hexGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsla(280, 100%, 60%, 0.3)">
                <animate 
                  attributeName="stop-color" 
                  values="hsla(280, 100%, 60%, 0.3);hsla(195, 100%, 50%, 0.3);hsla(280, 100%, 60%, 0.3)" 
                  dur="4s" 
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="hsla(195, 100%, 50%, 0.1)">
                <animate 
                  attributeName="stop-color" 
                  values="hsla(195, 100%, 50%, 0.1);hsla(280, 100%, 60%, 0.1);hsla(195, 100%, 50%, 0.1)" 
                  dur="4s" 
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          )}
        </defs>
        
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
        
        {animated && (
          <rect 
            width="100%" 
            height="100%" 
            fill="url(#hexGlow)" 
            opacity="0.1"
          />
        )}
      </svg>
    </div>
  );
};

export default HexagonPattern;