import React from 'react';

interface CircularDisplayProps {
  time: number;
  isRunning: boolean;
  isResetting: boolean;
}

const CircularDisplay: React.FC<CircularDisplayProps> = ({ time, isRunning, isResetting }) => {
  // Calculate rotation for the second hand (0 to 360 degrees)
  const degrees = (time % 60000) / 60000 * 360;
  
  const radius = 130;
  const center = radius;

  // Generate 60 ticks for the clock face
  const ticks = Array.from({ length: 60 }).map((_, i) => {
    const isMajor = i % 5 === 0;
    return (
      <line
        key={i}
        x1={center}
        y1={isMajor ? 10 : 15}
        x2={center}
        y2={isMajor ? 25 : 20}
        stroke={isMajor ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)"}
        strokeWidth={isMajor ? 2 : 1}
        strokeLinecap="round"
        transform={`rotate(${i * 6} ${center} ${center})`}
      />
    );
  });

  // Generate Clock Numbers (05, 10, ... 60)
  const clockNumbers = Array.from({ length: 12 }).map((_, i) => {
     const num = (i + 1) * 5;
     // Format numbers with leading zero (e.g. 05, 10...)
     const numStr = num.toString().padStart(2, '0');
     
     const angle = (i + 1) * 30; // 30 degrees increments
     const radian = (angle * Math.PI) / 180;
     const numberRadius = 95; // Position inside ticks
     
     const x = center + numberRadius * Math.sin(radian);
     const y = center - numberRadius * Math.cos(radian);

     return (
        <text
           key={num}
           x={x}
           y={y}
           fill="rgba(255, 255, 255, 0.6)"
           fontSize="14"
           fontFamily="Outfit"
           fontWeight="600"
           textAnchor="middle"
           dominantBaseline="middle"
           className="select-none"
        >
           {numStr}
        </text>
     );
  });

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Container with animation classes */}
      <div className={`relative w-[320px] h-[320px] flex items-center justify-center ${isResetting ? 'animate-reset-flash' : ''}`}>
        
        {/* Soft backlight with conditional animation */}
        <div className={`absolute inset-0 bg-white/5 blur-3xl rounded-full transition-all duration-1000 ${isRunning && !isResetting ? 'animate-pulse-glow' : ''}`}></div>

        {/* Analog Clock Layer (Foreground) */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="absolute inset-0 z-10"
        >
          <defs>
            <linearGradient id="handGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            
            <filter id="handGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Clock Ticks */}
          <g>{ticks}</g>
          
          {/* Clock Numbers */}
          <g>{clockNumbers}</g>

          {/* Rotating Second Hand */}
          <g transform={`rotate(${degrees} ${center} ${center})`}>
             {/* Tail Counterweight */}
             <line
                x1={center}
                y1={center}
                x2={center}
                y2={center + 20}
                stroke="#fff"
                strokeWidth="2"
                strokeOpacity="0.3"
                strokeLinecap="round"
             />

             {/* Main Hand Line */}
             <line
                x1={center}
                y1={center}
                x2={center}
                y2={35} 
                stroke="url(#handGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#handGlow)"
             />
             
             {/* Glowing Tip */}
             <circle 
                cx={center} 
                cy={35} 
                r={3} 
                fill="#fff" 
                filter="url(#handGlow)"
             />

             {/* Center Pivot Mechanism */}
             <circle cx={center} cy={center} r={5} fill="#1e293b" stroke="#fff" strokeWidth="2" />
             <circle cx={center} cy={center} r={2} fill="#fb7185" />
          </g>
        </svg>

      </div>
    </div>
  );
};

export default CircularDisplay;